import { store, renderShell, uid, toast, applyLanguage } from "./shared/store.js";
const user = renderShell("custom");
let pendingNodePosition = null;
if (!user) throw new Error("redir");
async function saveRoadmapToBackend() {
console.log(user);

 const roadmapData = {
  name:
    document
      .getElementById("rmName")
      .value
      .trim() || "Custom Roadmap",
      type:"Custom",

  type:
     "CustomRoadmap",
  difficulty:
    document
      .getElementById("difficulty")
      ?.value || "Beginner",

  userEmail: user.email,
  username: user.username,
  createdAt: new Date().toISOString(),

  jsonData: [{
    "topic":
      document
        .getElementById("rmName")
        .value
        .trim() || "Custom Roadmap",

    "category":
      document
        .getElementById("difficulty")
        ?.value ,

    "type":
      document
        .getElementById("difficulty")
        ?.value || "Beginner",

    "nodes": state.nodes.map(
      (node, index) => ({
        // "node_id": node.id,
        // "step_no": index + 1,
        // "step_name":
        //   node.title || "Untitled Node",

        // "description":
        //   node.description || "",

        // "color": node.color,
        // "shape": node.shape,

        // "position": {
        //   "x": node.x,
        //   "y": node.y
        // }
        
  node_id: node.id,
  step_no: index + 1,
  step_name: node.title,

  description: node.description,

  difficulty: node.difficulty,

  reference_link:
    node.reference,

  color: node.color,

  shape: node.shape,

  position:{
    x:node.x,
    y:node.y
  }

      })
    ),

    "edges": state.edges.map(
      edge => ({

        "source": edge.from,
        "target": edge.to
      })
    )
  }]
};

  try {

    const response =
      fetch(API.customRoadmap(), {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(roadmapData)
});

    if (!response.ok) {
      throw new Error(
        "Failed to save roadmap"
      );
    }

    const result =
      await response.json();

    toast(
      "Roadmap saved successfully!"
    );

    console.log(result);

  } catch (error) {

    console.error(error);

    alert(
      "Failed to save roadmap"
    );

  }
}

document
  .getElementById("saveBtn")
  .addEventListener(
    "click",
    saveRoadmapToBackend
  );

const COLORS = [
  "#E4AF45", // Rich Gold
  "#6FCF97", // Emerald Mint
  "#6AA5E0", // Sapphire Blue
  "#B787E0", // Royal Lavender
  "#E0594B", // Coral Red
  "#56CCF2", // Ice Blue
  "#A8C686", // Sage Green
  "#D4A5A5", // Dusty Rose
  "#8FA8FF", // Periwinkle
  "#C8B6A6", // Champagne Beige
];
// let state = {
//   nodes: [],
//   edges: [],
//   tool: "select",
//   color: COLORS[0],
//   selectedId: null,
//   pendingFrom: null,
// };
let state = {
  nodes: [],
  edges: [],
  tool: "select",
  color: COLORS[0],
  shape: "round",
  description: "Double click to edit",
  selectedId: null,
  pendingFrom: null,
};

const undoStack = [];
const redoStack = [];
function saveHistory() {
  undoStack.push(
    JSON.stringify({
      nodes: state.nodes,
      edges: state.edges,
    })
  );

  redoStack.length = 0;

  if (undoStack.length > 50)
    undoStack.shift();
}

function undo() {
  if (!undoStack.length) return;

  redoStack.push(
    JSON.stringify({
      nodes: state.nodes,
      edges: state.edges,
    })
  );

  const prev = JSON.parse(
    undoStack.pop()
  );

  state.nodes = prev.nodes;
  state.edges = prev.edges;

  render();
}

function redo() {
  if (!redoStack.length) return;

  undoStack.push(
    JSON.stringify({
      nodes: state.nodes,
      edges: state.edges,
    })
  );

  const next = JSON.parse(
    redoStack.pop()
  );

  state.nodes = next.nodes;
  state.edges = next.edges;

  render();
}
function renderTools() {
  document
    .querySelectorAll(".tool-btn")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.tool === state.tool),
    );
  document
    .querySelectorAll(".swatch")
    .forEach((s) =>
      s.classList.toggle("active", s.dataset.color === state.color),
    );
}
function render() {
  renderTools();
  const board = document.getElementById("board");
  const W = board.clientWidth,
    H = board.clientHeight;

  let edgesSvg = `
<svg class="canvas-svg-edges"
     viewBox="0 0 ${W} ${H}"
     preserveAspectRatio="none">

  <defs>
    <marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="8"
      markerHeight="8"
      orient="auto">

      <path
        d="M 0 0 L 10 5 L 0 10 z"
        fill="var(--gold)">
      </path>

    </marker>
  </defs>
`;

state.edges.forEach((e) => {

  const a = state.nodes.find(
    n => n.id === e.from
  );

  const b = state.nodes.find(
    n => n.id === e.to
  );

  if (!a || !b) return;

  edgesSvg += `
    <line
      x1="${a.x}"
      y1="${a.y}"
      x2="${b.x}"
      y2="${b.y}"
      marker-end="url(#arrow)"
    />
  `;
});

edgesSvg += `</svg>`;
  const nodesHtml = state.nodes
    .map(
      (n) => `
   <div class="cnode shape-${n.shape} ${
  n.id === state.selectedId ? "selected" : ""
}"
data-id="${n.id}"
style="
  left:${n.x}px;
  top:${n.y}px;
  background:${n.color};
"
>
<div class="node-text">
  <div class="node-title">${n.title}</div>
  <div class="node-desc">${n.description}</div>
</div>
</div>`,
    )
    .join("");
  board.innerHTML = `<div class="grid-bg"></div>${edgesSvg}${nodesHtml}`;
  board.querySelectorAll(".cnode").forEach((el) => {
    el.addEventListener("pointerdown", (e) => onNodeDown(e, el.dataset.id));

    el.addEventListener("dblclick", () => {
  const n = state.nodes.find(
    (x) => x.id === el.dataset.id
  );

  const title = prompt(
    "Node title",
    n.title || ""
  );

  if (title === null) return;

  const description = prompt(
    "Node description",
    n.description || ""
  );

  if (description === null) return;

  n.title = title;
  n.description = description;

  render();
});
  });
}
document
  .getElementById("shapeSelect")
  .addEventListener("change", (e) => {
    state.shape = e.target.value;
  });

document
  .getElementById("undoBtn")
  .addEventListener("click", undo);

document
  .getElementById("redoBtn")
  .addEventListener("click", redo);


  window.addEventListener("keydown", (e) => {

  if (e.ctrlKey && e.key === "z") {
    e.preventDefault();
    undo();
  }

  if (e.ctrlKey && e.key === "y") {
    e.preventDefault();
    redo();
  }
});


function onNodeDown(e, id) {
  if (!e.isPrimary || e.button !== 0) return;
  e.stopPropagation();
  if (state.tool === "edge") {
    if (!state.pendingFrom) state.pendingFrom = id;
    else {
      if (state.pendingFrom !== id)
        saveHistory();
        state.edges.push({ id: uid(), from: state.pendingFrom, to: id });
      state.pendingFrom = null;
      render();
    }
    return;
  }
  if (state.tool === "delete") {
    saveHistory();
    state.nodes = state.nodes.filter((n) => n.id !== id);
    state.edges = state.edges.filter((e) => e.from !== id && e.to !== id);
    render();
    return;
  }
  state.selectedId = id;
  const n = state.nodes.find((x) => x.id === id);
  const board = document.getElementById("board");
  board.setPointerCapture(e.pointerId);
  const rect = board.getBoundingClientRect();
  const offX = e.clientX - rect.left - n.x,
    offY = e.clientY - rect.top - n.y;
  render();
  const move = (ev) => {
    n.x = ev.clientX - rect.left - offX;
    n.y = ev.clientY - rect.top - offY;
    render();
  };
  const finish = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", finish);
    window.removeEventListener("pointercancel", finish);
    if (board.hasPointerCapture(e.pointerId)) {
      board.releasePointerCapture(e.pointerId);
    }
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", finish);
  window.addEventListener("pointercancel", finish);
}


document
.getElementById("board")
.addEventListener("click", (e) => {

  if(state.tool !== "node"){
    state.selectedId = null;
    render();
    return;
  }

  const rect =
    e.currentTarget.getBoundingClientRect();

  pendingNodePosition = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };

  document
    .getElementById("nodeModal")
    .classList.add("active");
});


document
.getElementById("createNodeBtn")
.addEventListener("click", () => {

  const title =
    document
    .getElementById("nodeTitle")
    .value
    .trim();

  const description =
    document
    .getElementById("nodeDescription")
    .value
    .trim();

  const difficulty =
    document
    .getElementById("nodeDifficulty")
    .value;

  const reference =
    document
    .getElementById("nodeReference")
    .value
    .trim();

  if(!title){
    alert("Enter node name");
    return;
  }

  saveHistory();

  state.nodes.push({

    id: uid(),

    x: pendingNodePosition.x,
    y: pendingNodePosition.y,

    title,
    description,

    difficulty,
    reference,

    color: state.color,
    shape: state.shape

  });

  document
    .getElementById("nodeModal")
    .classList.remove("active");

  document
    .getElementById("nodeTitle")
    .value = "";

  document
    .getElementById("nodeDescription")
    .value = "";

  document
    .getElementById("nodeReference")
    .value = "";

  render();
});


document
.getElementById("cancelNodeBtn")
.addEventListener("click", () => {

  document
    .getElementById("nodeModal")
    .classList.remove("active");
});

document.querySelectorAll(".tool-btn").forEach((b) =>
  b.addEventListener("click", () => {
    state.tool = b.dataset.tool;
    state.pendingFrom = null;
    render();
  }),
);
document.querySelectorAll(".swatch").forEach((s) =>
  s.addEventListener("click", () => {
    state.color = s.dataset.color;
    render();
  }),
);

document.getElementById("saveBtn").addEventListener("click", () => {
  const name =
    document.getElementById("rmName").value.trim() || "Custom Roadmap";
  const s = store.load();
  s.customRoadmaps.push({
    id: uid(),
    name,
    nodes: state.nodes,
    edges: state.edges,
    createdAt: new Date().toISOString(),
    userEmail: user.email,
  });
  store.save(s);

});
document.getElementById("clearBtn").addEventListener("click", () => {
  
  if (confirm("Clear the canvas?")) {
    saveHistory();
    state.nodes = [];
    state.edges = [];
    render();
  }
});

// Initial palette setup
const palette = document.querySelector(".swatches");
palette.innerHTML = COLORS.map(
  (c) =>
    `<div class="swatch ${c === state.color ? "active" : ""}" data-color="${c}" style="background:${c}"></div>`,
).join("");
palette.querySelectorAll(".swatch").forEach((s) =>
  s.addEventListener("click", () => {
    state.color = s.dataset.color;
    render();
  }),
);

render();
await applyLanguage();
window.addEventListener("resize", render);
