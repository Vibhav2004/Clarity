import { store, renderShell, toast, applyTheme, applyLanguage, t } from "./shared/store.js";
const user = renderShell("settings");
if (!user) throw new Error("redir");
applyTheme();

async function render() {
  const s = store.load();
  const set = s.settings;
  document.getElementById("content").innerHTML = `
    <div class="card slide-up">
      <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.1em; font-weight:600; margin-bottom:8px" data-i18n="settings.preferencesTitle">Preferences</div>
      <div class="row">
        <div><div class="label" data-i18n="settings.notifications">Notifications</div><div class="sub" data-i18n="settings.notificationsSub">Get reminders when milestones are due.</div></div>
        <div class="toggle ${set.notifications ? "on" : ""}" data-key="notifications"></div>
      </div>
      <div class="row">
        <div><div class="label" data-i18n="settings.weeklyDigest">Weekly email digest</div><div class="sub" data-i18n="settings.weeklyDigestSub">A short recap of your progress every Monday.</div></div>
        <div class="toggle ${set.emailUpdates ? "on" : ""}" data-key="emailUpdates"></div>
      </div>
      <div class="row">
        <div><div class="label" data-i18n="settings.theme">Theme</div><div class="sub">${await t("settings.themeCurrent", { theme: set.theme })}</div></div>
        <button class="btn btn-ghost btn-sm" id="themeBtn" data-i18n="settings.toggleTheme">Toggle theme</button>
      </div>
      
    </div>

    <div class="card slide-up" style="margin-top:20px">
      <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.1em; font-weight:600; margin-bottom:14px" data-i18n="settings.planTitle"> UPGRADE Plan</div>
      <div class="plans-grid">
        ${["Free", "Pro", "Premium"]
          .map(
            (p) => `
            <a href="upgrade.html">
             <div class="plan-pick"  data-plan="${p}">
             <div style="font-weight:800; font-size:18px">${p}</div>
            <div style="color:var(--text-muted); font-size:12px; margin-top:4px">${p === "Free" ? "₹0 forever" : p === "Pro" ? "₹99 / month" : "₹199 / month"}</div>
          </div>
          </a>`,
          )
          .join("")}
      </div>
    </div>

    
  `;
  document.querySelectorAll(".toggle").forEach((t) =>
    t.addEventListener("click", () => {
      const k = t.dataset.key;
      store.update((s) => {
        s.settings[k] = !s.settings[k];
        return s;
      });
      render();
    }),
  );
  document.getElementById("themeBtn").addEventListener("click", () => {
    store.update((s) => {
      s.settings.theme = s.settings.theme === "dark" ? "light" : "dark";
      return s;
    });
    applyTheme();
    toast("Theme preference saved");
    render();
  });
  document.getElementById("lang").addEventListener("change", (e) => {
    store.update((s) => {
      s.settings.language = e.target.value;
      return s;
    });
  });
  document.querySelectorAll(".plan-pick").forEach((b) =>
    b.addEventListener("click", () => {
      store.update((s) => {
        s.users[user.email].plan = b.dataset.plan;
        return s;
      });
      toast(`Plan changed to ${b.dataset.plan}`);
      setTimeout(() => location.reload(), 600);
    }),
  );
  document.getElementById("resetBtn").addEventListener("click", async () => {
    if (confirm(await t("settings.resetConfirm"))) {
      localStorage.removeItem("clarity_state_v1");
      window.location.href = "index.html";
    }
  });
  await applyLanguage();
}
render();
