import { renderShell, applyLanguage } from "./shared/store.js";

const user = renderShell("tracker");
if (!user) throw new Error("redir");

const content = document.getElementById("content");

try {

//   const response = await fetch(
//         API.allTrackers(user.email)
//   );
const sessionId = sessionStorage.getItem("sessionId");

const response = await fetch(
    API.allTrackers(user.email),
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            
            sessionID: sessionId
        })
    }
);

  const trackers = await response.json();

  if (!trackers || trackers.length === 0) {

    content.innerHTML = `
      <div class="card empty-state slide-up">
        <div style="font-size:48px; opacity:.5">◇</div>
        <h3>No trackers yet</h3>
        <p>Create your first tracker to get started.</p>
        <a class="btn btn-primary"
           href="individualtracker.html"
           style="margin-top:20px">
           Create Tracker
        </a>
      </div>
    `;

  } else {

    content.innerHTML = `
     <div
        style="
            display:flex;
            gap:10px;
            margin-bottom:20px;
        "
    >

        <button
            id="selectTrackersBtn"
            class="btn btn-secondary"
        >
            Select
        </button>

        <button
            id="deleteTrackersBtn"
            class="btn btn-danger"
            style="display:none"
        >
            Delete Selected
        </button>

    </div>
      <div class="roadmap-grid">
       ${trackers.map(tracker => {
  console.log("Rendering tracker:", tracker);
  const total = tracker.totalSteps || 0;
  const completed = tracker.completedSteps || 0;
 const pct =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );
const statusClass =
 tracker.status === "COMPLETED"
 ? "completed"
 : tracker.status === "IN_PROGRESS"
 ? "in-progress"
 : "not-started";
 
  const statusColor =
    tracker.status === "COMPLETED"
      ? "#22c55e"
      : tracker.status === "IN_PROGRESS"
      ? "#f59e0b"
      : "#64748b";

  return `

  <div class="tracker-card">
    <div
        class="tracker-select"
        style="
            display:none;
            margin-bottom:10px;
        "
    >
        <input
            type="checkbox"
            class="tracker-checkbox"
            data-id="${tracker.id}"
        >
    </div>
      <div class="tracker-top">

          <div>
              <div class="tracker-type">
                  ${tracker.type}
              </div>

              <h2>${tracker.roadmapName}</h2>
          </div>

          <div
            class="tracker-status"
            style="background:${statusColor}"
          >
            ${tracker.status}
          </div>

      </div>

      <div class="tracker-stats">

          <div class="stat">
              <span>Steps</span>
              <strong>${completed}/${total}</strong>
          </div>

          <div class="stat">
              <span>Progress</span>
              <strong>${pct}%</strong>
          </div>

          <div class="stat">
              <span>ID</span>
              <strong>#${tracker.id}</strong>
          </div>

      </div>

      <div class="progress-container">
          <div class="progress-fill"
               style="width:${pct}%">
          </div>
      </div>

      <div class="tracker-dates">

          <div>
              <small>Created</small>
              <div>
                  ${new Date(tracker.createdAt)
                    .toLocaleDateString()}
              </div>
          </div>

          <div>
              <small>Updated</small>
              <div>
                  ${new Date(tracker.updatedAt)
                    .toLocaleDateString()}
              </div>
          </div>

      </div>

      <div class="tracker-actions">

         <button
           class="view-btn open-tracker"
           data-roadmap-name="${tracker.roadmapName}"
         >
              Open Roadmap →
         </button>

      </div>

  </div>

  `;
}).join("")}
      </div>
    `;
  }
  document.querySelectorAll(".open-tracker")
.forEach(btn => {

    btn.addEventListener("click", () => {

        const roadmapName =
            btn.dataset.roadmapName;

        const selectedTracker =
            trackers.find(
                t => t.roadmapName === roadmapName
            );

        console.log(
            "Selected Tracker:",
            selectedTracker
        );

        if (!selectedTracker) {
            console.error(
                "Tracker not found"
            );
            return;
        }

        localStorage.setItem(
            "selected_tracker",
            JSON.stringify(selectedTracker)
        );

        window.location.href =
            "individualtracker.html";
    });

});
let selectMode = false;

document.addEventListener("click", async (e) => {

    if (e.target.id === "selectTrackersBtn") {

        selectMode = !selectMode;

        document
            .querySelectorAll(".tracker-select")
            .forEach(el => {

                el.style.display =
                    selectMode
                        ? "block"
                        : "none";
            });

        document.getElementById(
            "deleteTrackersBtn"
        ).style.display =
            selectMode
                ? "inline-block"
                : "none";

        e.target.textContent =
            selectMode
                ? "Cancel"
                : "Select";
    }

    if (e.target.id === "deleteTrackersBtn") {
        const email = user.email;
        console.log(email);
        const sessionId = sessionStorage.getItem("sessionId");
        const selectedIds =
            [
                ...document.querySelectorAll(
                    ".tracker-checkbox:checked"
                )
            ].map(
                cb =>
                    Number(
                        cb.dataset.id
                    )
            );

        if (
            selectedIds.length === 0
        ) {

            alert(
                "Select at least one tracker"
            );

            return;
        }

        const confirmation =
            prompt(
                'Type "DELETE" to confirm'
            );

        if (
            confirmation !== "DELETE"
        ) {

            alert(
                "Deletion cancelled"
            );

            return;
        }

        try {const payload = {
            trackerIds: selectedIds,
            email: email,
            sessionID: sessionId
        };
console.log("Payload for deletion:", payload);
            const response =
                await fetch(
                    API.deleteTrackers(),
                    {
                        method: "DELETE",
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

            if (
                !response.ok
            ) {

                throw new Error(
                    "Delete failed"
                );
            }

            alert(
                "Deleted successfully"
            );

            location.reload();

        } catch (err) {

            console.error(err);

            alert(
                "Delete failed"
            );
        }
    }
});

} catch (err) {

  console.error(err);

  content.innerHTML = `
    <div class="card">
      Failed to load trackers.
    </div>
  `;
}

await applyLanguage();