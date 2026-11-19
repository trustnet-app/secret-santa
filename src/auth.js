// TrustNet sign-in, following https://docs.trustnet.app/
// Authorization code + PKCE, client_secret_basic, scope "openid" only.
// We request the nickname claim for member names; `sub` remains the only identity key.

import { createHash, randomBytes } from "node:crypto";
import express from "express";
import { compactVerify, createRemoteJWKSet, jwtVerify } from "jose";
import db from "./db.js";

const ISSUER = process.env.TRUSTNET_ISSUER || "https://id.trustnet.app";
const CLIENT_ID = process.env.TRUSTNET_CLIENT_ID || "";
const CLIENT_SECRET = process.env.TRUSTNET_CLIENT_SECRET || "";
const BASE_URL = (process.env.BASE_URL || "http://localhost:5556").replace(/\/$/, "");
const REDIRECT_URI = `${BASE_URL}/redirect`;
export const ISSUER_ORIGIN = new URL(ISSUER).origin;
export const SECURE = BASE_URL.startsWith("https://");
const PROD = process.env.NODE_ENV === "production";
export const DEV_LOGIN = !PROD && process.env.DEV_FAKE_LOGIN === "1";

const SESSION_COOKIE = "santa_session";
const STATE_COOKIE = "santa_state";
const SESSION_DAYS = 30;

const idJwks = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));
const webhookJwks = createRemoteJWKSet(
  new URL(process.env.TRUSTNET_WEBHOOK_JWKS || "https://rp.trustnet.app/api/v1/webhook/jwks"),
);

const rand = (n = 32) => randomBytes(n).toString("base64url");
const now = () => Math.floor(Date.now() / 1000);

// Only ever redirect back to a path on this site.
const safePath = (p) => (typeof p === "string" && /^\/(?!\/)[\w\-./]*$/.test(p) ? p : "/");

export function readCookie(req, name) {
  for (const part of (req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

const cookieOpts = (maxAgeSeconds) => ({
  httpOnly: true,
  sameSite: "lax",
  secure: SECURE,
  path: "/",
  maxAge: maxAgeSeconds * 1000,
});

function startSession(res, userId, sid = null, idToken = null) {
  const id = rand();
  db.prepare(
    "INSERT INTO sessions (id, user_id, sid, id_token, csrf, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(id, userId, sid, idToken, rand(18), now() + SESSION_DAYS * 86400);
  res.cookie(SESSION_COOKIE, id, cookieOpts(SESSION_DAYS * 86400));
}

function upsertUser(sub) {
  db.prepare("INSERT INTO users (sub) VALUES (?) ON CONFLICT (sub) DO NOTHING").run(sub);
  return db.prepare("SELECT id FROM users WHERE sub = ?").get(sub).id;
}

// The nickname claim is read from the ID token we verified at sign-in. It only
// seeds members.nickname; `sub` remains the sole identity key.
export function sessionNickname(session) {
  if (!session) return null;
  if (session.id_token) {
    try {
      const payload = JSON.parse(
        Buffer.from(session.id_token.split(".")[1], "base64url").toString("utf8"),
      );
      const nickname = String(payload.nickname ?? "").replace(/\s+/g, " ").trim().slice(0, 30);
      if (nickname) return nickname;
    } catch {
      // An unreadable stored token is treated as no nickname claim.
    }
  }
  const user = db.prepare("SELECT sub FROM users WHERE id = ?").get(session.user_id);
  if (!user?.sub?.startsWith("dev:")) return null;
  return String(user.sub.slice(4)).replace(/\s+/g, " ").trim().slice(0, 30) || null;
}

// Attaches req.session ({ id, user_id, csrf, ... }) when the visitor is signed in.
export function loadSession(req, _res, next) {
  const id = readCookie(req, SESSION_COOKIE);
  if (id) {
    const s = db.prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > ?").get(id, now());
    if (s) req.session = s;
  }
  next();
}

export function requireUser(req, res, next) {
  if (req.session) return next();
  res.redirect(`/login?next=${encodeURIComponent(safePath(req.originalUrl))}`);
}

// Every signed-in form post must carry the session's CSRF token.
export function checkCsrf(req, res, next) {
  if (req.method !== "POST") return next();
  if (req.session && req.body?._csrf === req.session.csrf) return next();
  res.status(403).send("This form has expired. Go back, reload the page and try again.");
}

// Forget a person: called by the erasure webhook.
// Open groups lose the member outright. Drawn groups keep an anonymous
// placeholder so everyone else's draw still makes sense.
export function purgeUser(sub) {
  const user = db.prepare("SELECT id FROM users WHERE sub = ?").get(sub);
  if (!user) return;
  db.transaction(() => {
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
    db.prepare(
      `DELETE FROM members WHERE user_id = ? AND group_id IN
         (SELECT id FROM groups WHERE drawn_at IS NULL AND organiser_id != ?)`,
    ).run(user.id, user.id);
    const left = db.prepare("SELECT id FROM members WHERE user_id = ?").all(user.id);
    for (const m of left) {
      db.prepare("DELETE FROM wishes WHERE member_id = ?").run(m.id);
      db.prepare("UPDATE members SET nickname = 'Someone who left' WHERE id = ?").run(m.id);
    }
    db.prepare("UPDATE users SET sub = ? WHERE id = ?").run(`erased:${rand(12)}`, user.id);
  })();
}

export const router = express.Router();

router.get("/login", (req, res) => {
  const returnTo = safePath(req.query.next);
  const reauth = req.query.reauth === "1";
  if (req.session && !reauth) return res.redirect(returnTo);
  if (!CLIENT_ID) {
    return res
      .status(503)
      .send(
        DEV_LOGIN
          ? `TrustNet is not configured yet. For local testing use <a href="/dev/login?as=alice&next=${encodeURIComponent(returnTo)}">/dev/login?as=alice</a>.`
          : "Sign-in is not configured. Set TRUSTNET_CLIENT_ID and TRUSTNET_CLIENT_SECRET.",
      );
  }
  const state = rand(16);
  const nonce = rand(16);
  const verifier = rand(48);
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  db.prepare("DELETE FROM auth_requests WHERE created_at < ?").run(now() - 900);
  db.prepare("INSERT INTO auth_requests (state, nonce, verifier, return_to) VALUES (?, ?, ?, ?)").run(
    state, nonce, verifier, returnTo,
  );
  // Ties the login attempt to this browser.
  res.cookie(STATE_COOKIE, state, cookieOpts(900));

  const url = new URL(`${ISSUER}/oauth2/auth`);
  const params = {
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "openid",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    claims: JSON.stringify({ id_token: { nickname: null } }),
  };
  if (reauth) params.prompt = "consent";
  url.search = new URLSearchParams(params).toString();
  res.redirect(url.toString());
});

router.get("/redirect", async (req, res) => {
  const { code, state, error } = req.query;
  const pending =
    typeof state === "string" && state === readCookie(req, STATE_COOKIE)
      ? db.prepare("SELECT * FROM auth_requests WHERE state = ?").get(state)
      : null;
  res.clearCookie(STATE_COOKIE, { path: "/" });
  if (pending) db.prepare("DELETE FROM auth_requests WHERE state = ?").run(state);

  // The person pressed "deny" at TrustNet: a normal cancellation.
  if (error === "access_denied") return res.redirect("/?cancelled=1");
  if (!pending || typeof code !== "string") {
    return res.status(400).send('That sign-in link is no longer valid. <a href="/login">Sign in again</a>.');
  }

  try {
    const basic = Buffer.from(
      `${encodeURIComponent(CLIENT_ID)}:${encodeURIComponent(CLIENT_SECRET)}`,
    ).toString("base64");
    const tokenRes = await fetch(`${ISSUER}/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: pending.verifier,
      }),
    });
    if (!tokenRes.ok) throw new Error(`token endpoint returned ${tokenRes.status}`);
    const tokens = await tokenRes.json(); // never logged

    const { payload } = await jwtVerify(tokens.id_token, idJwks, {
      issuer: ISSUER,
      audience: CLIENT_ID,
      algorithms: ["RS256"],
      clockTolerance: 60,
    });
    if (payload.nonce !== pending.nonce) throw new Error("nonce mismatch");
    if (!payload.sub) throw new Error("no sub in ID token");

    if (req.session) db.prepare("DELETE FROM sessions WHERE id = ?").run(req.session.id);
    startSession(res, upsertUser(payload.sub), payload.sid ?? null, tokens.id_token);
    res.redirect(pending.return_to);
  } catch (err) {
    console.error("TrustNet sign-in failed:", err.message);
    res.status(502).send('Sign-in with TrustNet did not complete. <a href="/login">Try again</a>.');
  }
});

// TrustNet calls this server-to-server when a session ends, access is revoked
// or the person switches persona. Required at registration.
router.post("/auth/backchannel-logout", express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const { payload } = await jwtVerify(String(req.body.logout_token || ""), idJwks, {
      issuer: ISSUER,
      audience: CLIENT_ID,
      algorithms: ["RS256"],
      clockTolerance: 60,
    });
    const events = payload.events ?? {};
    if (!events["http://schemas.openid.net/event/backchannel-logout"]) throw new Error("wrong event");
    if (!payload.sid || payload.nonce !== undefined) throw new Error("invalid logout token");
    if (!payload.iat || Math.abs(now() - payload.iat) > 600) throw new Error("stale logout token");
    db.prepare("DELETE FROM sessions WHERE sid = ?").run(payload.sid); // unknown sid: no-op
    res.sendStatus(200);
  } catch (err) {
    console.error("Back-channel logout rejected:", err.message);
    res.sendStatus(400);
  }
});

// Optional purge webhook: TrustNet tells us a person revoked access or erased
// their account, and we drop what we hold about them.
router.post("/auth/purge", express.text({ type: "application/jose" }), async (req, res) => {
  try {
    const { payload } = await compactVerify(String(req.body || ""), webhookJwks);
    const event = JSON.parse(new TextDecoder().decode(payload));
    if (event.client_id !== CLIENT_ID || !event.delivery_id) throw new Error("not for this client");
    const fresh = db
      .prepare("INSERT INTO purge_deliveries (delivery_id) VALUES (?) ON CONFLICT DO NOTHING")
      .run(String(event.delivery_id)).changes;
    if (fresh) for (const sub of event.subs ?? []) purgeUser(String(sub));
    res.sendStatus(200);
  } catch (err) {
    console.error("Purge webhook rejected:", err.message);
    res.sendStatus(400);
  }
});

router.post("/logout", express.urlencoded({ extended: false }), (req, res, next) => {
  // A stale page must still be able to finish signing out.
  if (!req.session) return res.redirect("/");
  if (req.body?._csrf !== req.session.csrf) {
    return res.status(403).send("This form has expired. Go back, reload the page and try again.");
  }
  next();
}, (req, res) => {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(req.session.id);
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  // Sign out locally and land on the home page. Ending the TrustNet SSO
  // session is a separate provider action and must not block this redirect.
  res.redirect("/");
});

// Local testing only. Never mounted in production.
if (DEV_LOGIN) {
  router.get("/dev/login", (req, res) => {
    const as = String(req.query.as || "alice").replace(/[^\w-]/g, "").slice(0, 30) || "alice";
    startSession(res, upsertUser(`dev:${as}`));
    res.redirect(safePath(req.query.next));
  });
}
