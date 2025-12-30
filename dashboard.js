/* ===============================
   Rank Values (ثابتة)
   =============================== */
const RANKS = {
  "Trial Mod": 1,
  "Moderator": 3,
  "Senior Moderator": 5,
  "Admin": 7,
  "Senior Admin": 9,
  "Staff Manager": 10,
  "Chief Of Staff": 13,
  "CEO": 14
};

function rankValue(rank) {
  return RANKS[rank] || 0;
}

/* ===============================
   Init Dashboard
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  const user = App.loadUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("sidebarUsername").textContent = user.username;
  document.getElementById("sidebarRank").textContent = user.rank;

  applyPermissions(user.rank);
});

/* ===============================
   Permissions
   =============================== */
function applyPermissions(rank) {
  const value = rankValue(rank);

  document.querySelectorAll("[data-min-rank]").forEach(el => {
    const min = Number(el.dataset.minRank);
    el.style.display = value >= min ? "flex" : "none";
  });
}

/* ===============================
   Page System
   =============================== */
function showPage(page) {
  const title = document.getElementById("pageTitle");
  const area = document.getElementById("pageArea");

  document
    .querySelectorAll(".menu-item")
    .forEach(b => b.classList.remove("active"));

  event.currentTarget?.classList.add("active");

  title.textContent = page.replace("-", " ").toUpperCase();
  area.innerHTML = renderPage(page);
}

/* ===============================
   Pages Content
   =============================== */
function renderPage(page) {
  switch (page) {

    case "ban":
      return `
        <div class="page-center">
          <div class="form-field">
            <label class="field-label">Username</label>
            <input id="banUser" class="field-input">
          </div>
          <div class="form-field">
            <label class="field-label">Reason</label>
            <input id="banReason" class="field-input">
          </div>
          <div class="form-actions">
            <button class="action-btn btn-ban" onclick="sendAction('ban')">Ban</button>
          </div>
          <div id="banResult" class="form-result"></div>
        </div>`;
    default:
      return `<p>Page under construction</p>`;
  }
}

/* ===============================
   Send Action To API
   =============================== */
async function sendAction(type) {
  const user = App.user;
  const target = document.getElementById("banUser")?.value;
  const reason = document.getElementById("banReason")?.value;

  if (!target) return;

  await fetch(`${App.api}/api/action/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actor: user,
      target,
      reason
    })
  });

  document.getElementById("banResult").textContent =
    "Action sent to Roblox server";
}
