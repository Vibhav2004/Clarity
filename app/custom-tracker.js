  import { store, renderShell, uid, toast, applyLanguage, t } from './shared/store.js';
  const user = renderShell('custom-tracker'); if (!user) throw new Error('redir');

  function load() { return store.load().customTrackers.filter(t => t.userEmail === user.email); }
  function persist(t) {
    const s = store.load();
    const i = s.customTrackers.findIndex(x => x.id === t.id);
    if (i >= 0) s.customTrackers[i] = t; else s.customTrackers.push(t);
    store.save(s);
  }
  let trackers = load();
  let active = trackers[0] || null;

  function renderTabs() {
    const tabs = document.getElementById('tabs');
    tabs.innerHTML = trackers
      .map(
        (t) => `
      <button class="btn btn-sm ${active && t.id === active.id ? 'btn-primary' : 'btn-ghost'}" data-id="${t.id}">${t.name}</button>
    `,
      )
      .join('') + `<button class="btn btn-sm btn-ghost" id="addTracker" data-i18n="customTracker.newTracker">+ New tracker</button>`;
    tabs.querySelectorAll('button[data-id]').forEach((b) =>
      b.addEventListener("click", () => {
        active = trackers.find((t) => t.id === b.dataset.id);
        renderAll();
      }),
    );
    // document.getElementById("addTracker").addEventListener("click", async () => {
    //   const name = prompt(await t("customTracker.newTrackerPrompt"));
    //   if (!name) return;
    //   const t = { id: uid(), name, steps: [], createdAt: new Date().toISOString(), userEmail: user.email };
    //   trackers.push(t);
    //   persist(t);
    //   active = t;
    //   renderAll();
    // });
    document.getElementById("addTracker").addEventListener("click", async () => {

    const name =
        prompt(
            await t(
                "customTracker.newTrackerPrompt"
            )
        );

    if (!name) return;

    const tracker = {
        id: uid(),
        name,
        steps: [],
        createdAt:
            new Date().toISOString(),
        userEmail:
            user.email
    };

    trackers.push(tracker);

    persist(tracker);

    active = tracker;

    renderAll();
});
  }
  function renderSteps() {
    console.log("Rendering Steps");

    

   
    const list = document.getElementById("steps");
     console.log(list);
    if (!active) {
      list.innerHTML = `<div class="card empty-state"><h3 data-i18n="customTracker.noTrackerYet">No tracker yet</h3><p data-i18n="customTracker.createBegin">Create one above to begin.</p></div>`;
      return;
    }
    list.innerHTML = active.steps
      .map(
        (s) => `
      <div class="tracker-step ${s.done ? "done" : ""}" data-id="${s.id}">
        <div class="step-head">
          <input type="checkbox" data-act="toggle" ${s.done ? "checked" : ""} style="width:18px;height:18px" />
          <div class="s-title">${s.title}</div>
          <span class="priority ${s.priority}">${s.priority}</span>
          ${s.deadline ? `<span style="font-size:12px;color:var(--text-muted)">${s.deadline}</span>` : ""}
          <button class="btn btn-sm btn-ghost" data-act="addSub" data-i18n="customTracker.addSub">+ sub</button>
          <button class="btn btn-sm btn-ghost" data-act="del" data-i18n="customTracker.delete">✕</button>
        </div>
        <div class="substeps">${s.substeps
          .map(
            (ss) => `
          <div class="substep ${ss.done ? "done" : ""}" data-sub="${ss.id}"><div class="box">${ss.done ? "✓" : ""}</div><span>${ss.title}</span></div>
        `,
          )
          .join("")}</div>
      </div>
    `,
      )
      .join("");
    list.querySelectorAll(".tracker-step").forEach((el) => {
      const sid = el.dataset.id;
      const step = active.steps.find((x) => x.id === sid);
      el.querySelector("[data-act=toggle]").addEventListener("change", (e) => {
        step.done = e.target.checked;
        persist(active);
        renderSteps();
      });
      el.querySelector("[data-act=del]").addEventListener("click", () => {
        active.steps = active.steps.filter((x) => x.id !== sid);
        persist(active);
        renderSteps();
      });
      el.querySelector("[data-act=addSub]").addEventListener("click", async () => {
        const text = prompt(await t("customTracker.stepPlaceholder"));
        if (!text) return;
        step.substeps.push({ id: uid(), title: text, done: false });
        persist(active);
        renderSteps();
      });
      el.querySelectorAll(".substep").forEach((ss) =>
        ss.addEventListener("click", () => {
          const sub = step.substeps.find((x) => x.id === ss.dataset.sub);
          sub.done = !sub.done;
          persist(active);
          renderSteps();
        }),
      );
    });
  }
  async function renderAll() {
    renderTabs();
    renderSteps();
    await applyLanguage();
  }

  document.getElementById('addStepBtn').addEventListener('click', async () => {
    if (!active) { toast(await t('customTracker.createBegin')); return; }
    const title = document.getElementById('stepTitle').value.trim(); if (!title) return;
    const priority = document.getElementById('priority').value;
    const deadline = document.getElementById('deadline').value || undefined;
    active.steps.push({ id: uid(), title, priority, deadline, done: false, substeps: [] });
    persist(active); document.getElementById('stepTitle').value = ''; renderSteps();
  });
document
    .getElementById(
        "saveTrackerBtn"
    )
    .addEventListener(
        "click",
        async () => {

            const result =
                await saveCustomTracker();

            if (!result) return;

            console.log(
                "Saved:",
                result
            );
        }
    );

function buildCustomTrackerPayload() {

    if (!active) return null;

    const steps =
        active.steps.map(
            (step, index) => ({

                step_no:
                    index + 1,

                step_id:
                    step.id,

                step_name:
                    step.title,

                difficulty:
                    step.priority,

                createdAt:
                    step.createdAt ||
                    active.createdAt,

                totalSubsteps:
                    step.substeps.length,

                completedSubsteps:
                    step.substeps.filter(
                        s => s.done
                    ).length,

                done:
                    step.done || false,

                substeps:
                    step.substeps.map(
                        (
                            substep,
                            subIndex
                        ) => ({

                            substep_no:
                                subIndex + 1,

                            substep_id:
                                substep.id,

                            substep_name:
                                substep.title,

                            difficulty:
                                substep.priority ||
                                step.priority,

                            createdAt:
                                substep.createdAt ||
                                active.createdAt,

                            done:
                                substep.done || false

                        })
                    )

            })
        );

    const completedSteps =
        steps.filter(
            s => s.done
        ).length;

    const totalSteps =
        steps.length;

    const completedpercentage =
        totalSteps === 0
            ? 0
            : Math.round(
                (
                    completedSteps /
                    totalSteps
                ) * 100
            );

    return {

        roadmapName:
            active.name,

        username:
            user.username,

        userEmail:
            user.email,

        type:
            "CustomTracker",

        status:
            completedSteps === 0
                ? "NOT_STARTED"
                : completedSteps === totalSteps
                ? "COMPLETED"
                : "IN_PROGRESS",

        completedSteps,

        completedpercentage,

        totalSteps,

        createdAt:
            active.createdAt,

        updatedAt:
            new Date()
                .toISOString(),

        jsonData: {

            steps

        }

    };
}
async function saveCustomTracker() {

    try {

        const payload =
            buildCustomTrackerPayload();

        const response =
            await fetch(
                API.customTracker(),
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            toast(
                result.message ||
                "Failed to save tracker"
            );

            return null;
        }

        toast(
            result.message ||
            "Tracker Saved Successfully"
        );

        return result;

    } catch (error) {

        console.error(error);

        toast(
            "Server error. Please try again."
        );

        return null;
    }
}
  renderAll();
