// CLARITY shared client logic — store, auth, generator, sidebar shell.
// Each page-specific JS module imports what it needs from this file.

const STORAGE_KEY = "clarity_state_v1";

const defaults = () => ({
  currentUser: null,
  users: {},
  roadmaps: [],
  customRoadmaps: [],
  customTrackers: [],
  settings: {
    theme: "dark",
    notifications: true,
    emailUpdates: false,
    language: "English",
  },
});

export const store = {
  load() {
    try {
      return {
        ...defaults(),
        ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
      };
    } catch {
      return defaults();
    }
  },
  save(s) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  },
  update(fn) {
    const s = this.load();
    const n = fn(s) || s;
    this.save(n);
    return n;
  },
  current() {
    const s = this.load();
    return s.currentUser ? s.users[s.currentUser] : null;
  },
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity .3s";
  }, 2200);
  setTimeout(() => t.remove(), 2600);
}

export function requireAuth() {
  const u = store.current();
  if (!u) {
    window.location.href = "/app/login.html";
    return null;
  }
  return u;
}
export function redirectIfAuthed() {
  if (store.current()) window.location.href = "/app/dashboard.html";
}
// export function logout() {
//   localStorage.clear();

//   window.location.href = "/app/login.html";
// }

export function logout() {
           const state = store.load();
    const email = state.currentUser;

    console.log("Logout email:", email);
    // const email = localStorage.getItem("currentUser");
    // console.log("Logging out user:", email);
    // if (!email) {
    //     localStorage.clear();
    //     window.location.href = "/app/login.html";
    //     return;
    // }

    fetch("http://localhost:8080/LogOut-User", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            sessionID: sessionStorage.getItem("sessionId") // Include sessionId if needed
        })
    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Logout failed");
        }

        return response.text();
    })
    .then(data => {

        console.log("Logout successful:", data);

        localStorage.clear();
       sessionStorage.clear();
        window.location.href = "/app/login.html";
    })
    .catch(error => {

        console.error("Logout error:", error);

    });
}

export function applyTheme() {
  const theme = (store.load().settings?.theme || "dark").toLowerCase();
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("theme-light", theme === "light");
  document.documentElement.classList.toggle("theme-dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

const LANGUAGE_MAP = {
  English: "en",
  Hindi: "hi",
  Spanish: "es",
  Japanese: "ja",
  French: "fr",
  German: "de",
  Español: "es",
  Français: "fr",
  Deutsch: "de",
  日本語: "ja",
  हिन्दी: "hi",
};

let translationsCache = null;

export async function loadTranslations() {
  if (translationsCache) return translationsCache;
  try {
    const response = await fetch("./shared/lang.json");
    translationsCache = await response.json();
  } catch {
    translationsCache = { en: {} };
  }
  return translationsCache;
}

export function getLanguageKey() {
  const language = store.load().settings?.language || "English";
  return LANGUAGE_MAP[language] || "en";
}

function replaceVars(str, vars = {}) {
  return str.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

export async function t(key, vars = {}) {
  const translations = await loadTranslations();
  const langKey = getLanguageKey();
  const dict = translations[langKey] || translations.en || {};
  // const text = dict[key] ?? translations.en?.[key] ?? key;
  const text =
  dict[key] ??
  translations.en?.[key] ??
  key.split(".").pop();
  return replaceVars(text, vars);
}

function translateElement(el, dict) {
  const key = el.dataset.i18n;
  if (!key) return;
  const value = dict[key];
  if (value != null) el.textContent = value;
}

function translateAttribute(el, attrName, dataKey, dict) {
  const key = el.dataset[dataKey];
  if (!key) return;
  const value = dict[key];
  if (value != null) el.setAttribute(attrName, value);
}

export async function translatePage(root = document) {
  const translations = await loadTranslations();
  const langKey = getLanguageKey();
  const dict = translations[langKey] || translations.en || {};
  const elements = root.querySelectorAll("[data-i18n]");
  elements.forEach((el) => translateElement(el, dict));
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => translateAttribute(el, "placeholder", "i18nPlaceholder", dict));
  root.querySelectorAll("[data-i18n-title]").forEach((el) => translateAttribute(el, "title", "i18nTitle", dict));
  root.querySelectorAll("[data-i18n-value]").forEach((el) => translateAttribute(el, "value", "i18nValue", dict));
  root.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    const value = dict[key];
    if (value != null) el.innerHTML = value;
  });
  const titleEl = root.querySelector("title[data-i18n]");
  if (titleEl) {
    const text = dict[titleEl.dataset.i18n] ?? translations.en?.[titleEl.dataset.i18n];
    if (text != null) titleEl.textContent = text;
  }
  document.documentElement.lang = langKey;
}

export async function applyLanguage() {
  await translatePage();
}

if (typeof document !== "undefined") {
  applyTheme();
}

const TEMPLATES = {
  Programming: [
    [
      "Foundations",
      "Master variables, control flow, functions, and data types in your chosen language.",
    ],
    [
      "Core Data Structures",
      "Arrays, lists, maps, sets, stacks and queues — when and why to use each.",
    ],
    [
      "Algorithms",
      "Sorting, searching, recursion, and basic complexity analysis.",
    ],
    [
      "Version Control",
      "Git fundamentals: commits, branches, merges, pull requests.",
    ],
    ["Web Basics", "HTTP, REST, the request/response lifecycle, JSON."],
    [
      "Specialization",
      "Pick a track (frontend or backend) and ship two small projects end-to-end.",
    ],
    ["Databases", "Relational modeling, SQL queries, joins, and indexing."],
    [
      "Testing & Debugging",
      "Unit, integration, and end-to-end tests; using a real debugger.",
    ],
    [
      "System Design Basics",
      "Caching, load balancing, queues, and scaling patterns.",
    ],
    [
      "Capstone Project",
      "Design, build, and deploy a portfolio-quality application.",
    ],
  ],
  Fitness: [
    [
      "Baseline Assessment",
      "Measure starting weight, body composition, and key strength benchmarks.",
    ],
    [
      "Mobility & Form",
      "Drill movement patterns and warm-ups before adding load.",
    ],
    [
      "Strength Foundation",
      "Squat, hinge, push, pull, carry — full body 3x/week.",
    ],
    [
      "Nutrition Habits",
      "Protein targets, hydration, and a sustainable calorie plan.",
    ],
    ["Conditioning", "Add 2 cardio sessions: one steady, one interval."],
    [
      "Progressive Overload",
      "Track lifts weekly; add weight or reps systematically.",
    ],
    ["Recovery", "Sleep protocol, deload weeks, mobility maintenance."],
    [
      "Phase Two Strength",
      "Hypertrophy or strength block tailored to your goal.",
    ],
    [
      "Re-test & Adjust",
      "Re-measure benchmarks, recalibrate calories and program.",
    ],
    [
      "Sustainable Lifestyle",
      "Lock the routine into a long-term plan you can keep forever.",
    ],
  ],
  Business: [
    [
      "Define the Problem",
      "Pick a painful, recurring problem for a specific audience.",
    ],
    [
      "Audience Research",
      "Interview 10 potential customers; document jobs-to-be-done.",
    ],
    [
      "Validate Demand",
      "Run a landing page or smoke test to measure real interest.",
    ],
    ["MVP Design", "Scope the smallest version that solves the core problem."],
    ["Build MVP", "Ship within 4 weeks; resist scope creep."],
    ["First 10 Customers", "Hand-deliver value; collect deep feedback."],
    [
      "Pricing & Packaging",
      "Test 2-3 price points; build a clear value ladder.",
    ],
    [
      "Acquisition Channel",
      "Pick ONE channel; commit 60 days before changing.",
    ],
    [
      "Retention Loop",
      "Build onboarding, activation, and re-engagement flows.",
    ],
    ["Scale Operations", "Document SOPs, hire your first contractor or tool."],
  ],
  Design: [
    ["Design Principles", "Hierarchy, contrast, balance, and rhythm."],
    [
      "Typography",
      "Scale, pairing, leading, tracking — and when to break rules.",
    ],
    ["Color Theory", "Palettes, contrast ratios, semantic color systems."],
    ["Layout & Grids", "Modular grids, whitespace, and composition."],
    ["Visual Tools", "Master Figma: components, variants, auto layout."],
    [
      "UX Foundations",
      "User research, journey maps, information architecture.",
    ],
    [
      "Prototyping",
      "Interactive prototypes for testing and stakeholder buy-in.",
    ],
    ["Design Systems", "Tokens, components, and documentation."],
    ["Portfolio Pieces", "Three case studies with process and outcome."],
    ["Critique & Iterate", "Join a community; get and give weekly feedback."],
  ],
  Language: [
    [
      "Survival Vocabulary",
      "First 300 words: greetings, numbers, food, directions.",
    ],
    ["Sound System", "Phonetics and pronunciation — record yourself daily."],
    ["Core Grammar", "Present, past, future tenses and sentence structure."],
    ["Reading Practice", "Graded readers and short articles daily."],
    ["Listening Immersion", "Podcasts and shows at your level, 30 min/day."],
    [
      "Speaking Reps",
      "Italki or language exchange — 2 conversations per week.",
    ],
    ["Vocabulary Expansion", "Spaced repetition flashcards every day."],
    ["Writing Practice", "Journal in the target language weekly."],
    ["Cultural Fluency", "Films, music, and idioms from native speakers."],
    [
      "Fluency Test",
      "Take a recognized exam or 30-minute native conversation.",
    ],
  ],
  Other: [
    ["Clarify the Goal", "Write a one-line outcome and the why behind it."],
    ["Break it Down", "Decompose into 6-8 measurable milestones."],
    ["Set Cadence", "Pick weekly review and daily action windows."],
    ["Learn Basics", "Identify the 20% that drives 80% of results."],
    ["First Win", "Ship something small in week one to build momentum."],
    ["Deep Practice", "Block focused time and remove distractions."],
    ["Get Feedback", "Find a coach, mentor, or peer for accountability."],
    ["Track Metrics", "Define one number that proves progress."],
    ["Iterate", "Adjust the plan based on weekly reviews."],
    ["Final Milestone", "Achieve and celebrate the original outcome."],
  ],
};
const LEVEL_OFFSET = { Beginner: 0, Intermediate: 2, Advanced: 4 };
const TIME_COUNT = {
  "1 Month": 5,
  "3 Months": 7,
  "6 Months": 9,
  "12 Months": 10,
};

export function generateRoadmap({
  category,
  level,
  timeline,
  dailyTime,
  name,
}) {
  const tpl = TEMPLATES[category] || TEMPLATES.Other;
  const start = LEVEL_OFFSET[level] || 0;
  const want = TIME_COUNT[timeline] || 8;
  const slice = tpl.slice(start, start + want);
  while (slice.length < Math.min(want, 6))
    slice.push(tpl[slice.length % tpl.length]);
  const monthsNum = parseInt(timeline) || 3;
  const nodes = slice.map(([title, description], i) => ({
    id: uid(),
    idx: i + 1,
    title,
    description,
    duration: `${Math.max(1, Math.round((monthsNum * 4) / slice.length))} weeks`,
    done: false,
  }));
  return {
    id: uid(),
    name: name || `${category} Mastery`,
    category,
    level,
    timeline,
    dailyTime,
    nodes,
    createdAt: new Date().toISOString(),
  };
}

export function renderShell(activeKey) {

    const user = requireAuth();

    if (!user) return null;

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return user;

    // Get latest plan from backend
    checkPlanStatus(user.email).then((plan) => {

        console.log("Plan from backend:", plan);

        const isPremium =
            plan === "Premium" ||
            plan === "premium" ||
            plan === "PREMIUM";

        console.log("isPremium:", isPremium);

        // =====================================
        // SIDEBAR ITEMS
        // =====================================

        const items = [

            {
                key: "dashboard",
                href: "dashboard.html",
                label: "Roadmaps",
                icon: "⌘"
            },

            {
                key: "new",
                href: "new-roadmap.html",
                label: "New Roadmap",
                icon: "+"
            },

            {
                key: "tracker",
                href: "tracker.html",
                label: "Tracker",
                icon: "◉"
            },

            {
                key: "custom",
                href: "custom.html",
                label: "Custom Builder",
                icon: isPremium ? "◈" : "🔒",
                locked: !isPremium
            },

            {
                key: "custom-tracker",
                href: "custom-tracker.html",
                label: "Custom Tracker",
                icon: isPremium ? "▣" : "🔒",
                locked: !isPremium
            },

            {
                key: "settings",
                href: "settings.html",
                label: "Settings",
                icon: "⚙"
            },

            {
                key: "profile",
                href: "profile.html",
                label: "Profile",
                icon: "◉"
            }

        ];

        // =====================================
        // PLAN STATUS
        // =====================================

        let planStatus =
            localStorage.getItem("clarity_user_plan");

        // Update localStorage with latest backend plan
        if (plan) {

            planStatus = plan;

            localStorage.setItem(
                "clarity_user_plan",
                plan
            );
        }

        // =====================================
        // RENDER SIDEBAR
        // =====================================

        sidebar.innerHTML = `

            <a href="dashboard.html" class="brand">
                <span class="dot"></span>
                <span>CLARITY</span>
            </a>

            ${items.map((i) => `

                <a
                    class="nav-item ${
                        i.key === activeKey ? "active" : ""
                    }"

                    href="${i.locked ? "#" : i.href}"

                    data-i18n="${i.label}"

                    ${
                        i.locked
                            ? `data-premium-locked="true"`
                            : ""
                    }
                >

                    <span style="font-size:18px">
                        ${i.icon}
                    </span>

                    ${i.label}

                </a>

            `).join("")}

            <div class="spacer"></div>

            <div class="user-pill">

                <div class="avatar">
                    ${user.username[0].toUpperCase()}
                </div>

                <div style="flex:1; min-width:0">

                    <div class="name">
                        ${user.username}
                    </div>

                    <div class="plan">
                        ${planStatus} plan
                    </div>

                </div>

                <button
                    class="btn btn-sm btn-ghost"
                    id="logoutBtn"
                    title="Sign out"
                >
                    ↪
                </button>

            </div>
        `;

        // =====================================
        // LOGOUT
        // =====================================

        document
            .getElementById("logoutBtn")
            .addEventListener("click", logout);

        // =====================================
        // PREMIUM LOCKED ITEMS
        // =====================================

        sidebar
            .querySelectorAll("[data-premium-locked]")
            .forEach((item) => {

                item.addEventListener("click", (e) => {

                    e.preventDefault();

                    showPremiumPopup();

                });

            });

        // =====================================
        // MOBILE MENU
        // =====================================

        const menuBtn =
            document.getElementById("menuBtn");

        const scrim =
            document.getElementById("scrim");

        if (menuBtn) {

            menuBtn.addEventListener("click", () => {

                sidebar.classList.add("open");
                scrim.classList.add("open");

            });

        }

        if (scrim) {

            scrim.addEventListener("click", () => {

                sidebar.classList.remove("open");
                scrim.classList.remove("open");

            });

        }

    });

    return user;
}


function showPremiumPopup() { 




  // Prevent duplicate popup
  const existing = document.getElementById("premiumPopup");

  if (existing) {
    existing.remove();
  }

  const popup = document.createElement("div");

  popup.id = "premiumPopup";

  popup.innerHTML = `
    <div class="premium-overlay">
      
      <div class="premium-popup">

        <button class="premium-close" id="premiumClose">
          ×
        </button>

        <div class="premium-icon">
          ✦
        </div>

        <h2>Premium Feature</h2>

        <p>
          Custom Builder and Custom Tracker are available
          only for Premium users.
        </p>

        <div class="premium-buttons">
          <button class="btn btn-primary" id="buyPremiumBtn">
            Buy Premium
          </button>

          <button class="btn btn-ghost" id="premiumCancelBtn">
            Maybe Later
          </button>
        </div>

      </div>

    </div>
  `;

  document.body.appendChild(popup);

  // Close button
  document
    .getElementById("premiumClose")
    .addEventListener("click", () => {
      popup.remove();
    });

  // Maybe Later
  document
    .getElementById("premiumCancelBtn")
    .addEventListener("click", () => {
      popup.remove();
    });

  // Buy Premium
  document
    .getElementById("buyPremiumBtn")
    .addEventListener("click", () => {

      // Change this later to your actual payment page
      window.location.href = "/app/upgrade.html";
    });

  // Click outside popup
  document
    .querySelector(".premium-overlay")
    .addEventListener("click", (e) => {
      if (e.target.classList.contains("premium-overlay")) {
        popup.remove();
      }
    });
}

async function checkPlanStatus(email) {
  try {
    // const response = await fetch(
    //   API.plan(email)
    // );
    // const sessionId = sessionStorage.getItem("sessionId");
 const sessionId = sessionStorage.getItem("sessionId");
const response = await fetch(
    API.plan(),
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            sessionID: sessionId
        })
    }
);

    if (!response.ok) {
      console.error("Plan check failed:", response.status);
      return "Free";
    }

    const plan = await response.text();

    console.log("Plan for", email, ":", plan);
    localStorage.setItem("clarity_user_plan", plan); // Store the plan in Local Storage
    return plan;

  } catch (error) {
    console.error("Error checking plan:", error);

    // Always treat failed requests as Free
    return "Free";
  }
}                                           