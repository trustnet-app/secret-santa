export const APP_NAME = "Quiet Santa";

export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const csrf = (s) => `<input type="hidden" name="_csrf" value="${esc(s.csrf)}">`;

export function layout({ title, session, body, bare = false }) {
  const content = bare
    ? body
    : `<div class="qs-page">
  <header class="qs-nav">
    <a class="qs-wordmark" href="/">
      <span class="qs-mark" aria-hidden="true"></span>
      <span>${APP_NAME}</span>
    </a>
    <nav class="qs-nav__links" aria-label="Primary">
      ${
        session
          ? `<form method="post" action="/logout">${csrf(session)}<button class="qs-signin" type="submit">Sign out</button></form>`
          : `<a class="qs-signin" href="/login">Sign in</a>`
      }
    </nav>
  </header>
  <main class="qs-main">
${body}
  </main>
  <footer class="qs-footer">
    <p class="qs-footer__privacy">No emails, no ads, no tracking. We keep the nickname TrustNet shares and the wishlist you type here, and nothing else about you.</p>
    <p class="qs-footer__mark">${APP_NAME} · free to use · made for small, private exchanges</p>
  </footer>
</div>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>${esc(title ? `${title} – ${APP_NAME}` : APP_NAME)}</title>
<link rel="stylesheet" href="/style.css">
<script src="/app.js" defer></script>
</head>
<body>
${content}
</body>
</html>`;
}

export function landing({ notice }) {
  return `<div class="santa-page">
  <header class="santa-nav">
    <a class="santa-wordmark" href="#main">
      <span class="santa-mark" aria-hidden="true"></span>
      <span>${APP_NAME}</span>
    </a>
    <nav class="santa-nav__links" aria-label="Primary">
      <a href="#how-it-goes">How it goes</a>
      <a class="santa-signin" href="/login">Sign in</a>
    </nav>
  </header>

  <main id="main" class="santa-main">
    ${notice ? `<p class="santa-notice" role="status">${esc(notice)}</p>` : ""}
    <section class="santa-hero" aria-labelledby="santa-headline">
      <div class="santa-hero__copy">
        <div class="santa-kicker">
          <p class="santa-eyebrow">Secret Santa, quietly done</p>
          <span class="santa-free">Free to use</span>
        </div>
        <h1 id="santa-headline">
          Draw names for Secret Santa
          <em>without handing over anyone’s email.</em>
        </h1>
        <p class="santa-lede">
          Start a group, drop the link in your group chat, and everyone unfolds
          their own slip. Wishlists are included, so nobody has to guess.
        </p>
        <div class="santa-actions">
          <a class="santa-button" href="/login">Start a group</a>
          <a class="santa-textlink" href="#how-it-goes">See how it works</a>
        </div>
        <p class="santa-trust">
          <span class="santa-trust__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3 4.5 6v5.6c0 4.5 3.1 7.8 7.5 9.4 4.4-1.6 7.5-4.9 7.5-9.4V6L12 3Z"/>
              <path d="m9 12 2.1 2.1L15.4 10"/>
            </svg>
          </span>
          <span>
            You sign in with TrustNet. It gives us a pseudonymous ID and the
            nickname you approve, and nothing else about you.
          </span>
        </p>
      </div>

      <div class="santa-still" aria-hidden="true">
        <span class="santa-glow"></span>
        <span class="santa-snow santa-snow--1"></span>
        <span class="santa-snow santa-snow--2"></span>
        <span class="santa-snow santa-snow--3"></span>
        <span class="santa-snow santa-snow--4"></span>
        <span class="santa-snow santa-snow--5"></span>
        <span class="santa-snow santa-snow--6"></span>

        <svg class="santa-sprig santa-sprig--left" viewBox="0 0 140 240" fill="none">
          <path d="M78 232C76 178 73 118 58 26" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <path d="M75 198 38 176M76 186 112 166M70 160 28 136M71 148 116 126M66 120 24 94M67 108 114 88M62 82 30 60M64 70 102 52M60 44 38 28M62 34 84 22" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        </svg>

        <svg class="santa-sprig santa-sprig--right" viewBox="0 0 140 240" fill="none">
          <path d="M78 232C76 178 73 118 58 26" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <path d="M75 198 38 176M76 186 112 166M70 160 28 136M71 148 116 126M66 120 24 94M67 108 114 88M62 82 30 60M64 70 102 52M60 44 38 28M62 34 84 22" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        </svg>

        <div class="santa-envelope">
          <span class="santa-envelope__seal">QS</span>
        </div>

        <div class="santa-tag">
          <span class="santa-tag__hole"></span>
          <span class="santa-tag__label">For someone nice</span>
          <span class="santa-tag__note">Open on the day</span>
        </div>
      </div>
    </section>

    <section class="santa-how" id="how-it-goes" aria-labelledby="how-heading">
      <div class="santa-how__head">
        <p class="santa-eyebrow">How it goes</p>
        <h2 id="how-heading">Three quiet steps to a good gift.</h2>
      </div>
      <ol class="santa-steps">
        <li class="santa-step">
          <span class="santa-step__number">01</span>
          <h3>Name your group and set a budget.</h3>
          <p>A name, an optional budget, and a date if you have one.</p>
        </li>
        <li class="santa-step">
          <span class="santa-step__number">02</span>
          <h3>Share the invite link.</h3>
          <p>Everyone joins with their TrustNet nickname and adds a few wishes.</p>
        </li>
        <li class="santa-step">
          <span class="santa-step__number">03</span>
          <h3>Press Draw names.</h3>
          <p>Everyone sees only their own match. The organiser never sees who drew whom.</p>
        </li>
      </ol>
    </section>
  </main>

  <footer class="santa-footer">
    <p class="santa-footer__privacy">
      No emails, no ads, no tracking. We keep the nickname TrustNet shares and
      the wishlist you type here, and nothing else about you.
    </p>
    <p class="santa-footer__mark">${APP_NAME} · free to use · made for small, private exchanges</p>
  </footer>
</div>`;
}

export function home({ session, groups, error, needsNickname }) {
  const cards = groups
    .map(
      (g) => `<li>
      <a class="qs-group-card" href="/g/${esc(g.token)}">
        <span class="qs-group-card__body">
          <span class="qs-group-card__name">${esc(g.name)}</span>
          <span class="qs-group-card__status">${g.drawn_at ? "Names drawn" : `${g.n} joined, waiting for the draw`}</span>
        </span>
        <span class="qs-group-card__chevron" aria-hidden="true">→</span>
      </a>
    </li>`,
    )
    .join("\n");

  const groupsPanel = groups.length
    ? `<section class="qs-panel" aria-label="Your groups">
  <header class="qs-panel__head">
    <h2>${groups.length} ${groups.length === 1 ? "group" : "groups"}</h2>
  </header>
  <ul class="qs-group-list">
${cards}
  </ul>
</section>`
    : "";

  const newGroupPanel = (heading) => `<section class="qs-panel" aria-label="${heading || "New group"}">
  ${heading ? `<header class="qs-panel__head"><h2>${heading}</h2></header>` : `<h2 class="qs-visually-hidden">New group</h2>`}
  <p class="qs-quiet">Your name in this group comes from the nickname TrustNet shares.</p>
  <form method="post" action="/groups" class="qs-form">
    ${csrf(session)}
    <label class="qs-field">
      <span class="qs-field__label">Group name</span>
      <input name="name" required maxlength="60" placeholder="The Popescu family">
    </label>
    <div class="qs-form__row">
      <label class="qs-field">
        <span class="qs-field__label">Budget <span class="qs-field__hint">(optional)</span></span>
        <input name="budget" maxlength="30" placeholder="100 lei">
      </label>
      <label class="qs-field">
        <span class="qs-field__label">Gift exchange date <span class="qs-field__hint">(optional)</span></span>
        <input name="exchange_date" type="date">
      </label>
    </div>
    <div>
      <button class="qs-button" type="submit">Start the group</button>
    </div>
  </form>
</section>`;

  return `<div class="qs-stack">
  <header class="qs-page-header">
    <p class="qs-eyebrow">Your exchanges</p>
    <h1>${groups.length ? "Your groups" : "Start your first group"}</h1>
    ${
      groups.length
        ? ""
        : `<p class="qs-lede">It takes a minute. The name, budget and date can’t be edited afterwards, so check them.</p>`
    }
  </header>
  ${error ? `<p class="qs-error">${esc(error)}</p>` : ""}
  ${groupsPanel}
  ${
    needsNickname
      ? `<div class="qs-stack">
    <p class="qs-notice">TrustNet didn’t share a nickname, so you can’t start a group yet.</p>
    <div><a class="qs-button" href="/login?reauth=1&amp;next=%2F">Sign in again and share a nickname</a></div>
  </div>`
      : newGroupPanel(groups.length ? "Start another group" : "")
  }
</div>`;
}

// Shown to someone who opened an invite link and is not in the group yet.
export function join({ session, group, organiser, count, error, nickname }) {
  const facts = [];
  if (group.budget) facts.push(`<li>Budget ${esc(group.budget)}</li>`);
  if (group.exchange_date) facts.push(`<li>Exchange on ${esc(group.exchange_date)}</li>`);

  const state = group.drawn_at
    ? `<div class="qs-invite-state">
      <p class="qs-notice">The names have already been drawn, so this group is closed. Ask ${esc(organiser)} to undo the draw if you should be in it.</p>
    </div>`
    : !session
      ? `<div class="qs-invite-state">
      <a class="qs-button" href="/login?next=/g/${esc(group.token)}">Sign in to join</a>
      <p class="qs-quiet">You sign in with TrustNet. No email address reaches this site, and creating a TrustNet account brings you straight back here.</p>
    </div>`
      : `<div class="qs-invite-state">
      ${error ? `<p class="qs-error">${esc(error)}</p>` : ""}
      ${
        nickname
          ? `<form method="post" action="/g/${esc(group.token)}/join" class="qs-form">
        ${csrf(session)}
        <div><button class="qs-button" type="submit">Join the group</button></div>
      </form>
      <p class="qs-quiet">You’ll appear as <strong>${esc(nickname)}</strong>. This comes from TrustNet.</p>`
          : `<p class="qs-notice">TrustNet didn’t share a nickname, so you can’t join yet.</p>
      <p><a class="qs-button" href="/login?reauth=1&amp;next=${esc(encodeURIComponent(`/g/${group.token}`))}">Sign in again and share a nickname</a></p>`
      }
    </div>`;

  return `<div class="qs-invite-wrap">
  <section class="qs-invite-card" aria-labelledby="invite-title">
    <span class="qs-invite-seal" aria-hidden="true">QS</span>
    <p class="qs-eyebrow">You’re invited</p>
    <h1 id="invite-title">${esc(group.name)}</h1>
    ${facts.length ? `<ul class="qs-facts">${facts.join("")}</ul>` : ""}
    <p class="qs-lede">${esc(organiser)} invited you to a Secret Santa. ${count} ${count === 1 ? "person has" : "people have"} joined so far.</p>
    ${state}
  </section>
</div>`;
}

// The two 404 states share the product shell and card geometry.
export function notFound({ invite = false } = {}) {
  return `<div class="qs-centered">
  <section class="qs-panel qs-empty">
    <p class="qs-eyebrow">Not found</p>
    ${
      invite
        ? `<h1>That invite link doesn’t exist.</h1>
    <p class="qs-lede">Check it was copied in full.</p>`
        : `<h1>Nothing here.</h1>
    <a class="qs-button" href="/">Back to the start</a>`
    }
  </section>
</div>`;
}

function wishItem({ w, session, group, mine, meId }) {
  const text = w.url
    ? `<a href="${esc(w.url)}" rel="noopener noreferrer" target="_blank">${esc(w.text)}</a>`
    : esc(w.text);
  const base = `/g/${esc(group.token)}/wishes/${w.id}`;
  if (mine) {
    return `<li class="qs-list__row qs-wish">
  <span class="qs-wish__text">${text}</span>
  <form method="post" action="${base}/delete">${csrf(session)}<button class="qs-linkbutton" type="submit">Remove</button></form>
</li>`;
  }
  const takenByOther = w.claimed_by && w.claimed_by !== meId;
  if (takenByOther) {
    return `<li class="qs-list__row qs-wish qs-wish--taken">
  <span class="qs-wish__text">${text}</span>
  <span class="qs-quiet">Someone’s getting this</span>
</li>`;
  }
  return `<li class="qs-list__row qs-wish">
  <span class="qs-wish__text">${text}</span>
  <form method="post" action="${base}/claim">${csrf(session)}<button class="qs-linkbutton" type="submit">${w.claimed_by ? "I’m not getting this after all" : "I’m getting this"}</button></form>
</li>`;
}

export function group({ session, group: g, me, members, wishes, exclusions, receiver, inviteUrl, error, notice }) {
  const isOrganiser = g.organiser_id === session.user_id;
  const drawn = Boolean(g.drawn_at);
  const base = `/g/${esc(g.token)}`;
  const name = (id) => members.find((m) => m.id === id)?.nickname ?? "?";
  const wishesOf = (id) => wishes.filter((w) => w.member_id === id);
  const others = members.filter((m) => m.id !== me.id);
  // Your own match first, then everyone else.
  if (receiver) others.sort((a, b) => (b.id === receiver.id) - (a.id === receiver.id));

  const facts = [];
  if (g.budget) facts.push(`<li>Budget ${esc(g.budget)}</li>`);
  if (g.exchange_date) facts.push(`<li>Exchange on ${esc(g.exchange_date)}</li>`);

  const reveal = drawn
    ? `<section class="qs-reveal" aria-label="Your match">
  <details class="qs-tag">
    <summary>Unfold your slip</summary>
    <p class="qs-tag__line">You’re buying for</p>
    <p class="qs-tag__name">${esc(receiver?.nickname ?? "nobody yet")}</p>
  </details>
</section>`
    : "";

  const invite = !drawn
    ? `<section class="qs-panel" aria-labelledby="invite-heading">
  <header class="qs-panel__head">
    <h2 id="invite-heading">Invite people</h2>
    <p>Paste this link into your group chat. Anyone with the link can join until the names are drawn.</p>
  </header>
  <input class="qs-copy" readonly value="${esc(inviteUrl)}" aria-label="Invite link">
</section>`
    : isOrganiser
      ? `<section class="qs-panel" aria-labelledby="tell-heading">
  <header class="qs-panel__head">
    <h2 id="tell-heading">Tell the group</h2>
    <p>Nobody gets an email, so paste this into your group chat.</p>
  </header>
  <textarea class="qs-copy qs-copy--area" readonly rows="3" aria-label="Message for the group">The names are drawn for ${esc(g.name)}. Open your slip here: ${esc(inviteUrl)}</textarea>
</section>`
      : "";

  const memberList = `<section class="qs-panel" aria-labelledby="members-heading">
  <header class="qs-panel__head">
    <h2 id="members-heading">${members.length} in the group</h2>
  </header>
  <ul class="qs-list">
  ${members
    .map((m) => {
      const meta = [m.id === me.id ? "you" : "", m.user_id === g.organiser_id ? "organiser" : ""].filter(Boolean).join(", ");
      return `<li class="qs-list__row">
    <span class="qs-list__main">
      <span class="qs-list__title">${esc(m.nickname)}</span>
      ${meta ? `<span class="qs-list__meta">(${meta})</span>` : ""}
    </span>
    ${
      isOrganiser && !drawn && m.id !== me.id
        ? `<form method="post" action="${base}/members/${m.id}/remove">${csrf(session)}<button class="qs-linkbutton" type="submit">Remove</button></form>`
        : ""
    }
  </li>`;
    })
    .join("\n")}
  </ul>
</section>`;

  const organiserTools =
    isOrganiser && !drawn
      ? `<section class="qs-panel" aria-labelledby="exclusions-heading">
  <header class="qs-panel__head">
    <h2 id="exclusions-heading">Who must not draw each other</h2>
    <p>Optional. Useful for couples who already buy each other a present.</p>
  </header>
  ${
    exclusions.length
      ? `<ul class="qs-list">${exclusions
          .map(
            (x) => `<li class="qs-list__row">
    <span class="qs-list__main"><span class="qs-list__title">${esc(name(x.a))} and ${esc(name(x.b))}</span></span>
    <form method="post" action="${base}/exclusions/${x.id}/delete">${csrf(session)}<button class="qs-linkbutton" type="submit">Remove</button></form>
  </li>`,
          )
          .join("")}</ul>`
      : ""
  }
  ${
    members.length >= 2
      ? `<form method="post" action="${base}/exclusions" class="qs-form">
    ${csrf(session)}
    <div class="qs-form__row">
      <label class="qs-field">
        <span class="qs-field__label">Person</span>
        <select name="a">${members.map((m) => `<option value="${m.id}">${esc(m.nickname)}</option>`).join("")}</select>
      </label>
      <label class="qs-field">
        <span class="qs-field__label">Other person</span>
        <select name="b">${members
          .map((m, i) => `<option value="${m.id}"${i === 1 ? " selected" : ""}>${esc(m.nickname)}</option>`)
          .join("")}</select>
      </label>
    </div>
    <div><button class="qs-button qs-button--ghost" type="submit">Keep apart</button></div>
  </form>`
      : ""
  }
</section>
<section class="qs-panel" aria-labelledby="draw-heading">
  <header class="qs-panel__head">
    <h2 id="draw-heading">Draw names</h2>
    ${
      members.length < 3
        ? `<p>You need at least three people. ${3 - members.length} more to go.</p>`
        : `<p>Once you draw, the group closes to new people and everyone can unfold their slip. You won’t see who drew whom.</p>`
    }
  </header>
  ${
    members.length >= 3
      ? `<form method="post" action="${base}/draw">${csrf(session)}<button class="qs-button" type="submit">Draw names</button></form>`
      : ""
  }
</section>`
      : isOrganiser && drawn
        ? `<section class="qs-panel" aria-labelledby="undo-heading">
  <header class="qs-panel__head">
    <h2 id="undo-heading">Undo the draw</h2>
    <p>Reopens the group so people can join or leave. Everyone gets a new match when you draw again.</p>
  </header>
  <form method="post" action="${base}/undraw" data-confirm="Undo the draw? Everyone will get a new match next time.">${csrf(session)}<button class="qs-button qs-button--ghost" type="submit">Undo the draw</button></form>
</section>`
        : "";

  const myWishes = wishesOf(me.id);
  const myList = `<section class="qs-panel" aria-labelledby="my-wishes-heading">
  <header class="qs-panel__head">
    <h2 id="my-wishes-heading">Your wishlist</h2>
    <p>The others can see it and mark what they’re getting. You can’t see their marks.</p>
  </header>
  ${myWishes.length ? `<ul class="qs-list">${myWishes.map((w) => wishItem({ w, session, group: g, mine: true })).join("")}</ul>` : ""}
  <form method="post" action="${base}/wishes" class="qs-form">
    ${csrf(session)}
    <div class="qs-form__row">
      <label class="qs-field">
        <span class="qs-field__label">A wish</span>
        <input name="text" required maxlength="120" placeholder="Wool socks, size 43">
      </label>
      <label class="qs-field">
        <span class="qs-field__label">Link <span class="qs-field__hint">(optional)</span></span>
        <input name="url" type="url" maxlength="300" placeholder="https://">
      </label>
    </div>
    <div><button class="qs-button qs-button--ghost" type="submit">Add wish</button></div>
  </form>
</section>`;

  const otherLists = others.length
    ? `<section class="qs-panel" aria-labelledby="others-heading">
  <header class="qs-panel__head">
    <h2 id="others-heading">Everyone else’s wishes</h2>
  </header>
  ${others
    .map((m) => {
      const ws = wishesOf(m.id);
      return `<h3 class="qs-subhead">${esc(m.nickname)}${receiver && m.id === receiver.id ? ' <span class="qs-badge">your match</span>' : ""}</h3>
  ${
    ws.length
      ? `<ul class="qs-list">${ws.map((w) => wishItem({ w, session, group: g, mine: false, meId: me.id })).join("")}</ul>`
      : `<p class="qs-quiet">No wishes yet.</p>`
  }`;
    })
    .join("\n")}
</section>`
    : "";

  const startPanel = drawn
    ? `<section class="qs-panel" aria-label="Start a group of your own">
  <h2 class="qs-visually-hidden">Start a group of your own</h2>
  <a class="qs-button qs-button--ghost" href="/">Start a group of your own</a>
</section>`
    : "";

  return `<div class="qs-stack">
  <header class="qs-page-header">
    <p class="qs-eyebrow">${drawn ? "The draw is done" : "Open exchange"}</p>
    <h1>${esc(g.name)}</h1>
    ${facts.length ? `<ul class="qs-facts">${facts.join("")}</ul>` : ""}
  </header>
  ${error ? `<p class="qs-error">${esc(error)}</p>` : ""}
  ${notice ? `<p class="qs-notice">${esc(notice)}</p>` : ""}
  ${reveal}
  ${invite}
  <div class="qs-layout">
    <div class="qs-layout__main">
${myList}
${otherLists}
    </div>
    <aside class="qs-layout__aside">
${memberList}
${organiserTools}
${startPanel}
    </aside>
  </div>
</div>`;
}
