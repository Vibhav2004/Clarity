


import { store, renderShell, generateRoadmap, applyLanguage, t } from "./shared/store.js";

const user = renderShell("new");
if (!user) throw new Error("redir");

/* =========================
   STATE
========================= */
const answers = {};
let i = 0;

let categories = [];
let names = [];

const stepEl = document.getElementById("step");
const stepsEl = document.getElementById("steps");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

/* =========================
   QUESTIONS
========================= */
const QUESTIONS = [
  {
    key: "custom_name",
    label: "What do you want to achieve?",
    type: "text",
    placeholder: "e.g. Become a full-stack developer",
  },
  {
    key: "category",
    label: "Pick a category",
    type: "api-category",
  },
  {
    key: "name",
    label: "Choose focus area",
    type: "api-names",
  },
  {
    key: "level",
    label: "Your current level",
    type: "options",
    options: [
      ["Beginner", "🌱"],
      ["Intermediate", "⚡"],
      ["Advanced", "🚀"],
    ],
  },
  {
    key: "timeline",
    label: "Your desired timeline",
    type: "options",
    options: [
      ["1 Month", "⏱"],
      ["3 Months", "📅"],
      ["6 Months", "🗓"],
      ["12 Months", "📆"],
    ],
  },
  
];

/* =========================
   API CALLS
========================= */
async function fetchCategories() {
  // const res = await fetch(API.roadmapCategories());
  const sessionId = sessionStorage.getItem("sessionId");
console.log("Session ID for fetching categories:", sessionId);
const res = await fetch(
    API.roadmapCategories(),
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: user.email,
            sessionID: sessionId
        })
    }
);
  const data = await res.json();

  categories = Array.isArray(data)
    ? data
    : Object.keys(data);
}

async function fetchNames(category) {
  const sessionId = sessionStorage.getItem("sessionId");

const res = await fetch(
    API.roadmapsInCategory(category),
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
            sessionID: sessionId
        })
    }
);

  if (!res.ok) {
    throw new Error("Failed to fetch names");
  }

  names = await res.json();
}

/* =========================
   BUTTON LOADING STATE
========================= */
function setNextLoading(state, text = "Loading...") {
  nextBtn.disabled = state;
  nextBtn.style.opacity = state ? "0.6" : "1";
  nextBtn.textContent = state
    ? text
    : (i === QUESTIONS.length - 1
        ? "Generate Roadmap"
        : "Next");
}

/* =========================
   RENDER
========================= */
async function render() {
  const q = QUESTIONS[i];

  [...stepsEl.children].forEach((d, idx) => {
    d.classList.toggle("done", idx < i);
    d.classList.toggle("active", idx === i);
  });

  backBtn.style.visibility = i === 0 ? "hidden" : "visible";

  nextBtn.textContent =
    i === QUESTIONS.length - 1
      ? await t("newRoadmap.generateRoadmap")
      : await t("newRoadmap.continue");

  let body = "";

  /* ---------- TEXT ---------- */
  if (q.type === "text") {
    body = `
      <input class="input" id="input"
        placeholder="${q.placeholder}"
        value="${answers[q.key] || ""}" />
    `;

    setTimeout(() => {
      const input = document.querySelector("#input");
      if (input) {
        input.addEventListener("input", (e) => {
          answers[q.key] = e.target.value;
        });
      }
    });
  }

  /* ---------- CATEGORY ---------- */
  else if (q.type === "api-category") {

    body = `<div class="options-grid">
      ${categories.length === 0
        ? `<p>Click Next to load categories</p>`
        : categories.map(cat => `
            <button class="option ${answers[q.key] === cat ? "selected" : ""}"
              data-value="${cat}">
              ${cat}
            </button>
          `).join("")}
    </div>`;
  }

  /* ---------- NAMES ---------- */
  else if (q.type === "api-names") {

    body = `<div class="options-grid">
      ${names.length === 0
        ? `<p>Select category first then click Next</p>`
        : names.map(name => `
            <button class="option ${answers[q.key] === name ? "selected" : ""}"
              data-value="${name}">
              ${name}
            </button>
          `).join("")}
    </div>`;
  }

  /* ---------- STATIC ---------- */
  else {
    body = `<div class="options-grid">
      ${q.options.map(([label, icon]) => `
        <button class="option ${answers[q.key] === label ? "selected" : ""}"
          data-value="${label}">
          <div class="icon">${icon}</div>
          <div class="label">${label}</div>
        </button>
      `).join("")}
    </div>`;
  }

  stepEl.innerHTML = `
    <div style="margin-bottom:24px">
      <h2>${q.label}</h2>
    </div>
    ${body}
  `;

  /* ---------- CLICK ---------- */
  stepEl.querySelectorAll(".option").forEach(o => {
    o.addEventListener("click", () => {

      answers[q.key] = o.dataset.value;

      stepEl.querySelectorAll(".option").forEach(x =>
        x.classList.remove("selected")
      );

      o.classList.add("selected");

      /* preload next step */
      // if (q.type === "api-category") {
      //   fetchNames(o.dataset.value);
      // }
    });
  });

  await applyLanguage();
}

/* =========================
   NAVIGATION (IMPORTANT FIX)
========================= */
backBtn.addEventListener("click", () => {
  if (i > 0) {
    i--;
    render();
  }
});

nextBtn.addEventListener("click", async () => {

  const q = QUESTIONS[i];

  // Validation
  if (q.type === "text") {
    const input = document.querySelector("#input");
    answers[q.key] = input.value.trim();
  }
  if (!answers[q.key]) return;

  /* =========================
     STEP 1 -> LOAD CATEGORIES
  ========================= */
  if (i === 0) {

    if (categories.length === 0) {

      setNextLoading(true, "Loading categories...");

      try {
        await fetchCategories();

        i++; // move to category step ONLY AFTER API

        render();
      } finally {
        setNextLoading(false);
      }

      return;
    }
  }

  /* =========================
     STEP 2 -> LOAD NAMES
  ========================= */
  if (i === 1) {

    if (!answers.category) return;

    if (names.length === 0) {

      setNextLoading(true, "Loading roadmaps...");

      try {
        await fetchNames(answers.category);

        i++; // move to names step ONLY AFTER API

        render();
      } finally {
        setNextLoading(false);
      }

      return;
    }
  }

  /* =========================
     NORMAL FLOW
  ========================= */
  if (i < QUESTIONS.length - 1) {
    i++;
    render();
    return;
  }

  showReview();
});

/* =========================
   REVIEW
========================= */
async function showReview() {
  stepEl.innerHTML = `
  <div class="review-container">

    <div class="review-header">
      <div class="review-badge">FINAL REVIEW</div>
      <h2 class="review-title">Review Your Roadmap</h2>
      <p class="review-subtitle">
        Verify your selections before generating the roadmap.
      </p>
    </div>

    <div class="review-grid">
      ${Object.entries(answers)
        .map(
          ([k, v]) => `
          <div class="review-card">
            <div class="review-label">
              ${k.replace(/([A-Z])/g, " $1")}
            </div>
            <div class="review-value">
              ${v}
            </div>
          </div>
      `
        )
        .join("")}
    </div>

  </div>
`;
console.log(answers);
localStorage.setItem("latestRoadmap", JSON.stringify(answers));


// window.location.href = `roadmap.html?id=${roadmapData.id}`;
  nextBtn.onclick = () => generate();
}

/* =========================
   GENERATE
========================= */
function generate() {
  const roadmap = generateRoadmap(answers);
  roadmap.userEmail = user.email;
  localStorage.removeItem("selectedRoadmap");
  const s = store.load();
  s.roadmaps.push(roadmap);
  store.save(s);
  // mark source page
  sessionStorage.setItem(
    "roadmapSource",
    "new-roadmap"
  );
  window.location.href = `roadmap.html?id=${roadmap.id}`;
}

/* =========================
   INIT
========================= */
await render();