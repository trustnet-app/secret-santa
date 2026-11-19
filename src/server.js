import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import express from "express";
import db from "./db.js";
import { draw } from "./draw.js";
import { checkCsrf, ISSUER_ORIGIN, loadSession, readCookie, requireUser, router as auth, SECURE, sessionNickname } from "./auth.js";
import * as views from "./views.js";

const BASE_URL = (process.env.BASE_URL || "http://localhost:5556").replace(/\/$/, "");
const PORT = Number(process.env.PORT || 5556);

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.set({
    "Content-Security-Policy":
      `default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self' ${ISSUER_ORIGIN}`,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": "no-store",
  });
  next();
});
app.use(express.static(fileURLToPath(new URL("../public", import.meta.url))));
app.use(loadSession);
app.use(auth); // /login, /auth/*, /logout
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(checkCsrf);

const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const page = (req, res, title, body, options = {}) =>
  res.send(views.layout({ title, session: req.session, body, ...options }));
// One-time messages survive a redirect in a short-lived cookie, so their text
// can never be supplied through a link.
const FLASH = "santa_flash";
function setFlash(res, kind, msg) {
  res.cookie(FLASH, JSON.stringify({ [kind]: msg }), { httpOnly: true, sameSite: "lax", secure: SECURE, path: "/", maxAge: 30000 });
}
function flash(req, res) {
  const raw = readCookie(req, FLASH);
  if (!raw) return { error: "", notice: "" };
  res.clearCookie(FLASH, { path: "/" });
  try {
    const f = JSON.parse(raw);
    return { error: clean(f.error, 200), notice: clean(f.notice, 200) };
  } catch {
    return { error: "", notice: "" };
  }
}
function back(res, token, kind, msg) {
  if (msg) setFlash(res, kind, msg);
  res.redirect(`/g/${token}`);
}
// The claim name is shared by everyone it applies to, so disambiguate inside
// one group without asking anyone to type a different nickname.
function uniqueMemberNickname(groupId, base) {
  let name = base;
  for (let n = 2; ; n++) {
    const taken = db
      .prepare("SELECT 1 FROM members WHERE group_id = ? AND lower(nickname) = lower(?)")
      .get(groupId, name);
    if (!taken) return name;
    const suffix = ` (${n})`;
    name = `${base.slice(0, 30 - suffix.length)}${suffix}`;
  }
}

// ---- Home ------------------------------------------------------------------

app.get("/", (req, res) => {
  if (!req.session) {
    return page(req, res, "", views.landing({ notice: req.query.cancelled ? "Sign-in cancelled. Nothing was shared." : "" }), { bare: true });
  }
  const groups = db
    .prepare(
      `SELECT g.*, (SELECT count(*) FROM members WHERE group_id = g.id) AS n
       FROM groups g JOIN members m ON m.group_id = g.id
       WHERE m.user_id = ? ORDER BY g.id DESC`,
    )
    .all(req.session.user_id);
  page(req, res, "Your groups", views.home({
    session: req.session,
    groups,
    error: flash(req, res).error,
    needsNickname: !sessionNickname(req.session),
  }));
});

app.post("/groups", requireUser, (req, res) => {
  const name = clean(req.body.name, 60);
  const nickname = sessionNickname(req.session);
  if (!name) {
    setFlash(res, "error", "Give the group a name.");
    return res.redirect("/");
  }
  if (!nickname) {
    setFlash(res, "error", "TrustNet didn’t share a nickname. Sign in again and approve the nickname request.");
    return res.redirect("/");
  }
  const date = /^\d{4}-\d{2}-\d{2}$/.test(req.body.exchange_date || "") ? req.body.exchange_date : null;
  const token = randomBytes(12).toString("base64url");
  db.transaction(() => {
    const g = db
      .prepare("INSERT INTO groups (token, name, budget, exchange_date, organiser_id) VALUES (?, ?, ?, ?, ?)")
      .run(token, name, clean(req.body.budget, 30) || null, date, req.session.user_id);
    db.prepare("INSERT INTO members (group_id, user_id, nickname) VALUES (?, ?, ?)").run(
      g.lastInsertRowid, req.session.user_id, uniqueMemberNickname(g.lastInsertRowid, nickname),
    );
  })();
  res.redirect(`/g/${token}`);
});

// ---- Group -----------------------------------------------------------------

// Loads the group for every /g/:token route, plus the visitor's membership.
app.param("token", (req, res, next, token) => {
  const group = db.prepare("SELECT * FROM groups WHERE token = ?").get(token);
  if (!group) return res.status(404).send(views.layout({ title: "Not found", session: req.session, body: views.notFound({ invite: true }) }));
  req.group = group;
  req.me = req.session
    ? db.prepare("SELECT * FROM members WHERE group_id = ? AND user_id = ?").get(group.id, req.session.user_id)
    : null;
  next();
});

const requireMember = [requireUser, (req, res, next) => (req.me ? next() : res.redirect(`/g/${req.group.token}`))];
const requireOrganiser = [
  ...requireMember,
  (req, res, next) => (req.group.organiser_id === req.session.user_id ? next() : res.sendStatus(403)),
];
const requireOpen = (req, res, next) =>
  req.group.drawn_at ? back(res, req.group.token, "error", "The names are already drawn.") : next();

app.get("/g/:token", (req, res) => {
  const g = req.group;
  const members = db.prepare("SELECT * FROM members WHERE group_id = ? ORDER BY id").all(g.id);

  if (!req.me) {
    const organiser = members.find((m) => m.user_id === g.organiser_id)?.nickname ?? "Someone";
    const claimed = req.session ? sessionNickname(req.session) : null;
    return page(req, res, g.name, views.join({
      session: req.session,
      group: g,
      organiser,
      count: members.length,
      nickname: claimed ? uniqueMemberNickname(g.id, claimed) : null,
      error: flash(req, res).error,
    }));
  }

  const wishes = db
    .prepare("SELECT w.* FROM wishes w JOIN members m ON m.id = w.member_id WHERE m.group_id = ? ORDER BY w.id")
    .all(g.id)
    // Never send the owner their own claim marks.
    .map((w) => (w.member_id === req.me.id ? { ...w, claimed_by: null } : w));
  const exclusions = db.prepare("SELECT * FROM exclusions WHERE group_id = ? ORDER BY id").all(g.id);
  // Only the visitor's own assignment is ever read.
  const mine = db.prepare("SELECT receiver_id FROM assignments WHERE group_id = ? AND giver_id = ?").get(g.id, req.me.id);
  const receiver = mine ? members.find((m) => m.id === mine.receiver_id) : null;

  page(req, res, g.name, views.group({
    session: req.session, group: g, me: req.me, members, wishes, exclusions, receiver,
    inviteUrl: `${BASE_URL}/g/${g.token}`, ...flash(req, res),
  }));
});

app.post("/g/:token/join", requireUser, requireOpen, (req, res) => {
  const g = req.group;
  if (req.me) return back(res, g.token);
  const nickname = sessionNickname(req.session);
  if (!nickname) {
    return back(res, g.token, "error", "TrustNet didn’t share a nickname. Sign in again and approve the nickname request.");
  }
  db.prepare("INSERT INTO members (group_id, user_id, nickname) VALUES (?, ?, ?)").run(
    g.id, req.session.user_id, uniqueMemberNickname(g.id, nickname),
  );
  back(res, g.token, "notice", "You’re in. Add a few wishes while you wait for the draw.");
});

app.post("/g/:token/members/:id/remove", requireOrganiser, requireOpen, (req, res) => {
  db.prepare("DELETE FROM members WHERE id = ? AND group_id = ? AND user_id != ?").run(
    req.params.id, req.group.id, req.session.user_id,
  );
  back(res, req.group.token);
});

app.post("/g/:token/wishes", requireMember, (req, res) => {
  const text = clean(req.body.text, 120);
  const url = clean(req.body.url, 300);
  if (!text) return back(res, req.group.token, "error", "Write what you’d like.");
  const count = db.prepare("SELECT count(*) AS n FROM wishes WHERE member_id = ?").get(req.me.id).n;
  if (count >= 20) return back(res, req.group.token, "error", "Twenty wishes is the limit. Remove one first.");
  db.prepare("INSERT INTO wishes (member_id, text, url) VALUES (?, ?, ?)").run(
    req.me.id, text, /^https?:\/\//i.test(url) ? url : null,
  );
  back(res, req.group.token);
});

app.post("/g/:token/wishes/:id/delete", requireMember, (req, res) => {
  db.prepare("DELETE FROM wishes WHERE id = ? AND member_id = ?").run(req.params.id, req.me.id);
  back(res, req.group.token);
});

// Toggle "I'm getting this" on someone else's wish.
app.post("/g/:token/wishes/:id/claim", requireMember, (req, res) => {
  const w = db
    .prepare("SELECT w.* FROM wishes w JOIN members m ON m.id = w.member_id WHERE w.id = ? AND m.group_id = ?")
    .get(req.params.id, req.group.id);
  if (w && w.member_id !== req.me.id) {
    if (w.claimed_by === req.me.id) db.prepare("UPDATE wishes SET claimed_by = NULL WHERE id = ?").run(w.id);
    else if (!w.claimed_by) db.prepare("UPDATE wishes SET claimed_by = ? WHERE id = ?").run(req.me.id, w.id);
  }
  back(res, req.group.token);
});

app.post("/g/:token/exclusions", requireOrganiser, requireOpen, (req, res) => {
  const g = req.group;
  const a = Number(req.body.a);
  const b = Number(req.body.b);
  const ok = db.prepare("SELECT count(*) AS n FROM members WHERE group_id = ? AND id IN (?, ?)").get(g.id, a, b).n === 2;
  if (!ok || a === b) return back(res, g.token, "error", "Pick two different people.");
  const dup = db
    .prepare("SELECT 1 FROM exclusions WHERE group_id = ? AND ((a = ? AND b = ?) OR (a = ? AND b = ?))")
    .get(g.id, a, b, b, a);
  if (!dup) db.prepare("INSERT INTO exclusions (group_id, a, b) VALUES (?, ?, ?)").run(g.id, a, b);
  back(res, g.token);
});

app.post("/g/:token/exclusions/:id/delete", requireOrganiser, requireOpen, (req, res) => {
  db.prepare("DELETE FROM exclusions WHERE id = ? AND group_id = ?").run(req.params.id, req.group.id);
  back(res, req.group.token);
});

app.post("/g/:token/draw", requireOrganiser, requireOpen, (req, res) => {
  const g = req.group;
  const ids = db.prepare("SELECT id FROM members WHERE group_id = ?").all(g.id).map((m) => m.id);
  if (ids.length < 3) return back(res, g.token, "error", "You need at least three people to draw.");
  const ex = db.prepare("SELECT a, b FROM exclusions WHERE group_id = ?").all(g.id).map((x) => [x.a, x.b]);
  const pairs = draw(ids, ex);
  if (!pairs) return back(res, g.token, "error", "No draw fits those keep-apart rules. Remove one and try again.");
  db.transaction(() => {
    const ins = db.prepare("INSERT INTO assignments (group_id, giver_id, receiver_id) VALUES (?, ?, ?)");
    for (const [giver, receiver] of pairs) ins.run(g.id, giver, receiver);
    db.prepare("UPDATE groups SET drawn_at = unixepoch() WHERE id = ?").run(g.id);
  })();
  back(res, g.token, "notice", "Names drawn. Tell the group to open their slips.");
});

app.post("/g/:token/undraw", requireOrganiser, (req, res) => {
  db.transaction(() => {
    db.prepare("DELETE FROM assignments WHERE group_id = ?").run(req.group.id);
    db.prepare("UPDATE groups SET drawn_at = NULL WHERE id = ?").run(req.group.id);
  })();
  back(res, req.group.token, "notice", "Draw undone. The group is open again.");
});

app.use((req, res) => res.status(404).send(views.layout({ title: "Not found", session: req.session, body: views.notFound() })));

app.listen(PORT, () => console.log(`${views.APP_NAME} listening on ${BASE_URL} (port ${PORT})`));
