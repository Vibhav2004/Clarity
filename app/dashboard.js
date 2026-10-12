

import {
  renderShell,
  t,
  applyLanguage
} from "./shared/store.js";

const user = renderShell("dashboard");
if (!user) throw new Error("redir");

document.getElementById("welcome").textContent =
  await t("dashboard.welcome", {
    username: user.username
  });

const content =
  document.getElementById("content");

/* ==========================
   FETCH ROADMAPS
========================== */

async function loadRoadmaps() {

  try {

    // const res = await fetch(
    //   API.allRoadmaps(user.email)
    // );
    const sessionId = sessionStorage.getItem("sessionId");

const res = await fetch(
    API.allRoadmaps(user.email),
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

    if (!res.ok) {
      throw new Error("Failed to fetch roadmaps");
    }

    const roadmaps =
      await res.json();

    console.log("Roadmaps:", roadmaps);

    /* ==========================
       STORE IN LOCAL STORAGE
    ========================== */

    const roadmapCache = {};

    roadmaps.forEach(r => {

      let roadmapJson;

      try {

        roadmapJson =
          typeof r.jsonData === "string"
            ? JSON.parse(r.jsonData)
            : r.jsonData;

      }
      catch {

        roadmapJson = r.jsonData;
      }

      const key =
        `${r.roadmapName}-${r.type}`;

      roadmapCache[key] = {
        topic: r.roadmapName,
        type: r.type,
        difficulty: r.difficulty,
        fetchedAt: new Date().toISOString(),
        data: roadmapJson
      };
    });

    localStorage.setItem(
      "roadmapCache",
      JSON.stringify(roadmapCache)
    );

    renderRoadmaps(roadmapCache);

  }
  catch (err) {

    console.error(err);

    content.innerHTML = `
      <div class="card empty-state">
        <h3>
          Failed to load roadmaps
        </h3>
      </div>
    `;
  }
}

/* ==========================
   RENDER ROADMAPS
========================== */

function renderRoadmaps(roadmapCache) {

  const roadmaps =
    Object.entries(roadmapCache);

  if (roadmaps.length === 0) {

    content.innerHTML = `
      <div class="card empty-state slide-up">
        <div style="font-size:48px;opacity:.5">
          ◇
        </div>

        <h3>No roadmaps yet</h3>

        <p>
          Generate your first roadmap.
        </p>

        <a
          class="btn btn-primary"
          href="new-roadmap.html"
          style="margin-top:20px"
        >
          Create Roadmap
        </a>
      </div>
    `;

    return;
  }

  content.innerHTML = `
    <div class="roadmap-grid">

      ${roadmaps.map(([key, roadmap]) => {

        const nodes =
          roadmap.data.nodes || [];

        const completed =
          nodes.filter(
            n => n.completed === true
          ).length;

        const progress =
          nodes.length
            ? Math.round(
                (completed / nodes.length) * 100
              )
            : 0;

        return `
          <div
            class="card card-hover roadmap-card slide-up"
            onclick="openRoadmap('${key}')"
          >

            <div class="category">
              ${roadmap.type}
              ·
              ${roadmap.difficulty}
            </div>

            <h3>
              ${roadmap.topic}
            </h3>

           
            <div
              style="
                display:flex;
                justify-content:right;
                margin-top:10px;
                font-size:13px;
                color:#94a3b8;
              "
            >
         <p style="font-size:15px">
           >
</p>
            </div>

          </div>
        `;

      }).join("")}

    </div>
  `;
}

/* ==========================
   OPEN ROADMAP
========================== */


window.openRoadmap = function(key) {

  localStorage.setItem(
    "selectedRoadmap",
    key
  );

  // mark source page
  sessionStorage.setItem(
    "roadmapSource",
    "dashboard"
  );

  window.location.href =
    "roadmap.html";
};
/* ==========================
   START
========================== */

await loadRoadmaps();
await applyLanguage();