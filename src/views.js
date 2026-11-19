export const APP_NAME = "Quiet Santa";

export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const csrf = (s) => `<input type="hidden" name="_csrf" value="${esc(s.csrf)}">`;

export function layout({ title, session, body }) {
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
<header class="top">
  <a class="wordmark" href="/">${APP_NAME}</a>
  ${
    session
      ? `<form method="post" action="/logout">${csrf(session)}<button class="link">Sign out</button></form>`
      : `<a href="/login">Sign in</a>`
  }
</header>
<main>
${body}
</main>
<footer>No emails, no ads, no tracking. We keep the nickname TrustNet shares and the wishlist you type here, and nothing else about you.</footer>
</body>
</html>`;
}

export function landing({ notice }) {
  return `
${notice ? `<p class="notice">${esc(notice)}</p>` : ""}
<section class="hero">
  <h1>Draw names for Secret Santa without handing over anyone’s email.</h1>
  <p class="lede">Start a group, drop the link in your group chat, and everyone unfolds their own slip. Wishlists are included, so nobody has to guess.</p>
  <p><a class="button" href="/login">Start a group</a></p>
  <p class="quiet">You sign in with TrustNet. It gives us a pseudonymous ID and the nickname you approve, and nothing else about you.</p>
</section>
<section>
  <h2>How it goes</h2>
  <ol class="steps">
    <li>Name your group and set a budget.</li>
    <li>Share the invite link. Everyone joins with their TrustNet nickname and adds a few wishes.</li>
    <li>Press Draw names. Everyone sees only their own match.</li>
  </ol>
</section>`;
}

export function home({ session, groups, error, needsNickname }) {
  return `
${
  groups.length
    ? `<section><h1>Your groups</h1>
<ul class="rows">
${groups
  .map(
    (g) => `<li><a href="/g/${esc(g.token)}">${esc(g.name)}</a>
  <span class="quiet">${g.drawn_at ? "Names drawn" : `${g.n} joined, waiting for the draw`}</span></li>`,
  )
  .join("\n")}
</ul></section>`
    : `<section><h1>Start your first group</h1><p class="lede">It takes a minute. The name, budget and date can’t be edited afterwards, so check them.</p></section>`
}
<section>
  ${groups.length ? "<h2>Start another group</h2>" : ""}
  ${error ? `<p class="error">${esc(error)}</p>` : ""}
  ${
    needsNickname
      ? `<p class="notice">TrustNet didn’t share a nickname, so you can’t start a group yet.</p>
  <p><a class="button" href="/login?reauth=1&amp;next=%2F">Sign in again and share a nickname</a></p>`
      : `<p class="quiet">Your name in this group comes from the nickname TrustNet shares.</p>
  <form method="post" action="/groups" class="stack">
    ${csrf(session)}
    <label>Group name <input name="name" required maxlength="60" placeholder="The Popescu family"></label>
    <div class="pair">
      <label>Budget <span class="quiet">(optional)</span> <input name="budget" maxlength="30" placeholder="100 lei"></label>
      <label>Gift exchange date <span class="quiet">(optional)</span> <input name="exchange_date" type="date"></label>
    </div>
    <button class="button">Start the group</button>
  </form>`
  }
</section>`;
}

const groupFacts = (g) => {
  const facts = [];
  if (g.budget) facts.push(`Budget ${esc(g.budget)}`);
  if (g.exchange_date) facts.push(`Exchange on ${esc(g.exchange_date)}`);
  return facts.length ? `<p class="facts">${facts.join(", ")}</p>` : "";
};

// Shown to someone who opened an invite link and is not in the group yet.
export function join({ session, group, organiser, count, error, nickname }) {
  const head = `<h1>${esc(group.name)}</h1>${groupFacts(group)}
<p class="lede">${esc(organiser)} invited you to a Secret Santa. ${count} ${count === 1 ? "person has" : "people have"} joined so far.</p>`;
  if (group.drawn_at) {
    return `${head}<p class="notice">The names have already been drawn, so this group is closed. Ask ${esc(organiser)} to undo the draw if you should be in it.</p>`;
  }
  if (!session) {
    return `${head}
<p><a class="button" href="/login?next=/g/${esc(group.token)}">Sign in to join</a></p>
<p class="quiet">You sign in with TrustNet. No email address reaches this site, and creating a TrustNet account brings you straight back here.</p>`;
  }
  return `${head}
${error ? `<p class="error">${esc(error)}</p>` : ""}
${
  nickname
    ? `<form method="post" action="/g/${esc(group.token)}/join" class="stack">
  ${csrf(session)}
  <button class="button">Join the group</button>
</form>
<p class="quiet">You’ll appear as <strong>${esc(nickname)}</strong>. This comes from TrustNet.</p>`
    : `<p class="notice">TrustNet didn’t share a nickname, so you can’t join yet.</p>
<p><a class="button" href="/login?reauth=1&amp;next=${esc(encodeURIComponent(`/g/${group.token}`))}">Sign in again and share a nickname</a></p>`
}`;
}

function wishItem({ w, session, group, mine, meId }) {
  const text = w.url
    ? `<a href="${esc(w.url)}" rel="noopener noreferrer" target="_blank">${esc(w.text)}</a>`
    : esc(w.text);
  const base = `/g/${esc(group.token)}/wishes/${w.id}`;
  if (mine) {
    return `<li><span>${text}</span>
<form method="post" action="${base}/delete">${csrf(session)}<button class="link">Remove</button></form></li>`;
  }
  const takenByOther = w.claimed_by && w.claimed_by !== meId;
  return `<li class="${w.claimed_by ? "taken" : ""}"><span>${text}</span>
${
  takenByOther
    ? `<span class="quiet">Someone’s getting this</span>`
    : `<form method="post" action="${base}/claim">${csrf(session)}<button class="link">${w.claimed_by ? "I’m not getting this after all" : "I’m getting this"}</button></form>`
}</li>`;
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

  const reveal = drawn
    ? `<section class="tag" aria-label="Your match">
  <details>
    <summary>Unfold your slip</summary>
    <p class="tag-line">You’re buying for</p>
    <p class="tag-name">${esc(receiver?.nickname ?? "nobody yet")}</p>
  </details>
</section>`
    : "";

  const invite = !drawn
    ? `<section>
  <h2>Invite people</h2>
  <p>Paste this link into your group chat. Anyone with the link can join until the names are drawn.</p>
  <input class="copy" readonly value="${esc(inviteUrl)}" aria-label="Invite link">
</section>`
    : isOrganiser
      ? `<section>
  <h2>Tell the group</h2>
  <p>Nobody gets an email, so paste this into your group chat.</p>
  <textarea class="copy" readonly rows="3" aria-label="Message for the group">The names are drawn for ${esc(g.name)}. Open your slip here: ${esc(inviteUrl)}</textarea>
</section>`
      : "";

  const memberList = `<section>
  <h2>${members.length} in the group</h2>
  <ul class="rows">
  ${members
    .map(
      (m) => `<li><span>${esc(m.nickname)}${m.id === me.id ? ' <span class="quiet">(you)</span>' : ""}${m.user_id === g.organiser_id ? ' <span class="quiet">(organiser)</span>' : ""}</span>
  ${
    isOrganiser && !drawn && m.id !== me.id
      ? `<form method="post" action="${base}/members/${m.id}/remove">${csrf(session)}<button class="link">Remove</button></form>`
      : ""
  }</li>`,
    )
    .join("\n")}
  </ul>
</section>`;

  const organiserTools =
    isOrganiser && !drawn
      ? `<section>
  <h2>Who must not draw each other</h2>
  <p class="quiet">Optional. Useful for couples who already buy each other a present.</p>
  ${
    exclusions.length
      ? `<ul class="rows">${exclusions
          .map(
            (x) => `<li><span>${esc(name(x.a))} and ${esc(name(x.b))}</span>
<form method="post" action="${base}/exclusions/${x.id}/delete">${csrf(session)}<button class="link">Remove</button></form></li>`,
          )
          .join("")}</ul>`
      : ""
  }
  ${
    members.length >= 2
      ? `<form method="post" action="${base}/exclusions" class="pair end">
    ${csrf(session)}
    <label>Person <select name="a">${members.map((m) => `<option value="${m.id}">${esc(m.nickname)}</option>`).join("")}</select></label>
    <label>Other person <select name="b">${members
      .map((m, i) => `<option value="${m.id}"${i === 1 ? " selected" : ""}>${esc(m.nickname)}</option>`)
      .join("")}</select></label>
    <button class="button ghost">Keep apart</button>
  </form>`
      : ""
  }
</section>
<section>
  <h2>Draw names</h2>
  ${
    members.length < 3
      ? `<p>You need at least three people. ${3 - members.length} more to go.</p>`
      : `<p>Once you draw, the group closes to new people and everyone can unfold their slip. You won’t see who drew whom.</p>
  <form method="post" action="${base}/draw">${csrf(session)}<button class="button">Draw names</button></form>`
  }
</section>`
      : isOrganiser && drawn
        ? `<section>
  <h2>Undo the draw</h2>
  <p class="quiet">Reopens the group so people can join or leave. Everyone gets a new match when you draw again.</p>
  <form method="post" action="${base}/undraw" data-confirm="Undo the draw? Everyone will get a new match next time.">${csrf(session)}<button class="button ghost">Undo the draw</button></form>
</section>`
        : "";

  const myWishes = wishesOf(me.id);
  const myList = `<section>
  <h2>Your wishlist</h2>
  <p class="quiet">The others can see it and mark what they’re getting. You can’t see their marks.</p>
  ${myWishes.length ? `<ul class="rows">${myWishes.map((w) => wishItem({ w, session, group: g, mine: true })).join("")}</ul>` : ""}
  <form method="post" action="${base}/wishes" class="pair end">
    ${csrf(session)}
    <label>A wish <input name="text" required maxlength="120" placeholder="Wool socks, size 43"></label>
    <label>Link <span class="quiet">(optional)</span> <input name="url" type="url" maxlength="300" placeholder="https://"></label>
    <button class="button ghost">Add wish</button>
  </form>
</section>`;

  const otherLists = others.length
    ? `<section>
  <h2>Everyone else’s wishes</h2>
  ${others
    .map((m) => {
      const ws = wishesOf(m.id);
      return `<h3>${esc(m.nickname)}${receiver && m.id === receiver.id ? ' <span class="badge">your match</span>' : ""}</h3>
  ${
    ws.length
      ? `<ul class="rows">${ws.map((w) => wishItem({ w, session, group: g, mine: false, meId: me.id })).join("")}</ul>`
      : `<p class="quiet">No wishes yet.</p>`
  }`;
    })
    .join("\n")}
</section>`
    : "";

  return `
<h1>${esc(g.name)}</h1>
${groupFacts(g)}
${error ? `<p class="error">${esc(error)}</p>` : ""}
${notice ? `<p class="notice">${esc(notice)}</p>` : ""}
${reveal}
${invite}
${drawn ? "" : memberList}
${organiserTools && !drawn ? organiserTools : ""}
${myList}
${otherLists}
${drawn ? memberList : ""}
${drawn ? organiserTools : ""}
${drawn ? `<section><p><a class="button ghost" href="/">Start a group of your own</a></p></section>` : ""}`;
}
