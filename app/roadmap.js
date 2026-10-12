
import { store, renderShell } from "./shared/store.js";

const user = renderShell("dashboard");
let roadmapDatas = null;
let roadmapData = null;
if (!user) throw new Error("redir");

toggleTrackerButton()

document
  .getElementById(
    "trackRoadmap"
  )
  ?.addEventListener(
    "click",
    addToTracker
  );

function toggleTrackerButton() {

  const source =
    sessionStorage.getItem(
      "roadmapSource"
    );

  console.log("Source:", source);

  const tracker =
    document.getElementById(
      "trackRoadmap"
    );

  if (!tracker) return;

  if (source === "dashboard") {

    tracker.style.display =
      "block";

  } else {

    tracker.style.display =
      "none";

  }
}

function getUserInfo() {

    const clarity =
        JSON.parse(
            localStorage.getItem(
                "clarity_state_v1"
            )
        );

    if (!clarity) {
        throw new Error(
            "User data not found"
        );
    }

    const currentEmail =
        clarity.currentUser;

    const user =
        clarity.users?.[
            currentEmail
        ];

    if (!user) {
        throw new Error(
            "Current user not found"
        );
    }

    return {

        id: user.id,

        username:
            user.username,

        email:
            user.email,

        plan:
            user.plan
    };
}

function getRoadmapData() {

    const cacheKey =
        localStorage.getItem(
            "selectedRoadmap"
        );

    const roadmapCache =
        JSON.parse(
            localStorage.getItem(
                "roadmapCache"
            )
        );

    console.log("Selected Key:", cacheKey);
    console.log("Cache:", roadmapCache);

    if (!cacheKey) {
        throw new Error(
            "Selected roadmap not found"
        );
    }

    if (!roadmapCache) {
        throw new Error(
            "Roadmap cache not found"
        );
    }

    const roadmap =
        roadmapCache[cacheKey];

    if (!roadmap) {
        throw new Error(
            `Roadmap '${cacheKey}' not found in cache`
        );
    }

    return {
        key: cacheKey,
        type: roadmap.type,
        data: roadmap
    };
}
function buildGeneratedTracker(
    roadmapInfo,
    user
) {

    const level =
        (
            roadmapInfo.data.difficulty ||
            "beginner"
        ).toLowerCase();

    const roadmap =
        roadmapInfo
            .data
            .data[0][level];

    if (!roadmap) {
        throw new Error(
            `Roadmap level '${level}' not found`
        );
    }

    return {

        username:
            user.username,

        userEmail:
            user.email,

        roadmapName:
            roadmapInfo.data.topic,

        type:
            "Generated",

        jsonData:
            JSON.stringify({
                [level]:
                    roadmap
            }),

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

        status:
            "NOT_STARTED",

        completedSteps: 0,

        totalSteps:
            roadmap.nodes.length,

        completedpercentage: 0
    };
}


function buildCustomTracker(
    roadmapInfo,
    user
) {

    const roadmap =
        roadmapInfo.data.data[0];

    if (!roadmap) {
        throw new Error(
            "Custom roadmap not found"
        );
    }

    return {

        username:
            user.username,

        userEmail:
            user.email,

        roadmapName:
           roadmap.topic,

        type:
            "CustomRoadmap",

        jsonData:
            JSON.stringify(
                roadmap
            ),

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

        status:
            "NOT_STARTED",

        completedSteps: 0,

        totalSteps:
            roadmap.nodes.length,

        completedpercentage: 0
    };
}




async function saveTracker(
    trackerData
) {

    // const response =
    //     await fetch(
    //       API.saveTracker(),
    //         {
    //             method: "POST",

    //             headers: {
    //                 "Content-Type":
    //                     "application/json"
    //             },

    //             body:
    //                 JSON.stringify(
    //                     trackerData
    //                 )
    //         }
    //     );
    const sessionId = sessionStorage.getItem("sessionId");

const payload = {
    trackerData: trackerData,
    email: user.email,
    sessionID: sessionId
};
console.log(payload)
const res = await fetch(
    API.saveTracker(),
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
    }
);

    const result =
        await response.json();

    if (!response.ok) {

        throw new Error(
            result.message ||
            "Failed to save tracker"
        );
    }

    return result;
}

async function addToTracker() {

    try {

        const user =
            getUserInfo();

        const roadmapInfo =
            getRoadmapData();

        let trackerData;

        if (
            roadmapInfo.type ===
            "CustomRoadmap"
        ) {

            trackerData =
                buildCustomTracker(
                    roadmapInfo,
                    user
                );

        } else {

            trackerData =
                buildGeneratedTracker(
                    roadmapInfo,
                    user
                );
        }

        const result =
            await saveTracker(
                trackerData
            );

        alert(
            result.message
        );

    } catch (error) {

        alert(
            error.message
        );

        console.error(
            error
        );
    }
}

// async function addToTracker() {

//     try {

//         // ====================
//         // USER
//         // ====================

//         const user =
//             getUserInfo();

//         console.log(
//             "User:",
//             user
//         );

//         // ====================
//         // ROADMAP
//         // ====================
// const roadmapInfo =
//     getRoadmapData();

// console.log(roadmapInfo);

//         // ====================
//         // BUILD PAYLOAD
//         // ====================

//         let trackerData;

// if (
//     roadmapInfo.type ===
//     "CustomRoadmap"
// ) {

//     trackerData =
//         buildCustomTracker(
//             roadmapInfo,
//             user
//         );

// } else {

//     trackerData =
//         buildGeneratedTracker(
//             roadmapInfo,
//             user
//         );
// }

//         console.log(
//             "Payload:",
//             trackerData
//         );

//         // ====================
//         // SAVE
//         // ====================

//         const result =
//             await saveTracker(
//                 trackerData
//             );

//         console.log(
//             result
//         );

//         alert(
//             "Roadmap added to tracker successfully"
//         );

//     } catch (error) {

//         console.error(
//             error
//         );

//         alert(
//             error.message ||
//             "Something went wrong"
//         );
//     }
// }



let loadingInterval;

function startLoading() {

  const overlay =
    document.getElementById(
      "loadingOverlay"
    );

  const percentText =
    document.getElementById(
      "loadingPercent"
    );

  const circle =
    document.getElementById(
      "progressCircle"
    );

  overlay.classList.add("active");

  let value = 0;

  clearInterval(
    loadingInterval
  );

  loadingInterval =
    setInterval(() => {

      value++;

      if (value > 95) {
        clearInterval(
          loadingInterval
        );
        return;
      }

      percentText.textContent =
        value + "%";

      const offset =
        327 - (327 * value) / 100;

      circle.style.strokeDashoffset =
        offset;

    }, 35);
}

function stopLoading() {

  clearInterval(
    loadingInterval
  );

  const circle =
    document.getElementById(
      "progressCircle"
    );

  document.getElementById(
    "loadingPercent"
  ).textContent = "100%";

  circle.style.strokeDashoffset =
    "0";

  setTimeout(() => {

    document
      .getElementById(
        "loadingOverlay"
      )
      .classList.remove("active");

  }, 400);
}


document
  .getElementById("downloadBtn")
  .addEventListener(
    "click",
    downloadRoadmapPDF
  );


document
  .querySelectorAll(".node-card")
  .forEach(el => {
    el.style.animation = "none";
    el.style.transform = "none";
  });



function prepareCanvasForExport() {

  const inner =
    document.getElementById("canvasInner");
  const originalWidth = inner.scrollWidth;
  const originalHeight = inner.scrollHeight;

  const nodes =
    inner.querySelectorAll(".node-card, .cnode");

  let maxRight = 0;
  let maxBottom = 0;

  nodes.forEach(node => {

    const left =
      node.offsetLeft;

    const top =
      node.offsetTop;

    const width =
      node.offsetWidth;

    const height =
      node.offsetHeight;

    maxRight =
      Math.max(
        maxRight,
        left + width
      );

    maxBottom =
      Math.max(
        maxBottom,
        top + height
      );

  });

  const width = Math.max(originalWidth, maxRight + 100);
  const height = Math.max(originalHeight, maxBottom + 100);

  inner.style.width = `${width}px`;
  inner.style.height = `${height}px`;

  return {
    width,
    height
  };
}

async function downloadRoadmapPDF() {

  const inner =
    document.getElementById(
      "canvasInner"
    );

  const title =
    document.getElementById("title")
      ?.textContent
      ?.trim() || "Roadmap";

  const nodes = [
    ...inner.querySelectorAll(".node-card, .cnode")
  ];
  const originalInnerSize = {
    width: inner.style.width,
    height: inner.style.height
  };
  const originalNodeStyles = nodes.map(node => ({
    node,
    animation: node.style.animation,
    transform: node.style.transform
  }));

  try {
    nodes.forEach(node => {
      node.style.animation = "none";
      if (node.classList.contains("node-card")) {
        node.style.transform = "none";
      }
    });

    const size = prepareCanvasForExport();
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(inner, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0f172a",
      width: size.width,
      height: size.height,
      windowWidth: size.width,
      windowHeight: size.height
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "mm",
      format: "a4"
    });
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;
    const imageScale = contentWidth / canvas.width;
    const sourcePageHeight = contentHeight / imageScale;

    for (let sourceY = 0; sourceY < canvas.height; sourceY += sourcePageHeight) {
      if (sourceY > 0) pdf.addPage();

      const sliceHeight = Math.min(
        sourcePageHeight,
        canvas.height - sourceY
      );
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.ceil(sliceHeight);
      pageCanvas.getContext("2d").drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      );

      pdf.addImage(
        pageCanvas.toDataURL("image/png"),
        "PNG",
        margin,
        margin,
        contentWidth,
        sliceHeight * imageScale,
        undefined,
        "FAST"
      );
    }

    pdf.save(`${title}.pdf`);
  } finally {
    inner.style.width = originalInnerSize.width;
    inner.style.height = originalInnerSize.height;
    originalNodeStyles.forEach(({ node, animation, transform }) => {
      node.style.animation = animation;
      node.style.transform = transform;
    });
  }
}

let isFetching=false;

async function fetchRoadmap() {

  // const roadmapInfo =
  //   JSON.parse(localStorage.getItem("latestRoadmap"));
    if (isFetching) {
    console.log("Already fetching");
    return;
  }

  isFetching = true;

  const roadmapInfo =
  JSON.parse(localStorage.getItem("latestRoadmap"));

const user =
  JSON.parse(localStorage.getItem("clarity_state_v1"));

const email = user.currentUser;


  try {

    startLoading();

    const url = API.roadmapTemplate(
      roadmapInfo.category,
      roadmapInfo.name,
      roadmapInfo.level,
      email
    );

    // const res = await fetch(url);
    const sessionId = sessionStorage.getItem("sessionId");

const res = await fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        sessionID: sessionId
    })
});

    if (!res.ok) {
      alert("Response");
      window.location.href = "/app/upgrade.html";
      throw new Error("Failed to fetch roadmap");
    }

    const apiResponse = await res.json();

    const data = apiResponse[0];

    const difficulty =
      roadmapInfo.level.toLowerCase();

    if (difficulty === "beginner") {
      roadmapData = data.beginner;
    }
    else if (difficulty === "intermediate") {
      roadmapData = data.intermediate;
    }
    else {
      roadmapData = data.advanced;
    }

    /* ==========================
       SAVE ROADMAP CACHE
    ========================== */

    const cacheKey =
      `${roadmapInfo.name}-${roadmapInfo.level}`;

    const roadmapCache =
      JSON.parse(
        localStorage.getItem("roadmapCache")
      ) || {};

    roadmapCache[cacheKey] = {
      topic: roadmapInfo.name,
      category: roadmapInfo.category,
      difficulty: roadmapInfo.level,
      fetchedAt: new Date().toISOString(),
      data: roadmapData
    };

    localStorage.setItem(
      "roadmapCache",
      JSON.stringify(roadmapCache)
    );

    console.log(
      "Saved roadmap:",
      cacheKey
    );
    stopLoading();
    renderCanvas();

  }
  catch (err) {

    console.error(err);

    document.getElementById("canvasInner").innerHTML = `
      <div style="
        text-align:center;
        padding:40px;
        font-size:18px;
      ">
        Failed to load roadmap.
      </div>
    `;
  }finally{
    isFetching=false;
  }
}


function getDifficultyClass(difficulty) {

  const d = (difficulty || "").toLowerCase();

  if (d === "easy") return "easy";
  if (d === "medium") return "medium";
  if (d === "hard") return "hard";
  if (d === "very hard") return "very-hard";

  return "default";
}
function getEstimatedDays(difficulty) {

  const diff = (difficulty || "")
    .toLowerCase()
    .trim();

  switch (diff) {

    case "easy":
      return "2 - 3 Days";

    case "medium":
      return "4 - 5 Days";

    case "hard":
      return "7 - 8 Days";

    case "veryhard":
      return "10 - 12 Days";

    default:
      return "Not Available";
  }
}


function openStepModal(node) {

  const modal =
    document.getElementById("stepModal");

  const body =
    document.getElementById("modalBody");

  body.innerHTML = `

    <div class="modal-title">
      ${node.step_name}
    </div>

    <p style="
      color:#cbd5e1;
      line-height:1.7;
      margin-bottom:20px;
    ">
      ${node.description}
    </p>

    <div class="modal-grid">

      <div class="info-card">
        <div class="info-label">
          Step Number
        </div>

        <div class="info-value">
          ${node.step_no}
        </div>
      </div>

      <div class="info-card">
        <div class="info-label">
          Difficulty
        </div>

        <div class="info-value">
          ${node.difficulty}
        </div>
      </div>

      <div class="info-card">
        <div class="info-label">
          Estimated Time
        </div>

        <div class="info-value">
  ${getEstimatedDays(node.difficulty)}
</div>
      </div>

     

    </div>

    <h3 style="margin-top:25px">
      Learning Resources
    </h3>

    <a class="reference-list" href="${node.reference}" target="_blank">

     ●  ${(node.reference)
        
        }
    </a>

  `;

  modal.classList.add("active");
}

/* =====================================
   ROADMAP RENDERER
===================================== */
let roadmapInfo;
function renderCanvas() {

  if (!roadmapData) return;
  console.log("This is the extracted Data"+roadmapData);
  const nodes = roadmapData.nodes;
 roadmapInfo =
  JSON.parse(localStorage.getItem("latestRoadmap"));

console.log(roadmapInfo);

   document.getElementById("title")
      .textContent = `${roadmapInfo.custom_name}`;

    document.getElementById("cat")
      .textContent =
      `${roadmapInfo.category} · ${roadmapInfo.level}`;

    // document.getElementById("meta")
    //   .textContent =
    //   `${generatedRoadmap.nodes.length} milestones`;
  const inner =
    document.getElementById("canvasInner");

  const W =
    inner.clientWidth || 1200;

  const isNarrow = window.matchMedia("(max-width: 700px)").matches;
  const cardW = isNarrow
    ? Math.max(0, Math.min(280, W - 24))
    : 280;
  const colW = 320;
  const rowH = 220;

  const cols = isNarrow
    ? 1
    : Math.max(2, Math.floor((W - 40) / colW));

  const rows =
    Math.ceil(nodes.length / cols);

  inner.style.minHeight =
    rows * rowH + 120 + "px";

  const positions = nodes.map(
    (node, index) => {

      const row =
        Math.floor(index / cols);

      const colInRow =
        index % cols;

      const ltr =
        row % 2 === 0;

      const colIndex =
        ltr
          ? colInRow
          : cols - 1 - colInRow;

      return {
        x: isNarrow
          ? (W - cardW) / 2
          : (W - cols * colW) / 2 + colIndex * colW + 20,

        y:
          40 + row * rowH
      };
    }
  );

  const H =
    rows * rowH + 120;

  let svg = `
    <svg
      class="canvas-svg"
      viewBox="0 0 ${W} ${H}"
      preserveAspectRatio="none"
    >
  `;

  for (
    let i = 0;
    i < positions.length - 1;
    i++
  ) {

    const a = positions[i];
    const b = positions[i + 1];

    const ax = a.x + cardW / 2;
    const ay = a.y + 70;

    const bx = b.x + cardW / 2;
    const by = b.y + 70;

    const cx = (ax + bx) / 2;

    svg += `
      <path
        d="
          M${ax},${ay}
          C${cx},${ay}
          ${cx},${by}
          ${bx},${by}
        "
        style="
          animation-delay:${i * .12}s
        "
      />
    `;
  }

  svg += `</svg>`;

  const cards = nodes.map(
    (node, index) => {

      const pos =
        positions[index];

     return `
<div
  class="node-card"
  data-index="${index}"
  style="
    left:${pos.x}px;
    top:${pos.y}px;
    width:${cardW}px;
    animation-delay:${index * .08}s
  "
>

  <span class="n-idx">
    STEP ${node.step_no}
  </span>

  <h4>${node.step_name}</h4>

  <p>${node.description}</p>

  <div class="difficulty-badge ${getDifficultyClass(node.difficulty)}">
    ${node.difficulty}
  </div>

</div>
`;
    }
  ).join("");

  inner.innerHTML =
    svg + cards;
    

      document.querySelectorAll(".node-card")
  .forEach(card => {

    card.addEventListener("click", () => {

      const node =
        nodes[card.dataset.index];

      openStepModal(node);

    });

  });
  document
  .getElementById("closeModal")
  .addEventListener("click", () => {

    document
      .getElementById("stepModal")
      .classList.remove("active");

  });

document
  .getElementById("stepModal")
  .addEventListener("click", e => {

    if (e.target.id === "stepModal") {

      document
        .getElementById("stepModal")
        .classList.remove("active");

    }

  });
}


function renderCustomRoadmap(data) {

  const roadmap =
    Array.isArray(data)
      ? data[0]
      : data;

  const nodes =
    roadmap.nodes || [];

  const edges =
    roadmap.edges || [];

  if (!nodes.length) {
    console.error("No nodes found");
    return;
  }

  const inner =
    document.getElementById(
      "canvasInner"
    );

  if (!inner) {
    console.error(
      "canvasInner not found"
    );
    return;
  }

  const isNarrow = window.matchMedia("(max-width: 700px)").matches;
  const positions = nodes.map((node, index) =>
    isNarrow
      ? { x: inner.clientWidth / 2, y: 60 + index * 220 }
      : node.position
  );

  inner.classList.toggle("is-stacked", isNarrow);

  let maxX = 0;
  let maxY = 0;

  positions.forEach(position => {

    maxX = Math.max(
      maxX,
      Number(
        position?.x || 0
      )
    );

    maxY = Math.max(
      maxY,
      Number(
        position?.y || 0
      )
    );

  });

  const width = isNarrow
    ? inner.clientWidth
    : Math.max(inner.clientWidth, maxX + 300);

  const height = isNarrow
    ? nodes.length * 220 + 120
    : maxY + 300;

  inner.style.minHeight =
    height + "px";

  let svg = `
    <svg
      class="canvas-svg-edges"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >
  `;

  edges.forEach(edge => {

    const source =
      nodes.find(
        n =>
          n.node_id ===
          edge.source
      );

    const target =
      nodes.find(
        n =>
          n.node_id ===
          edge.target
      );

    if (
      !source ||
      !target
    ) return;

    const sourceIndex = nodes.indexOf(source);
    const targetIndex = nodes.indexOf(target);

    const x1 = Number(positions[sourceIndex].x);

    const y1 = Number(positions[sourceIndex].y);

    const x2 = Number(positions[targetIndex].x);

    const y2 = Number(positions[targetIndex].y);

    svg += `
      <line
        x1="${x1}"
        y1="${y1}"
        x2="${x2}"
        y2="${y2}"
      />
    `;
  });

  svg += `</svg>`;

  const cards =
    nodes
      .map(
        (
          node,
          index
        ) => {

          const color =
            node.color ||
            "#E4AF45";

          const shape =
            node.shape ||
            "round";

          return `
            <div
              class="
                cnode
                shape-${shape}
              "
              data-index="${index}"
              style="
                left:${positions[index].x}px;
                top:${positions[index].y}px;
                background:${color};
              "
            >

              <div
                class="node-text"
              >

                <div
                  class="node-title"
                >
                  ${
                    node.step_name ||
                    "Untitled Node"
                  }
                </div>

                ${
                  node.description
                    ? `
                      <div
                        class="node-desc"
                      >
                        ${node.description}
                      </div>
                    `
                    : ""
                }

              </div>

            </div>
          `;
        }
      )
      .join("");

  inner.innerHTML =
    svg + cards;

  document
    .querySelectorAll(
      ".cnode"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const node =
            nodes[
              Number(
                card.dataset
                  .index
              )
            ];

          openStepModal(
            node
          );

        }
      );

    });
    const closeBtn =
    document.getElementById(
      "closeModal"
    );

  if (closeBtn) {

    closeBtn.onclick =
      () => {

        document
          .getElementById(
            "stepModal"
          )
          ?.classList.remove(
            "active"
          );

      };

  }

  const modal =
    document.getElementById(
      "stepModal"
    );

  if (modal) {

    modal.onclick =
      e => {

        if (
          e.target.id ===
          "stepModal"
        ) {

          modal.classList.remove(
            "active"
          );

        }

      };

  }

  
}

  function renderCanvass() {


   

  // console.log("Roadmap Data:", roadmapData);

  // if (!roadmapData || !roadmapData.length) {
  //   console.error("roadmapData is empty");
  //   return;
  // }

  // const level =
  //   localStorage.getItem(
  //     "selectedLevel"
  //   ) || "beginner";

  // const roadmap =
  //   roadmapData[0]?.[level];
  const selectedKey =
  localStorage.getItem(
    "selectedRoadmap"
  );

const roadmapCache =
  JSON.parse(
    localStorage.getItem(
      "roadmapCache"
    )
  ) || {};

const roadmapInfo =
  roadmapCache[selectedKey];

const level =
  roadmapInfo.difficulty
    .toLowerCase()
    .trim();

console.log(
  "Difficulty:",
  level
);

const roadmap =
  roadmapData[0]?.[level];

  if (!roadmap) {
    console.error(
      `No roadmap found for level: ${level}`
    );
    return;
  }

  const nodes =
    roadmap.nodes || [];

  const edges =
    roadmap.edges || [];

  if (!nodes.length) {
    console.error("No nodes found");
    return;
  }

  const inner =
    document.getElementById(
      "canvasInner"
    );

  if (!inner) {
    console.error(
      "canvasInner not found"
    );
    return;
  }

  const W =
    inner.clientWidth || 1200;

  const isNarrow = W <= 700;
  const cardW = isNarrow
    ? Math.max(0, Math.min(280, W - 24))
    : 280;
  const colW = 320;
  const rowH = 220;

  const cols = isNarrow
    ? 1
    : Math.max(2, Math.floor((W - 40) / colW));

  const rows =
    Math.ceil(
      nodes.length / cols
    );

  inner.style.minHeight =
    rows * rowH + 120 + "px";

  const positions =
    nodes.map(
      (node, index) => {

        const row =
          Math.floor(
            index / cols
          );

        const colInRow =
          index % cols;

        const ltr =
          row % 2 === 0;

        const colIndex =
          ltr
            ? colInRow
            : cols -
              1 -
              colInRow;

        return {
          x: isNarrow
            ? (W - cardW) / 2
            : (W - cols * colW) / 2 + colIndex * colW + 20,

          y:
            40 +
            row * rowH
        };
      }
    );

  const H =
    rows * rowH + 120;

  let svg = `
    <svg
      class="canvas-svg"
      viewBox="0 0 ${W} ${H}"
      preserveAspectRatio="none"
    >
  `;

  edges.forEach(
    (edge, index) => {

      const fromIndex =
        nodes.findIndex(
          n =>
            n.node_id ===
            edge.source
        );

      const toIndex =
        nodes.findIndex(
          n =>
            n.node_id ===
            edge.target
        );

      if (
        fromIndex === -1 ||
        toIndex === -1
      )
        return;

      const a =
        positions[
          fromIndex
        ];

      const b =
        positions[
          toIndex
        ];

      const ax =
        a.x + cardW / 2;

      const ay =
        a.y + 70;

      const bx =
        b.x + cardW / 2;

      const by =
        b.y + 70;

      const cx =
        (ax + bx) / 2;

      svg += `
        <path
          d="
            M${ax},${ay}
            C${cx},${ay}
            ${cx},${by}
            ${bx},${by}
          "
          style="
            animation-delay:${index * 0.12}s
          "
        />
      `;
    }
  );

  svg += `</svg>`;

  const cards =
    nodes
      .map(
        (
          node,
          index
        ) => {

          const pos =
            positions[
              index
            ];

          return `
            <div
              class="node-card"
              data-index="${index}"
              style="
                left:${pos.x}px;
                top:${pos.y}px;
                width:${cardW}px;
                animation-delay:${index * 0.08}s;
              "
            >

              <span class="n-idx">
                STEP ${node.step_no}
              </span>

              <h4>
                ${node.step_name}
              </h4>

              <p>
                ${node.description}
              </p>

              <div
                class="
                  difficulty-badge
                  ${getDifficultyClass(
                    node.difficulty
                  )}
                "
              >
                ${node.difficulty}
              </div>

            </div>
          `;
        }
      )
      .join("");

  inner.innerHTML =
    svg + cards;

  document
    .querySelectorAll(
      ".node-card"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const node =
            nodes[
              Number(
                card.dataset
                  .index
              )
            ];

          openStepModal(
            node
          );

        }
      );

    });

  const closeBtn =
    document.getElementById(
      "closeModal"
    );

  if (closeBtn) {

    closeBtn.onclick =
      () => {

        document
          .getElementById(
            "stepModal"
          )
          ?.classList.remove(
            "active"
          );

      };

  }

  const modal =
    document.getElementById(
      "stepModal"
    );

  if (modal) {

    modal.onclick =
      e => {

        if (
          e.target.id ===
          "stepModal"
        ) {

          modal.classList.remove(
            "active"
          );

        }

      };

  }

  console.log(
    `Rendered ${nodes.length} ${level} roadmap steps`
  );
}
 

async function initializeRoadmap() {

  const selectedKey =
    localStorage.getItem(
      "selectedRoadmap"
    );

  const roadmapCache =
    JSON.parse(
      localStorage.getItem(
        "roadmapCache"
      )
    ) || {};

  console.log(
    "Selected Key:",
    selectedKey
  );

  console.log(
    "Cache:",
    roadmapCache
  );

  if (
    selectedKey &&
    roadmapCache[selectedKey]
  ) {

    const roadmap =
      roadmapCache[selectedKey];

    console.log(
      "Loading roadmap from cache:",
      roadmap
    );

    roadmapData =
      roadmap.data;

    document.getElementById(
      "title"
    ).textContent =
      roadmap.topic;

    document.getElementById(
      "cat"
    ).textContent =
      `${roadmap.type || ""} · ${
        roadmap.difficulty || ""
      }`;

    // CUSTOM ROADMAP
    if (
      roadmap.type ===
      "CustomRoadmap"
    ) {

      console.log(
        "Custom roadmap detected"
      );

      renderCustomRoadmap(
        roadmap.data
      );

      return;
    }

    // STATIC ROADMAP
    renderCanvass();

    return;
  }

  console.log(
    "No cached roadmap found. Fetching..."
  );

  await fetchRoadmap();
}

/* =====================================
   START
===================================== */

await initializeRoadmap();

window.addEventListener(
  "resize",
  () => {

    const selectedKey =
      localStorage.getItem(
        "selectedRoadmap"
      );

    const roadmapCache =
      JSON.parse(
        localStorage.getItem(
          "roadmapCache"
        )
      ) || {};

    const roadmap =
      roadmapCache[selectedKey];

    if (
      roadmap?.type ===
      "CustomRoadmap"
    ) {

      renderCustomRoadmap(
        roadmap.data
      );

    } else {

      renderCanvass();

    }

  }
);