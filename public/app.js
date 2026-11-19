// Select the invite link or message when it is focused, so it is one tap to copy.
for (const el of document.querySelectorAll(".copy")) {
  el.addEventListener("focus", () => el.select());
}
// Ask before anything that cannot be taken back.
for (const form of document.querySelectorAll("form[data-confirm]")) {
  form.addEventListener("submit", (e) => {
    if (!confirm(form.dataset.confirm)) e.preventDefault();
  });
}
