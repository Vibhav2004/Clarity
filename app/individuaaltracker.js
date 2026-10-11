import { renderShell, applyLanguage } from "./shared/store.js";

const user = renderShell("tracker");
if (!user) throw new Error("redir");

const tracker = JSON.parse(
    localStorage.getItem("selected_tracker")
);

if (!tracker) {
    window.location.href = "tracker.html";
    throw new Error("Tracker not found");
}

console.log("Tracker:", tracker);

// ======================
// PARSE ROADMAP
// ======================

let roadmapData = tracker.jsonData;

while (typeof roadmapData === "string") {
    roadmapData = JSON.parse(roadmapData);
}

console.log("Roadmap Data:", roadmapData);

const savedProgress =
    JSON.parse(
        localStorage.getItem(
            `progress_${tracker.id}`
        )
    ) || [];

const roadmap = roadmapData;

const roadmapLevel =
    roadmap.type ||
    tracker.type ||
    "beginner";

const r = {

    id: tracker.id,

    name: tracker.roadmapName,

    level: roadmapLevel,

    nodes: (roadmap.nodes || []).map((node, index) => ({

        id:
            node.node_id,

        idx:
            node.step_no || index + 1,

        title:
            node.step_name,

        description:
            node.description || "",

        difficulty:
            node.difficulty || "",

        referenceLink:
            node.reference ||
            node.reference_link ||
            "",

        color:
            node.color || "#ffffff",

        shape:
            node.shape || "rect",

        position:
            node.position || {
                x: 100 + ((index % 4) * 320),
                y: 100 + (Math.floor(index / 4) * 220)
            },

        // done:
        //     savedProgress.includes(
        //         node.node_id
        //     )
        done:
    node.done === true ||
    savedProgress.includes(
        node.node_id
    )

    })),

    edges:
        roadmap.edges || []

};

console.log("Final Roadmap:", r);

// ======================
// HEADER
// ======================

const titleEl =
    document.getElementById("title");

if (titleEl) {
    titleEl.textContent = r.name;
}

const catEl =
    document.getElementById("cat");

if (catEl) {
    catEl.textContent =
        `${r.level}`;
}

const metaEl =
    document.getElementById("meta");

if (metaEl) {
    metaEl.textContent =
        `${tracker.completedSteps} Steps • ${tracker.status}`;
}

// ======================
// SAVE
// ======================

function saveProgress() {

    const completed =
        r.nodes
            .filter(n => n.done)
            .map(n => n.id);

    localStorage.setItem(
        `progress_${tracker.id}`,
        JSON.stringify(completed)
    );

    alert("Progress Saved");
}

window.saveProgress = saveProgress;

// ======================
// PROGRESS
// ======================


let progressData = {
    total: 0,
    completed: 0,
    remaining: 0,
    percentage: 0,
    status: ""
};

// function renderProgress() {

//     const total = r.nodes.length;
//     const status = tracker.status;
//     // How many steps are completed
//     const completed = Math.min(
//         Number(tracker.completedSteps) || 0,
//         total
//     );

//     const remaining = total - completed;

//     const percentage =
//         total > 0
//             ? Math.round((completed / total) * 100)
//             : 0;

//     console.log("CustomRoadmap Progress:", {
//         total,
//         completed,
//         remaining,
//         percentage,
//         status
//     });

//     // Percentage
//     const percentageElement =
//         document.getElementById("progressPercentage");

//     if (percentageElement) {
//         percentageElement.textContent =
//             percentage + "%";
//     }

//     // Completed count
//     const completedElement =
//         document.getElementById("completedCount");

//     if (completedElement) {
//         completedElement.textContent =
//             completed;
//     }

//     // Remaining count
//     const remainingElement =
//         document.getElementById("remainingCount");

//     if (remainingElement) {
//         remainingElement.textContent =
//             remaining;
//     }

//     // Total count
//     const totalElement =
//         document.getElementById("totalCount");

//     if (totalElement) {
//         totalElement.textContent =
//             total;
//     }

//     // Progress bar
//     const progressBar =
//         document.getElementById("progressBar");

//     if (progressBar) {
//         progressBar.style.width =
//             percentage + "%";
//     }
//     const statusElement =
//         document.getElementById("statusText");

//     if (statusElement) {
//         statusElement.textContent =
//             status;
//     }
// }
function renderProgress() {

    const total = r.nodes.length;

    const status = tracker.status;

    // How many steps are completed
    const completed = Math.min(
        Number(tracker.completedSteps) || 0,
        total
    );

    const remaining = total - completed;

    // const percentage =
    //     total > 0
    //         ? Math.round((completed / total) * 100)
    //         : 0;

    const pct =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    document.getElementById(
        "ringV"
    ).textContent =
        pct + "%";

    document.getElementById(
        "ring"
    ).style.background =
        `conic-gradient(
            var(--success) ${pct}%,
            rgba(255,255,255,.08) ${pct}%
        )`;
    // Store progress data for charts
    progressData = {
        total,
        completed,
        remaining,
        pct,
        status
    };

    console.log("CustomRoadmap Progress:", progressData);

    // Percentage
    const percentageElement =
        document.getElementById("progressPercentage");

    if (percentageElement) {
        percentageElement.textContent =
            pct + "%";
    }

    // Completed count
    const completedElement =
        document.getElementById("completedCount");

    if (completedElement) {
        completedElement.textContent =
            completed;
    }

    // Remaining count
    const remainingElement =
        document.getElementById("remainingCount");

    if (remainingElement) {
        remainingElement.textContent =
            remaining;
    }

    // Total count
    const totalElement =
        document.getElementById("totalCount");

    if (totalElement) {
        totalElement.textContent =
            total;
    }

    // Progress bar
    const progressBar =
        document.getElementById("progressBar");

    if (progressBar) {
        progressBar.style.width =
            pct + "%";
    }

    // Status
    const statusElement =
        document.getElementById("statusText");

    if (statusElement) {
        statusElement.textContent =
            status;
    }
}











// function renderCharts() {

//     // Get data directly from renderProgress()
//     const total = progressData.total;
//     const completed = progressData.completed;
//     const remaining = progressData.remaining;
//     const percentage = progressData.percentage;

//     // ==========================
//     // COMMON OPTIONS
//     // ==========================

//     Chart.defaults.color =
//         "#cbd5e1";

//     Chart.defaults.font.family =
//         "Inter, sans-serif";


//     // ==========================
//     // COMPLETION DISTRIBUTION
//     // ==========================

//     const completionCtx =
//         document.getElementById(
//             "completionChart"
//         );

//     if (completionCtx) {

//         if (
//             window.completionChartInstance
//         ) {
//             window
//                 .completionChartInstance
//                 .destroy();
//         }

//         window.completionChartInstance =
//             new Chart(
//                 completionCtx,
//                 {
//                     type: "doughnut",

//                     data: {
//                         labels: [
//                             "Completed",
//                             "Remaining"
//                         ],

//                         datasets: [
//                             {
//                                 data: [
//                                     completed,
//                                     remaining
//                                 ],

//                                 backgroundColor: [
//                                     "#22c55e",
//                                     "#334155"
//                                 ],

//                                 borderWidth: 0,

//                                 hoverOffset: 15
//                             }
//                         ]
//                     },

//                     options: {
//                         responsive: true,

//                         maintainAspectRatio: false,

//                         cutout: "78%",

//                         animation: {
//                             animateRotate: true,
//                             duration: 1200
//                         },

//                         plugins: {

//                             legend: {
//                                 position: "bottom",

//                                 labels: {
//                                     padding: 20
//                                 }
//                             },

//                             tooltip: {

//                                 callbacks: {

//                                     label:
//                                         function(context) {

//                                             const value =
//                                                 context.raw;

//                                             const pct =
//                                                 total > 0
//                                                     ? Math.round(
//                                                         (value / total) * 100
//                                                     )
//                                                     : 0;

//                                             return (
//                                                 context.label +
//                                                 ": " +
//                                                 value +
//                                                 " (" +
//                                                 pct +
//                                                 "%)"
//                                             );
//                                         }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             );
//     }


//     // ==========================
//     // EXPECTED VS ACTUAL
//     // ==========================

//     const expectedCtx =
//         document.getElementById(
//             "expectedChart"
//         );

//     if (expectedCtx) {

//         if (
//             window.expectedChartInstance
//         ) {
//             window
//                 .expectedChartInstance
//                 .destroy();
//         }

//         window.expectedChartInstance =
//             new Chart(
//                 expectedCtx,
//                 {
//                     type: "bar",

//                     data: {
//                         labels: [
//                             "Expected",
//                             "Completed"
//                         ],

//                         datasets: [
//                             {
//                                 data: [
//                                     total,
//                                     completed
//                                 ],

//                                 backgroundColor: [
//                                     "#3b82f6",
//                                     "#22c55e"
//                                 ],

//                                 borderRadius: 12,

//                                 borderSkipped: false
//                             }
//                         ]
//                     },

//                     options: {
//                         responsive: true,

//                         maintainAspectRatio: false,

//                         plugins: {

//                             legend: {
//                                 display: false
//                             }
//                         },

//                         scales: {

//                             x: {
//                                 grid: {
//                                     display: false
//                                 }
//                             },

//                             y: {
//                                 beginAtZero: true,

//                                 suggestedMax:
//                                     total,

//                                 ticks: {
//                                     precision: 0
//                                 }
//                             }
//                         }
//                     }
//                 }
//             );
//     }


//     // ==========================
//     // WEEKLY PROGRESS
//     // ==========================

//     const weeklyCtx =
//         document.getElementById(
//             "weeklyChart"
//         );

//     if (weeklyCtx) {

//         if (
//             window.weeklyChartInstance
//         ) {
//             window
//                 .weeklyChartInstance
//                 .destroy();
//         }

//         const history =
//             JSON.parse(
//                 localStorage.getItem(
//                     `history_${tracker.id}`
//                 )
//             ) || {};

//         const weeklyData = {};

//         Object.values(history)
//             .forEach(date => {

//                 const d =
//                     new Date(date);

//                 const weekNumber =
//                     Math.ceil(
//                         d.getDate() / 7
//                     );

//                 const weekLabel =
//                     `Week ${weekNumber}`;

//                 weeklyData[weekLabel] =
//                     (
//                         weeklyData[weekLabel] ||
//                         0
//                     ) + 1;
//             });

//         const labels =
//             Object.keys(
//                 weeklyData
//             );

//         const values =
//             Object.values(
//                 weeklyData
//             );

//         window.weeklyChartInstance =
//             new Chart(
//                 weeklyCtx,
//                 {
//                     type: "line",

//                     data: {
//                         labels,

//                         datasets: [
//                             {
//                                 label:
//                                     "Steps Completed",

//                                 data:
//                                     values,

//                                 borderColor:
//                                     "#22c55e",

//                                 backgroundColor:
//                                     "rgba(34,197,94,.15)",

//                                 fill: true,

//                                 tension: 0.4,

//                                 pointRadius: 5,

//                                 pointHoverRadius: 8
//                             }
//                         ]
//                     },

//                     options: {

//                         responsive: true,

//                         maintainAspectRatio: false,

//                         plugins: {

//                             legend: {
//                                 position: "top"
//                             }
//                         },

//                         scales: {

//                             x: {

//                                 title: {
//                                     display: true,
//                                     text: "Weeks"
//                                 },

//                                 grid: {
//                                     display: false
//                                 }
//                             },

//                             y: {

//                                 beginAtZero: true,

//                                 title: {
//                                     display: true,
//                                     text:
//                                         "Steps Completed"
//                                 },

//                                 ticks: {
//                                     precision: 0,
//                                     stepSize: 1
//                                 }
//                             }
//                         }
//                     }
//                 }
//             );
//     }
// }

// ======================
// CHECKLIST
// ======================
// function renderCharts() {

//     // =====================================================
//     // GET DATA FROM renderProgress()
//     // =====================================================

//     const total =
//         progressData.total;

//     const completed =
//         progressData.completed;

//     const remaining =
//         progressData.remaining;

//     const percentage =
//         progressData.percentage;


//     // =====================================================
//     // COMMON CHART SETTINGS
//     // =====================================================

//     Chart.defaults.color =
//         "#cbd5e1";

//     Chart.defaults.font.family =
//         "Inter, sans-serif";


//     // =====================================================
//     // 1. OVERALL PROGRESS
//     // ADVANCED DOUGHNUT
//     // =====================================================

//     const completionCtx =
//         document.getElementById(
//             "completionChart"
//         );

//     if (completionCtx) {

//         if (
//             window.completionChartInstance
//         ) {
//             window
//                 .completionChartInstance
//                 .destroy();
//         }


//         // Center text plugin
//         const centerTextPlugin = {

//             id: "centerText",

//             beforeDraw(chart) {

//                 const {
//                     ctx
//                 } = chart;

//                 const meta =
//                     chart.getDatasetMeta(0);

//                 if (!meta.data.length) {
//                     return;
//                 }

//                 const x =
//                     meta.data[0].x;

//                 const y =
//                     meta.data[0].y;

//                 ctx.save();

//                 ctx.textAlign =
//                     "center";

//                 ctx.textBaseline =
//                     "middle";


//                 // Percentage
//                 ctx.font =
//                     "bold 30px Inter";

//                 ctx.fillStyle =
//                     "#ffffff";

//                 ctx.fillText(
//                     percentage + "%",
//                     x,
//                     y - 8
//                 );


//                 // Label
//                 ctx.font =
//                     "500 12px Inter";

//                 ctx.fillStyle =
//                     "#94a3b8";

//                 ctx.fillText(
//                     "Completed",
//                     x,
//                     y + 18
//                 );

//                 ctx.restore();
//             }
//         };


//         window.completionChartInstance =
//             new Chart(
//                 completionCtx,
//                 {

//                     type: "doughnut",

//                     plugins: [
//                         centerTextPlugin
//                     ],

//                     data: {

//                         labels: [
//                             "Completed",
//                             "Remaining"
//                         ],

//                         datasets: [

//                             {
//                                 data: [
//                                     completed,
//                                     remaining
//                                 ],

//                                 backgroundColor: [
//                                     "#22c55e",
//                                     "#1e293b"
//                                 ],

//                                 borderWidth: 0,

//                                 hoverOffset: 10,

//                                 spacing: 4
//                             }
//                         ]
//                     },

//                     options: {

//                         responsive: true,

//                         maintainAspectRatio: false,

//                         cutout: "78%",

//                         animation: {

//                             animateRotate: true,

//                             duration: 1500,

//                             easing:
//                                 "easeOutQuart"
//                         },

//                         plugins: {

//                             legend: {

//                                 position:
//                                     "bottom",

//                                 labels: {

//                                     padding: 20,

//                                     usePointStyle:
//                                         true,

//                                     pointStyle:
//                                         "circle"
//                                 }
//                             },

//                             tooltip: {

//                                 backgroundColor:
//                                     "#0f172a",

//                                 padding: 12,

//                                 cornerRadius: 10,

//                                 callbacks: {

//                                     label:
//                                         function(
//                                             context
//                                         ) {

//                                             const value =
//                                                 context.raw;

//                                             const percent =
//                                                 total > 0
//                                                     ? Math.round(
//                                                         (value / total) * 100
//                                                     )
//                                                     : 0;

//                                             return (
//                                                 " " +
//                                                 context.label +
//                                                 ": " +
//                                                 value +
//                                                 " (" +
//                                                 percent +
//                                                 "%)"
//                                             );
//                                         }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             );
//     }


//     // =====================================================
//     // 2. PROGRESS ANALYSIS
//     // RADAR CHART
//     // =====================================================

//     const expectedCtx =
//         document.getElementById(
//             "expectedChart"
//         );

//     if (expectedCtx) {

//         if (
//             window.expectedChartInstance
//         ) {
//             window
//                 .expectedChartInstance
//                 .destroy();
//         }


//         window.expectedChartInstance =
//             new Chart(
//                 expectedCtx,
//                 {

//                     type: "radar",

//                     data: {

//                         labels: [
//                             "Total Steps",
//                             "Completed",
//                             "Remaining",
//                             "Progress"
//                         ],

//                         datasets: [

//                             {
//                                 label:
//                                     "Roadmap Progress",

//                                 data: [

//                                     total,

//                                     completed,

//                                     remaining,

//                                     percentage
//                                 ],

//                                 backgroundColor:
//                                     "rgba(59,130,246,0.18)",

//                                 borderColor:
//                                     "#3b82f6",

//                                 borderWidth: 2,

//                                 pointBackgroundColor:
//                                     "#3b82f6",

//                                 pointBorderColor:
//                                     "#ffffff",

//                                 pointBorderWidth:
//                                     2,

//                                 pointRadius:
//                                     5,

//                                 pointHoverRadius:
//                                     8
//                             }
//                         ]
//                     },

//                     options: {

//                         responsive: true,

//                         maintainAspectRatio: false,

//                         plugins: {

//                             legend: {

//                                 position:
//                                     "bottom",

//                                 labels: {

//                                     usePointStyle:
//                                         true,

//                                     padding: 20
//                                 }
//                             },

//                             tooltip: {

//                                 backgroundColor:
//                                     "#0f172a",

//                                 padding: 12,

//                                 cornerRadius: 10
//                             }
//                         },

//                         scales: {

//                             r: {

//                                 beginAtZero:
//                                     true,

//                                 angleLines: {

//                                     color:
//                                         "rgba(148,163,184,0.15)"
//                                 },

//                                 grid: {

//                                     color:
//                                         "rgba(148,163,184,0.15)"
//                                 },

//                                 pointLabels: {

//                                     color:
//                                         "#cbd5e1",

//                                     font: {

//                                         size: 12,

//                                         weight:
//                                             "500"
//                                     }
//                                 },

//                                 ticks: {

//                                     display:
//                                         false
//                                 }
//                             }
//                         }
//                     }
//                 }
//             );
//     }


//     // =====================================================
//     // 3. PROGRESS METER
//     // ADVANCED HORIZONTAL BAR
//     // =====================================================

//     const weeklyCtx =
//         document.getElementById(
//             "weeklyChart"
//         );

//     if (weeklyCtx) {

//         if (
//             window.weeklyChartInstance
//         ) {
//             window
//                 .weeklyChartInstance
//                 .destroy();
//         }


//         window.weeklyChartInstance =
//             new Chart(
//                 weeklyCtx,
//                 {

//                     type: "bar",

//                     data: {

//                         labels: [
//                             "Completed",
//                             "Remaining"
//                         ],

//                         datasets: [

//                             {
//                                 data: [
//                                     completed,
//                                     remaining
//                                 ],

//                                 backgroundColor: [

//                                     "#22c55e",

//                                     "#334155"
//                                 ],

//                                 borderRadius:
//                                     12,

//                                 borderSkipped:
//                                     false,

//                                 barThickness:
//                                     45
//                             }
//                         ]
//                     },

//                     options: {

//                         indexAxis:
//                             "y",

//                         responsive:
//                             true,

//                         maintainAspectRatio:
//                             false,

//                         animation: {

//                             duration:
//                                 1200,

//                             easing:
//                                 "easeOutQuart"
//                         },

//                         plugins: {

//                             legend: {

//                                 display:
//                                     false
//                             },

//                             tooltip: {

//                                 backgroundColor:
//                                     "#0f172a",

//                                 padding:
//                                     12,

//                                 cornerRadius:
//                                     10,

//                                 callbacks: {

//                                     label:
//                                         function(
//                                             context
//                                         ) {

//                                             const value =
//                                                 context.raw;

//                                             const percent =
//                                                 total > 0
//                                                     ? Math.round(
//                                                         (value / total) * 100
//                                                     )
//                                                     : 0;

//                                             return (
//                                                 " " +
//                                                 value +
//                                                 " steps (" +
//                                                 percent +
//                                                 "%)"
//                                             );
//                                         }
//                                 }
//                             }
//                         },

//                         scales: {

//                             x: {

//                                 beginAtZero:
//                                     true,

//                                 max:
//                                     total,

//                                 grid: {

//                                     color:
//                                         "rgba(148,163,184,0.1)"
//                                 },

//                                 ticks: {

//                                     precision:
//                                         0,

//                                     color:
//                                         "#94a3b8"
//                                 }
//                             },

//                             y: {

//                                 grid: {

//                                     display:
//                                         false
//                                 },

//                                 ticks: {

//                                     color:
//                                         "#cbd5e1",

//                                     font: {

//                                         weight:
//                                             "500"
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             );
//     }
// }

function renderCharts() {

    // =====================================================
    // GET DATA FROM renderProgress()
    // =====================================================

    const total =
        progressData.total;

    const completed =
        progressData.completed;

    const remaining =
        progressData.remaining;

    const percentage =
        progressData.percentage;


    // =====================================================
    // COMMON OPTIONS
    // =====================================================

    Chart.defaults.color =
        "#cbd5e1";

    Chart.defaults.font.family =
        "Inter, sans-serif";


    // =====================================================
    // 1. COMPLETION RING CHART
    // =====================================================

    const completionCtx =
        document.getElementById(
            "completionChart"
        );

    if (completionCtx) {

        if (
            window.completionChartInstance
        ) {
            window
                .completionChartInstance
                .destroy();
        }

        window.completionChartInstance =
            new Chart(
                completionCtx,
                {
                    type: "doughnut",

                    data: {

                        labels: [
                            "Completed",
                            "Remaining"
                        ],

                        datasets: [
                            {
                                data: [
                                    completed,
                                    remaining
                                ],

                                backgroundColor: [
                                    "#22c55e",
                                    "#334155"
                                ],

                                borderWidth: 0,

                                hoverOffset: 15
                            }
                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        cutout: "78%",

                        animation: {
                            animateRotate: true,
                            duration: 1200
                        },

                        plugins: {

                            legend: {

                                position:
                                    "bottom",

                                labels: {
                                    padding: 20
                                }
                            },

                            tooltip: {

                                callbacks: {

                                    label:
                                        function(context) {

                                            const value =
                                                context.raw;

                                            const pct =
                                                total > 0
                                                    ? Math.round(
                                                        (value / total) * 100
                                                    )
                                                    : 0;

                                            return (
                                                context.label +
                                                ": " +
                                                value +
                                                " (" +
                                                pct +
                                                "%)"
                                            );
                                        }
                                }
                            }
                        }
                    }
                }
            );
    }


    // =====================================================
    // 2. EXPECTED VS REALITY
    // KEEPING YOUR OLD BAR CHART
    // =====================================================

    const expectedCtx =
        document.getElementById(
            "expectedChart"
        );

    if (expectedCtx) {

        if (
            window.expectedChartInstance
        ) {
            window
                .expectedChartInstance
                .destroy();
        }

        window.expectedChartInstance =
            new Chart(
                expectedCtx,
                {
                    type: "bar",

                    data: {

                        labels: [
                            "Expected",
                            "Completed"
                        ],

                        datasets: [
                            {
                                data: [
                                    total,
                                    completed
                                ],

                                backgroundColor: [
                                    "#3b82f6",
                                    "#22c55e"
                                ],

                                borderRadius: 12,

                                borderSkipped: false
                            }
                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                display: false
                            }
                        },

                        scales: {

                            x: {

                                grid: {
                                    display: false
                                }
                            },

                            y: {

                                beginAtZero: true,

                                suggestedMax:
                                    total,

                                ticks: {
                                    precision: 0
                                }
                            }
                        }
                    }
                }
            );
    }


    // =====================================================
    // 3. RADAR CHART
    // REPLACES WEEKLY LINE CHART
    // =====================================================

    const weeklyCtx =
        document.getElementById(
            "weeklyChart"
        );

    if (weeklyCtx) {

        if (
            window.weeklyChartInstance
        ) {
            window
                .weeklyChartInstance
                .destroy();
        }

        window.weeklyChartInstance =
            new Chart(
                weeklyCtx,
                {
                    type: "radar",

                    data: {

                        labels: [
                            "Total",
                            "Completed",
                            "Remaining",
                            "Progress"
                        ],

                        datasets: [

                            {
                                label:
                                    "Roadmap Progress",

                                data: [
                                    total,
                                    completed,
                                    remaining,
                                    percentage
                                ],

                                backgroundColor:
                                    "rgba(59, 130, 246, 0.18)",

                                borderColor:
                                    "#3b82f6",

                                borderWidth: 2,

                                pointBackgroundColor:
                                    "#3b82f6",

                                pointBorderColor:
                                    "#ffffff",

                                pointBorderWidth: 2,

                                pointRadius: 5,

                                pointHoverRadius: 8
                            }

                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        animation: {

                            duration: 1200,

                            easing:
                                "easeOutQuart"
                        },

                        plugins: {

                            legend: {

                                position:
                                    "bottom",

                                labels: {

                                    padding: 20,

                                    usePointStyle:
                                        true
                                }
                            },

                            tooltip: {

                                backgroundColor:
                                    "#0f172a",

                                padding: 12,

                                cornerRadius: 10
                            }
                        },

                        scales: {

                            r: {

                                beginAtZero:
                                    true,

                                grid: {

                                    color:
                                        "rgba(148, 163, 184, 0.15)"
                                },

                                angleLines: {

                                    color:
                                        "rgba(148, 163, 184, 0.15)"
                                },

                                pointLabels: {

                                    color:
                                        "#cbd5e1",

                                    font: {

                                        size: 12,

                                        weight:
                                            "500"
                                    }
                                },

                                ticks: {

                                    display:
                                        false
                                }
                            }
                        }
                    }
                }
            );
    }
}
function renderChecklist() {

    const checklist =
        document.getElementById("checklist");

    if (!checklist) return;

    const total =
        r.nodes.length;

    // Number of completed steps
    const completedCount =
        Math.min(
            Number(tracker.completedSteps) || 0,
            total
        );

    console.log(
        "CustomRoadmap Checklist:",
        completedCount,
        "/",
        total
    );

    checklist.innerHTML =
        r.nodes.map((node, index) => {

            // First N steps are completed
            const isCompleted =
                index < completedCount;

            // Keep r.nodes in sync
            node.done = isCompleted;

            return `
                <div
                    class="check-item ${isCompleted ? "done" : ""}"
                    data-id="${node.id}"
                >

                    <div class="check-box">
                        ${isCompleted ? "✓" : ""}
                    </div>

                    <div class="check-content">

                        <div class="check-title">
                            ${node.title}
                        </div>

                        <div class="check-description">
                            ${node.description || ""}
                        </div>

                    </div>

                </div>
            `;

        }).join("");

    /*
     * IMPORTANT:
     * For CustomRoadmap we are displaying the
     * first completedCount steps as completed.
     */

    document
        .querySelectorAll(".check-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const id =
                        item.dataset.id;

                    const index =
                        r.nodes.findIndex(
                            node =>
                                String(node.id) ===
                                String(id)
                        );

                    if (index === -1) return;

                    /*
                     * Clicking a step changes the
                     * completed count.
                     */

                    const currentlyCompleted =
                        index < tracker.completedSteps;

                    if (currentlyCompleted) {

                        // Unchecking this step
                        // means this step and everything
                        // after it become incomplete.

                        tracker.completedSteps =
                            index;

                    } else {

                        // Checking this step
                        // completes this step and
                        // all previous steps.

                        tracker.completedSteps =
                            index + 1;
                    }

                    tracker.remainingSteps =
                        r.nodes.length -
                        tracker.completedSteps;

                    tracker.completedpercentage =
                        r.nodes.length > 0
                            ? Math.round(
                                (
                                    tracker.completedSteps /
                                    r.nodes.length
                                ) * 100
                            )
                            : 0;

                    tracker.status =
                        tracker.completedSteps === 0
                            ? "NOT_STARTED"
                            : tracker.completedSteps === r.nodes.length
                                ? "COMPLETED"
                                : "IN_PROGRESS";

                    // Update node.done
                    r.nodes.forEach(
                        (node, i) => {
                            node.done =
                                i <
                                tracker.completedSteps;
                        }
                    );

                    localStorage.setItem(
                        "selected_tracker",
                        JSON.stringify(tracker)
                    );

                    renderAll();
                }
            );
        });
}


function getGeneratedRoadmap() {

    const parsed =
        JSON.parse(tracker.jsonData);

    const roadmapObj =
        typeof parsed === "string"
            ? JSON.parse(parsed)
            : parsed;

    const level =
        Object.keys(roadmapObj)[0];

    return roadmapObj[level];
}




function getCustomRoadmapData() {

    console.log("Tracker Data:", tracker);

    let roadmap = tracker.jsonData;

    while (typeof roadmap === "string") {
        try {
            roadmap = JSON.parse(roadmap);
        } catch (error) {
            console.error("Failed to parse CustomRoadmap jsonData:", error);
            return null;
        }
    }

    console.log("Custom Roadmap Data:", roadmap);

    return roadmap;
}





function getCustomTrackerData() {

    try {

        return JSON.parse(
            tracker.jsonData
        );

    } catch (e) {

        console.error(
            "Custom Tracker Parse Error",
            e
        );

        return {
            steps: []
        };
    }
}
function renderCustomTrackerProgress() {

    const data =
        getCustomTrackerData();

    const steps =
        data.steps || [];

    const total =
        tracker.totalSteps || steps.length  ;

    const completed =
        tracker.completedSteps;

    const remaining =
        total - completed;

    const pct =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    document.getElementById(
        "ringV"
    ).textContent =
        pct + "%";

    document.getElementById(
        "ring"
    ).style.background =
        `conic-gradient(
            var(--success) ${pct}%,
            rgba(255,255,255,.08) ${pct}%
        )`;

    document.getElementById(
        "completedCount"
    ).textContent =
        completed;

    document.getElementById(
        "remainingCount"
    ).textContent =
        remaining;

    document.getElementById(
        "totalCount"
    ).textContent =
        total;

    let status =
        "NOT_STARTED";

    if (completed > 0)
        status =
            "IN_PROGRESS";

    if (
        completed === total &&
        total > 0
    )
        status =
            "COMPLETED";

    document.getElementById(
        "statusText"
    ).textContent =
        status;

    document.getElementById(
        "stats"
    ).innerHTML =
        `
        <div>
            <div style="
                font-size:24px;
                font-weight:800;
            ">
                ${completed}
            </div>
            <div>Completed</div>
        </div>

        <div>
            <div style="
                font-size:24px;
                font-weight:800;
            ">
                ${remaining}
            </div>
            <div>Remaining</div>
        </div>

        <div>
            <div style="
                font-size:24px;
                font-weight:800;
            ">
                ${total}
            </div>
            <div>Total</div>
        </div>
    `;
}


function renderCustomTrackerChecklist() {

    const checklist =
        document.getElementById("checklist");

    if (!checklist) return;

    const data =
        getCustomTrackerData();

    const steps =
        data.steps || [];

    // ==========================
    // RESTORE COMPLETED STEPS
    // ==========================

    const completedCount =
        Number(tracker.completedSteps || 0);

    steps.forEach((step, index) => {

        if (!step.substeps) {
            step.substeps = [];
        }

        if (index < completedCount) {

            step.done = true;

            step.substeps.forEach(sub => {
                sub.done = true;
            });

        } else {

            if (step.done === undefined) {
                step.done = false;
            }

            step.substeps.forEach(sub => {

                if (sub.done === undefined) {
                    sub.done = false;
                }

            });
        }

    });

    // ==========================
    // RENDER
    // ==========================

    checklist.innerHTML =
        steps.map((step, index) => {

            const allSubstepsDone =
                step.substeps.length === 0
                    ? step.done
                    : step.substeps.every(
                          s => s.done
                      );

            return `
            <div
                class="check-item ${allSubstepsDone ? "done" : ""}"
                data-step-index="${index}"
            >

                <div style="
                    display:flex;
                    align-items:flex-start;
                    gap:12px;
                ">

                    <div
                        class="check-box main-step-box ${allSubstepsDone ? "checked" : ""}"
                        data-main-step="${index}"
                        style="
                            cursor:pointer;
                            background:${allSubstepsDone ? "#22c55e" : ""};
                            color:white;
                        "
                    >
                        ${allSubstepsDone ? "✓" : ""}
                    </div>

                    <div style="flex:1;">

                        <div class="check-title">
                            ${step.step_no}.
                            ${step.step_name}
                        </div>

                        <div class="check-desc">
                            Difficulty:
                            ${step.difficulty || "N/A"}
                        </div>

                        ${
                            step.substeps.length > 0
                                ? `
                                <div style="
                                    margin-left:25px;
                                    margin-top:10px;
                                ">
                                    ${step.substeps.map(sub => `
                                        <label style="
                                            display:flex;
                                            align-items:center;
                                            gap:8px;
                                            margin-bottom:8px;
                                            cursor:pointer;
                                        ">

                                            <input
                                                type="checkbox"
                                                class="substep-checkbox"
                                                data-step-index="${index}"
                                                data-substep-id="${sub.substep_id}"
                                                ${sub.done ? "checked" : ""}
                                            >

                                            ${sub.substep_name}

                                        </label>
                                    `).join("")}
                                </div>
                                `
                                : ""
                        }

                    </div>

                </div>

            </div>
            `;

        }).join("");

    // ==========================
    // MAIN STEP CLICK
    // ONLY FOR STEPS WITH NO SUBSTEPS
    // ==========================

    document
        .querySelectorAll(".main-step-box")
        .forEach(box => {

            box.addEventListener("click", () => {

                const stepIndex =
                    Number(
                        box.dataset.mainStep
                    );

                const step =
                    steps[stepIndex];

                if (!step) return;

                if (
                    step.substeps &&
                    step.substeps.length > 0
                ) {
                    return;
                }

                if (!step.done) {

                    const previousIncomplete =
                        steps
                            .slice(0, stepIndex)
                            .some(s => !s.done);

                    if (previousIncomplete) {

                        alert(
                            "Complete previous steps first"
                        );

                        return;
                    }
                }

                step.done =
                    !step.done;

                if (!step.done) {

                    for (
                        let i = stepIndex + 1;
                        i < steps.length;
                        i++
                    ) {

                        steps[i].done = false;

                        (steps[i].substeps || [])
                            .forEach(sub => {
                                sub.done = false;
                            });
                    }
                }

                updateTrackerState();
            });

        });

    // ==========================
    // SUBSTEP CLICK
    // ==========================

    document
        .querySelectorAll(
            ".substep-checkbox"
        )
        .forEach(box => {

            box.addEventListener(
                "change",
                () => {

                    const stepIndex =
                        Number(
                            box.dataset.stepIndex
                        );

                    const step =
                        steps[stepIndex];

                    if (!step) return;

                    if (box.checked) {

                        const previousIncomplete =
                            steps
                                .slice(
                                    0,
                                    stepIndex
                                )
                                .some(
                                    s => !s.done
                                );

                        if (
                            previousIncomplete
                        ) {

                            alert(
                                "Complete previous steps first"
                            );

                            box.checked = false;

                            return;
                        }
                    }

                    const substep =
                        step.substeps.find(
                            s =>
                                String(
                                    s.substep_id
                                ) ===
                                String(
                                    box.dataset
                                        .substepId
                                )
                        );

                    if (!substep) return;

                    substep.done =
                        box.checked;

                    step.done =
                        step.substeps.every(
                            s => s.done
                        );

                    if (!step.done) {

                        for (
                            let i =
                                stepIndex + 1;
                            i <
                            steps.length;
                            i++
                        ) {

                            steps[i].done =
                                false;

                            (
                                steps[i]
                                    .substeps ||
                                []
                            ).forEach(
                                sub => {
                                    sub.done =
                                        false;
                                }
                            );
                        }
                    }

                    updateTrackerState();
                }
            );

        });

    // ==========================
    // UPDATE TRACKER
    // ==========================

    function updateTrackerState() {

        tracker.completedSteps =
            steps.filter(
                s => s.done
            ).length;

        tracker.remainingSteps =
            steps.length -
            tracker.completedSteps;

        tracker.completedpercentage =
            steps.length
                ? Math.round(
                      (
                          tracker.completedSteps /
                          steps.length
                      ) * 100
                  )
                : 0;

        tracker.status =
            tracker.completedSteps === 0
                ? "NOT_STARTED"
                : tracker.completedSteps ===
                  steps.length
                ? "COMPLETED"
                : "IN_PROGRESS";

        tracker.jsonData =
            JSON.stringify(data);

        localStorage.setItem(
            "selected_tracker",
            JSON.stringify(tracker)
        );

        renderCustomTrackerChecklist();
renderCustomTrackerProgress();
renderCustomTrackerCharts();
    }
} 



// function renderCustomTrackerCharts() {

//     const data =
//         getCustomTrackerData();

//     const steps =
//         data.steps || [];

//     const total =
//         steps.length;

//     const completed =
//         steps.filter(
//             s => s.done
//         ).length;

//     const remaining =
//         total - completed;

//     const percentage =
//         total
//             ? Math.round(
//                 (
//                     completed /
//                     total
//                 ) * 100
//             )
//             : 0;

//     Chart.defaults.color =
//         "#cbd5e1";

//     Chart.defaults.font.family =
//         "Inter, sans-serif";

//     const completionCtx =
//         document.getElementById(
//             "completionChart"
//         );

//     if (completionCtx) {

//         window
//             .completionChartInstance
//             ?.destroy();

//         window
//             .completionChartInstance =
//             new Chart(
//                 completionCtx,
//                 {
//                     type:
//                         "doughnut",

//                     data: {

//                         labels: [
//                             "Completed",
//                             "Remaining"
//                         ],

//                         datasets: [
//                             {
//                                 data: [
//                                     completed,
//                                     remaining
//                                 ],

//                                 backgroundColor: [
//                                     "#22c55e",
//                                     "#334155"
//                                 ]
//                             }
//                         ]
//                     }
//                 }
//             );
//     }

//     const expectedCtx =
//         document.getElementById(
//             "expectedChart"
//         );

//     if (expectedCtx) {

//         window
//             .expectedChartInstance
//             ?.destroy();

//         new Chart(
//             expectedCtx,
//             {
//                 type: "bar",

//                 data: {

//                     labels: [
//                         "Expected",
//                         "Completed"
//                     ],

//                     datasets: [
//                         {
//                             data: [
//                                 total,
//                                 completed
//                             ],

//                             backgroundColor: [
//                                 "#3b82f6",
//                                 "#22c55e"
//                             ]
//                         }
//                     ]
//                 }
//             }
//         );
//     }

//     const weeklyCtx =
//         document.getElementById(
//             "weeklyChart"
//         );

//     if (weeklyCtx) {

//         window
//             .weeklyChartInstance
//             ?.destroy();

//         new Chart(
//             weeklyCtx,
//             {
//                 type: "bar",

//                 data: {

//                     labels: [
//                         "Progress"
//                     ],

//                     datasets: [
//                         {
//                             label:
//                                 "Completion %",

//                             data: [
//                                 percentage
//                             ],

//                             backgroundColor:
//                                 "#22c55e"
//                         }
//                     ]
//                 },

//                 options: {

//                     scales: {

//                         y: {
//                             max: 100,
//                             beginAtZero:
//                                 true
//                         }
//                     }
//                 }
//             }
//         );
//     }
// }


function renderCustomTrackerCharts() {

    const data = getCustomTrackerData();
    const steps = data.steps || [];

    const total =
        Number(tracker.totalSteps) ||
        steps.length;

    const completed =
        Number(tracker.completedSteps) ||
        steps.filter(
            step => step.done
        ).length;

    const remaining =
        Math.max(0, total - completed);

    const percentage =
        total > 0
            ? Math.round(
                (completed / total) * 100
            )
            : 0;

    Chart.defaults.color =
        "#cbd5e1";

    Chart.defaults.font.family =
        "Inter, sans-serif";

    // ==========================
    // COMPLETION DISTRIBUTION
    // ==========================

    const completionCanvas =
        document.getElementById(
            "completionChart"
        );

    if (completionCanvas) {

        Chart.getChart(
            completionCanvas
        )?.destroy();

        window.completionChartInstance =
            new Chart(
                completionCanvas,
                {
                    type: "doughnut",

                    data: {
                        labels: [
                            "Completed",
                            "Remaining"
                        ],

                        datasets: [
                            {
                                data: [
                                    completed,
                                    remaining
                                ],

                                backgroundColor: [
                                    "#22c55e",
                                    "#334155"
                                ],

                                borderWidth: 0
                            }
                        ]
                    },

                    options: {
                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {
                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                }
            );
    }

    // ==========================
    // EXPECTED VS ACTUAL
    // ==========================

    const expectedCanvas =
        document.getElementById(
            "expectedChart"
        );

    if (expectedCanvas) {

        Chart.getChart(
            expectedCanvas
        )?.destroy();

        window.expectedChartInstance =
            new Chart(
                expectedCanvas,
                {
                    type: "bar",

                    data: {
                        labels: [
                            "Expected",
                            "Actual"
                        ],

                        datasets: [
                            {
                                data: [
                                    total,
                                    completed
                                ],

                                backgroundColor: [
                                    "#3b82f6",
                                    "#22c55e"
                                ],

                                borderRadius: 10
                            }
                        ]
                    },

                    options: {
                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {
                            legend: {
                                display: false
                            }
                        },

                        scales: {
                            y: {
                                beginAtZero: true,
                                max: total,

                                ticks: {
                                    stepSize: 1
                                }
                            }
                        }
                    }
                }
            );
    }

    // ==========================
    // WEEKLY PROGRESS LINE CHART
    // ==========================

    const weeklyCanvas =
        document.getElementById(
            "weeklyChart"
        );

    if (weeklyCanvas) {

        Chart.getChart(
            weeklyCanvas
        )?.destroy();

        let history =
            tracker.progressHistory || [];

        // First open
        if (!Array.isArray(history)) {
            history = [];
        }

        // Save current progress if changed
        if (
            history.length === 0 ||
            history[history.length - 1] !== completed
        ) {
            history.push(completed);
        }

        tracker.progressHistory =
            history;

        localStorage.setItem(
            "selected_tracker",
            JSON.stringify(tracker)
        );

        const labels =
            history.map(
                (_, index) =>
                    `Freq ${index + 1}`
            );

        window.weeklyChartInstance =
            new Chart(
                weeklyCanvas,
                {
                    type: "line",

                    data: {
                        labels,

                        datasets: [
                            {
                                label:
                                    "Completed Steps",

                                data: history,

                                borderColor:
                                    "#2a22c5",

                                backgroundColor:
                                    "#4322c5",

                                pointBackgroundColor:
                                    "#3d22c5",

                                pointBorderColor:
                                    "#ffffff",

                                pointRadius: 7,

                                pointHoverRadius: 9,

                                pointBorderWidth: 2,

                                borderWidth: 3,

                                tension: 0.3,

                                fill: false
                            }
                        ]
                    },

                    options: {
                        responsive: true,
                        maintainAspectRatio:
                            false,

                        plugins: {
                            legend: {
                                display: false
                            }
                        },

                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: "Frequency"
                                }
                            },

                            y: {
                                beginAtZero: true,
                                max: total,

                                ticks: {
                                    stepSize: 1
                                },

                                title: {
                                    display: true,

                                    text:
                                        "Completed Steps"
                                }
                            }
                        }
                    }
                }
            );
    }

// ==========================
// RADAR CHART
// ==========================
const cardss =
        document.getElementById(
            "card"
        );
        cardss.style.display = "flex";
        // cards.style.backgroundColor = "red";
        cardss.style.width = "100%";
        cardss.style.height = "500px";
const radarCanvas =
    document.getElementById(
        "radarChart"
    );

if (radarCanvas) {

    Chart.getChart(
        radarCanvas
    )?.destroy();

    window.radarChartInstance =
        new Chart(
            radarCanvas,
            {
                type: "radar",

                data: {

                    labels: [
                        "Total",
                        "Completed",
                        "Remaining",
                        "Progress %"
                    ],

                    datasets: [
                        {
                            label:
                                "Roadmap Analysis",

                            data: [
                                total,
                                completed,
                                remaining,
                                percentage
                            ],

                            backgroundColor:
                                "rgba(59,130,246,0.2)",

                            borderColor:
                                "#3b82f6",

                            borderWidth: 3,

                            pointBackgroundColor:
                                "#22c55e",

                            pointBorderColor:
                                "#ffffff",

                            pointBorderWidth: 2,

                            pointRadius: 6,

                            pointHoverRadius: 9
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position:
                                "bottom"
                        }
                    },

                    scales: {

                        r: {

                            beginAtZero:
                                true,

                            grid: {

                                color:
                                    "rgba(148,163,184,0.15)"
                            },

                            angleLines: {

                                color:
                                    "rgba(148,163,184,0.15)"
                            },

                            pointLabels: {

                                color:
                                    "#cbd5e1"
                            },

                            ticks: {

                                display:
                                    false
                            }
                        }
                    }
                }
            }
        );
}


// ==========================
// POLAR AREA CHART
// ==========================

const cards =
        document.getElementById(
            "card1"
        );
        cards.style.display = "flex";
        // cards.style.backgroundColor = "red";
        cards.style.width = "100%";
        cards.style.height = "500px";

const polarCanvas =
    document.getElementById(
        "polarChart"
    );

if (polarCanvas) {

    Chart.getChart(
        polarCanvas
    )?.destroy();

    window.polarChartInstance =
        new Chart(
            polarCanvas,
            {
                type: "polarArea",

                data: {

                    labels: [
                        "Completed",
                        "Remaining",
                        "Progress %",
                        "Total Steps"
                    ],

                    datasets: [
                        {
                            data: [
                                completed,
                                remaining,
                                percentage,
                                total
                            ],

                            backgroundColor: [
                                "rgba(34,197,94,0.8)",
                                "rgba(239,68,68,0.8)",
                                "rgba(59,130,246,0.8)",
                                "rgba(168,85,247,0.8)"
                            ],

                            borderWidth: 2,

                            borderColor:
                                "#0f172a"
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                usePointStyle:
                                    true,

                                padding: 20
                            }
                        }
                    },

                    scales: {

                        r: {

                            beginAtZero:
                                true,

                            grid: {

                                color:
                                    "rgba(148,163,184,0.15)"
                            },

                            ticks: {

                                backdropColor:
                                    "transparent"
                            }
                        }
                    }
                }
            }
        );
}


    // ==========================
    // UPDATE TRACKER STATS
    // ==========================

    tracker.completedSteps =
        completed;

    tracker.remainingSteps =
        remaining;

    tracker.completedpercentage =
        percentage;

    tracker.totalSteps =
        total;
}

// function renderGeneratedCharts() {

//     const roadmapJson =
//         JSON.parse(
//             JSON.parse(tracker.jsonData)
//         );

//     const roadmap =
//         roadmapJson.beginner ||
//         roadmapJson.intermediate ||
//         roadmapJson.advanced;

//     const total =
//         Number(tracker.totalSteps || 0);

//     const completed =
//         Number(tracker.completedSteps || 0);

//     const remaining =
//         Math.max(0, total - completed);

//     const percentage =
//         Number(
//             tracker.completedpercentage || 0
//         );

//     Chart.defaults.color =
//         "#cbd5e1";

//     Chart.defaults.font.family =
//         "Inter, sans-serif";

//     // ==========================
//     // COMPLETION DISTRIBUTION
//     // ==========================

//     const completionCtx =
//         document.getElementById(
//             "completionChart"
//         );

//     if (completionCtx) {

//         Chart.getChart(
//             completionCtx
//         )?.destroy();

//         window.completionChartInstance =
//             new Chart(
//                 completionCtx,
//                 {
//                     type: "doughnut",

//                     data: {
//                         labels: [
//                             "Completed",
//                             "Remaining"
//                         ],

//                         datasets: [
//                             {
//                                 data: [
//                                     completed,
//                                     remaining
//                                 ],

//                                 backgroundColor: [
//                                     "#22c55e",
//                                     "#334155"
//                                 ],

//                                 borderWidth: 0,
//                                 hoverOffset: 15
//                             }
//                         ]
//                     },

//                     options: {
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         cutout: "78%",

//                         plugins: {
//                             legend: {
//                                 position: "bottom"
//                             },

//                             tooltip: {
//                                 callbacks: {
//                                     label: function (
//                                         context
//                                     ) {

//                                         const value =
//                                             context.raw;

//                                         const pct =
//                                             total
//                                                 ? Math.round(
//                                                       (
//                                                           value /
//                                                           total
//                                                       ) *
//                                                           100
//                                                   )
//                                                 : 0;

//                                         return (
//                                             context.label +
//                                             ": " +
//                                             value +
//                                             " (" +
//                                             pct +
//                                             "%)"
//                                         );
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             );
//     }

//     // ==========================
//     // EXPECTED VS ACTUAL
//     // ==========================

//     const expectedCtx =
//         document.getElementById(
//             "expectedChart"
//         );

//     if (expectedCtx) {

//         Chart.getChart(
//             expectedCtx
//         )?.destroy();

//         window.expectedChartInstance =
//             new Chart(
//                 expectedCtx,
//                 {
//                     type: "bar",

//                     data: {
//                         labels: [
//                             "Expected",
//                             "Actual"
//                         ],

//                         datasets: [
//                             {
//                                 data: [
//                                     total,
//                                     completed
//                                 ],

//                                 backgroundColor: [
//                                     "#3b82f6",
//                                     "#22c55e"
//                                 ],

//                                 borderRadius: 12
//                             }
//                         ]
//                     },

//                     options: {
//                         responsive: true,
//                         maintainAspectRatio: false,

//                         plugins: {
//                             legend: {
//                                 display: false
//                             }
//                         },

//                         scales: {
//                             x: {
//                                 grid: {
//                                     display: false
//                                 }
//                             },

//                             y: {
//                                 beginAtZero: true,
//                                 max: total,
//                                 ticks: {
//                                     stepSize: 1
//                                 }
//                             }
//                         }
//                     }
//                 }
//             );
//     }

//     // ==========================
//     // WEEKLY PROGRESS GRAPH
//     // ==========================

//     const progressCtx =
//         document.getElementById(
//             "weeklyChart"
//         );

//     if (progressCtx) {

//         Chart.getChart(
//             progressCtx
//         )?.destroy();

//         const totalWeeks =
//             Math.max(
//                 4,
//                 Math.ceil(total / 5)
//             );

//         const labels = [];
//         const progressData = [];

//         const currentWeek =
//             Math.max(
//                 1,
//                 Math.ceil(
//                     (completed || 1) /
//                     Math.max(
//                         1,
//                         Math.ceil(
//                             total /
//                             totalWeeks
//                         )
//                     )
//                 )
//             );

//         for (
//             let week = 1;
//             week <= totalWeeks;
//             week++
//         ) {

//             labels.push(
//                 `Freq ${week}`
//             );

//             if (
//                 week < currentWeek
//             ) {

//                 progressData.push(
//                     Math.min(
//                         total,
//                         Math.round(
//                             (
//                                 week /
//                                 totalWeeks
//                             ) * total
//                         )
//                     )
//                 );

//             } else if (
//                 week === currentWeek
//             ) {

//                 progressData.push(
//                     completed
//                 );

//             } else {

//                 progressData.push(
//                     null
//                 );
//             }
//         }

//         window.weeklyChartInstance =
//             new Chart(
//                 progressCtx,
//                 {
//                     type: "line",

//                     data: {
//                         labels,

//                         datasets: [
//                             {
//                                 label:
//                                     "Completed Steps",

//                                 data:
//                                     progressData,

//                                 borderColor:
//                                     "#3522c5",

//                                 backgroundColor:
//                                     "#1b49ca",

//                                 pointBackgroundColor:
//                                     "#3222c5",

//                                 pointBorderColor:
//                                     "#ffffff",

//                                 pointRadius: 7,

//                                 pointHoverRadius: 10,

//                                 pointBorderWidth: 2,

//                                 borderWidth: 3,

//                                 tension: 0.35,

//                                 spanGaps: true,

//                                 fill: false
//                             }
//                         ]
//                     },

//                     options: {
//                         responsive: true,
//                         maintainAspectRatio: false,

//                         plugins: {
//                             legend: {
//                                 display: false
//                             }
//                         },

//                         scales: {

//                             x: {
//                                   max: total,

                               
//                                 title: {
//                                     display: true,
//                                     text: "Frequency"
//                                 }
//                             },

//                             y: {
//                                 beginAtZero: true,

//                                 max: total,

//                                 ticks: {
//                                     stepSize: 1
//                                 },

//                                 title: {
//                                     display: true,
//                                     text:
//                                         "Completed Steps"
//                                 }
//                             }
//                         }
//                     }
//                 }
//             );
//     }
// }
function renderGeneratedCharts() {

    const roadmapJson =
        JSON.parse(
            JSON.parse(tracker.jsonData)
        );

    const roadmap =
        roadmapJson.beginner ||
        roadmapJson.intermediate ||
        roadmapJson.advanced;

    const total =
        Number(tracker.totalSteps || 0);

    const completed =
        Number(tracker.completedSteps || 0);

    const remaining =
        Math.max(
            0,
            total - completed
        );

    const percentage =
        Number(
            tracker.completedpercentage || 0
        );


    Chart.defaults.color =
        "#cbd5e1";

    Chart.defaults.font.family =
        "Inter, sans-serif";


    // =====================================================
    // COMPLETION DISTRIBUTION - RING
    // =====================================================

    const completionCtx =
        document.getElementById(
            "completionChart"
        );

    if (completionCtx) {

        Chart.getChart(
            completionCtx
        )?.destroy();

        window.completionChartInstance =
            new Chart(
                completionCtx,
                {
                    type: "doughnut",

                    data: {

                        labels: [
                            "Completed",
                            "Remaining"
                        ],

                        datasets: [
                            {
                                data: [
                                    completed,
                                    remaining
                                ],

                                backgroundColor: [
                                    "#22c55e",
                                    "#334155"
                                ],

                                borderWidth: 0,

                                hoverOffset: 15
                            }
                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        cutout: "78%",

                        plugins: {

                            legend: {
                                position: "bottom"
                            },

                            tooltip: {

                                callbacks: {

                                    label:
                                        function(context) {

                                            const value =
                                                context.raw;

                                            const pct =
                                                total
                                                    ? Math.round(
                                                        (value / total) * 100
                                                    )
                                                    : 0;

                                            return (
                                                context.label +
                                                ": " +
                                                value +
                                                " (" +
                                                pct +
                                                "%)"
                                            );
                                        }
                                }
                            }
                        }
                    }
                }
            );
    }


    // =====================================================
    // EXPECTED VS ACTUAL
    // =====================================================

    const expectedCtx =
        document.getElementById(
            "expectedChart"
        );

    if (expectedCtx) {

        Chart.getChart(
            expectedCtx
        )?.destroy();

        window.expectedChartInstance =
            new Chart(
                expectedCtx,
                {
                    type: "bar",

                    data: {

                        labels: [
                            "Expected",
                            "Actual"
                        ],

                        datasets: [
                            {
                                data: [
                                    total,
                                    completed
                                ],

                                backgroundColor: [
                                    "#3b82f6",
                                    "#22c55e"
                                ],

                                borderRadius: 12
                            }
                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                display: false
                            }
                        },

                        scales: {

                            x: {

                                grid: {
                                    display: false
                                }
                            },

                            y: {

                                beginAtZero: true,

                                max: total,

                                ticks: {
                                    stepSize: 1
                                }
                            }
                        }
                    }
                }
            );
    }


    // =====================================================
    // WEEKLY / FREQUENCY PROGRESS
    // =====================================================

    const progressCtx =
        document.getElementById(
            "weeklyChart"
        );

    if (progressCtx) {

        Chart.getChart(
            progressCtx
        )?.destroy();

        const totalWeeks =
            Math.max(
                4,
                Math.ceil(total / 5)
            );

        const labels = [];

        const progressData = [];

        const currentWeek =
            Math.max(
                1,
                Math.ceil(
                    (completed || 1) /
                    Math.max(
                        1,
                        Math.ceil(
                            total /
                            totalWeeks
                        )
                    )
                )
            );


        for (
            let week = 1;
            week <= totalWeeks;
            week++
        ) {

            labels.push(
                `Freq ${week}`
            );


            if (
                week < currentWeek
            ) {

                progressData.push(
                    Math.min(
                        total,
                        Math.round(
                            (
                                week /
                                totalWeeks
                            ) * total
                        )
                    )
                );

            } else if (
                week === currentWeek
            ) {

                progressData.push(
                    completed
                );

            } else {

                progressData.push(
                    null
                );
            }
        }


        window.weeklyChartInstance =
            new Chart(
                progressCtx,
                {
                    type: "line",

                    data: {

                        labels,

                        datasets: [
                            {
                                label:
                                    "Completed Steps",

                                data:
                                    progressData,

                                borderColor:
                                    "#3522c5",

                                backgroundColor:
                                    "#1b49ca",

                                pointBackgroundColor:
                                    "#3222c5",

                                pointBorderColor:
                                    "#ffffff",

                                pointRadius: 7,

                                pointHoverRadius: 10,

                                pointBorderWidth: 2,

                                borderWidth: 3,

                                tension: 0.35,

                                spanGaps: true,

                                fill: false
                            }
                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                display: false
                            }
                        },

                        scales: {

                            x: {

                                title: {
                                    display: true,

                                    text:
                                        "Frequency"
                                }
                            },

                            y: {

                                beginAtZero: true,

                                max: total,

                                ticks: {
                                    stepSize: 1
                                },

                                title: {

                                    display: true,

                                    text:
                                        "Completed Steps"
                                }
                            }
                        }
                    }
                }
            );
    }

// =====================================================
// POLAR AREA CHART
// =====================================================
const cardss=
        document.getElementById(
            "card1"
        );
        cardss.style.display = "flex";
        // cards.style.backgroundColor = "red";
        cardss.style.width = "100%";
        cardss.style.height = "500px";
const polarCtx =
    document.getElementById(
        "polarChart"
    );
  polarCtx.style.width = "100%";
  polarCtx.style.height = "500px";
if (polarCtx) {

    Chart.getChart(
        polarCtx
    )?.destroy();

    window.polarChartInstance =
        new Chart(
            polarCtx,
            {
                type: "polarArea",

                data: {

                    labels: [
                        "Completed",
                        "Remaining",
                        "Progress %",
                        "Total Steps"
                    ],

                    datasets: [
                        {
                            data: [
                                completed,
                                remaining,
                                percentage,
                                total
                            ],

                            backgroundColor: [
                                "rgba(34,197,94,0.75)",
                                "rgba(239,68,68,0.75)",
                                "rgba(59,130,246,0.75)",
                                "rgba(168,85,247,0.75)"
                            ],

                            borderWidth: 2,

                            borderColor:
                                "#0f172a"
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    animation: {

                        animateRotate: true,

                        duration: 1500
                    },

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                usePointStyle:
                                    true,

                                padding: 20
                            }
                        },

                        tooltip: {

                            backgroundColor:
                                "#0f172a",

                            padding: 12,

                            cornerRadius: 12
                        }
                    },

                    scales: {

                        r: {

                            beginAtZero:
                                true,

                            grid: {

                                color:
                                    "rgba(148,163,184,0.15)"
                            },

                            ticks: {

                                backdropColor:
                                    "transparent"
                            }
                        }
                    }
                }
            }
        );
}
    // =====================================================
    // RADAR CHART
    // =====================================================
const cards =
        document.getElementById(
            "card"
        );
        cards.style.display = "flex";
        // cards.style.backgroundColor = "red";
        cards.style.width = "100%";
        cards.style.height = "500px";
    const radarCtx =
        document.getElementById(
            "radarChart"
        );
       console.log("hello",cards);
     
    if (radarCtx) {

        Chart.getChart(
            radarCtx
        )?.destroy();

        window.radarChartInstance =
            new Chart(
                radarCtx,
                {
                    type: "radar",

                    data: {

                        labels: [
                            "Total Steps",
                            "Completed",
                            "Remaining",
                            "Progress %"
                        ],

                        datasets: [

                            {
                                label:
                                    "Roadmap Analysis",

                                data: [
                                    total,
                                    completed,
                                    remaining,
                                    percentage
                                ],

                                backgroundColor:
                                    "rgba(59, 130, 246, 0.20)",

                                borderColor:
                                    "#3b82f6",

                                borderWidth: 3,

                                pointBackgroundColor:
                                    "#22c55e",

                                pointBorderColor:
                                    "#ffffff",

                                pointBorderWidth: 2,

                                pointRadius: 5,

                                pointHoverRadius: 8
                            }

                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        animation: {

                            duration: 1200,

                            easing:
                                "easeOutQuart"
                        },

                        plugins: {

                            legend: {

                                position:
                                    "bottom",

                                labels: {

                                    usePointStyle:
                                        true,

                                    padding: 18
                                }
                            },

                            tooltip: {

                                backgroundColor:
                                    "#0f172a",

                                titleColor:
                                    "#ffffff",

                                bodyColor:
                                    "#cbd5e1",

                                padding: 12,

                                cornerRadius: 10
                            }
                        },

                        scales: {

                            r: {

                                beginAtZero: true,

                                grid: {

                                    color:
                                        "rgba(148,163,184,0.18)"
                                },

                                angleLines: {

                                    color:
                                        "rgba(148,163,184,0.18)"
                                },

                                pointLabels: {

                                    color:
                                        "#cbd5e1",

                                    font: {

                                        size: 12,

                                        weight:
                                            "600"
                                    }
                                },

                                ticks: {

                                    display: false
                                }
                            }
                        }
                    }
                }
            );
    }
}


function renderGeneratedProgress() {

    const roadmap =
        getGeneratedRoadmap();
    console.log("Roadmap generated vibhav:", roadmap);
    console.log("Tracker generated vibhav:", tracker);
    const nodes =
        roadmap.nodes || [];

    const progress =
        tracker.progress || {};

    const total =
        tracker.totalSteps || nodes.length;

    const done =
        tracker.completedSteps || 0;

    const remaining =
        total - done;

    const pct =
        total === 0
            ? 0
            : Math.round(
                (done / total) * 100
            );

    const ringV =
        document.getElementById(
            "ringV"
        );

    if (ringV) {

        ringV.textContent =
            pct + "%";
    }

    const ring =
        document.getElementById(
            "ring"
        );

    if (ring) {

        ring.style.background =
            `conic-gradient(
                var(--success) ${pct}%,
                rgba(255,255,255,.08) ${pct}%
            )`;
    }

    const completedCount =
        document.getElementById(
            "completedCount"
        );

    if (completedCount) {

        completedCount.textContent =
            done;
    }

    const remainingCount =
        document.getElementById(
            "remainingCount"
        );

    if (remainingCount) {

        remainingCount.textContent =
            remaining;
    }

    const totalCount =
        document.getElementById(
            "totalCount"
        );

    if (totalCount) {

        totalCount.textContent =
            total;
    }

    let status =
        "Not Started";

    if (done > 0) {

        status =
            "In Progress";
    }

    if (
        done === total &&
        total > 0
    ) {

        status =
            "Completed";
    }

    const statusText =
        document.getElementById(
            "statusText"
        );

    if (statusText) {

        statusText.textContent =
            status;
    }

    const stats =
        document.getElementById(
            "stats"
        );
console.log(done)
console.log(remaining)
console.log(total)
    if (stats) {

        stats.innerHTML = `

        <div>
            <div style="
                font-size:24px;
                font-weight:800;
            ">
                ${done}
            </div>
            <div>
                Completed
            </div>
        </div>

        <div>
            <div style="
                font-size:24px;
                font-weight:800;
            ">
                ${remaining}
            </div>
            <div>
                Remaining
            </div>
        </div>

        <div>
            <div style="
                font-size:24px;
                font-weight:800;
            ">
                ${total}
            </div>
            <div>
                Total
            </div>
        </div>

        `;
    }
}

function renderGeneratedChecklist() {

    const checklist =
        document.getElementById("checklist");

    if (!checklist) return;

    const roadmap =
        getGeneratedRoadmap();

    const nodes =
        roadmap.nodes || [];

    // Restore completed state from tracker
    const completedCount =
        tracker.completedSteps || 0;

    nodes.forEach((node, index) => {
        node.done = index < completedCount;
    });

    checklist.innerHTML =
        nodes.map((node, index) => `
            <div
                class="check-item ${node.done ? "done" : ""}"
                data-index="${index}"
            >
                <div class="check-box">
                    ${node.done ? "✓" : ""}
                </div>

                <div>
                    <div class="check-title">
                        ${node.step_no}.
                        ${node.step_name}
                    </div>

                    <div class="check-desc">
                        ${node.description || ""}
                    </div>

                    ${
                        node.reference
                            ? `
                                <a
                                    href="${node.reference}"
                                    target="_blank"
                                    class="ref-link"
                                    onclick="event.stopPropagation()"
                                >
                                    Learn More →
                                </a>
                            `
                            : ""
                    }
                </div>
            </div>
        `).join("");

    document
        .querySelectorAll(".check-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            item.dataset.index
                        );

                    // ==================
                    // UNCHECK
                    // ==================
                    if (nodes[index].done) {

                        for (
                            let i = index;
                            i < nodes.length;
                            i++
                        ) {
                            nodes[i].done = false;
                        }

                    } else {

                        // ==================
                        // CHECK ONLY NEXT STEP
                        // ==================
                        const expectedIndex =
                            tracker.completedSteps;

                        if (
                            index !== expectedIndex
                        ) {
                            alert(
                                "Complete previous steps first"
                            );
                            return;
                        }

                        nodes[index].done = true;
                    }

                    // ==================
                    // UPDATE TRACKER
                    // ==================
                    tracker.completedSteps =
                        nodes.filter(
                            n => n.done
                        ).length;

                    tracker.remainingSteps =
                        nodes.length -
                        tracker.completedSteps;

                    tracker.completedpercentage =
                        Math.round(
                            (
                                tracker.completedSteps /
                                nodes.length
                            ) * 100
                        );

                    tracker.status =
                        tracker.completedSteps === 0
                            ? "NOT_STARTED"
                            : tracker.completedSteps === nodes.length
                            ? "COMPLETED"
                            : "IN_PROGRESS";

                    localStorage.setItem(
                        "selected_tracker",
                        JSON.stringify(tracker)
                    );

                    renderGeneratedChecklist();
                    renderGeneratedProgress();
                    renderGeneratedCharts();
                }
            );
        });
}
// ======================
// ROADMAP CANVAS
// ======================

function renderCanvas() {

    const inner =
        document.getElementById(
            "canvasInner"
        );

    if (!inner) return;

    let svg = `
    <svg
        width="300"
        height="200"
        style="
            position:absolute;
            top:0;
            left:0;
        "
    >
    `;

    r.edges.forEach(edge => {

        const source =
            r.nodes.find(
                n => n.id === edge.source
            );

        const target =
            r.nodes.find(
                n => n.id === edge.target
            );

        if (
            !source ||
            !target
        ) return;

        svg += `
        <line
            x1="${source.position.x + 90}"
            y1="${source.position.y + 50}"

            x2="${target.position.x + 90}"
            y2="${target.position.y + 50}"

            stroke="#444"
            stroke-width="3"
        />
        `;
    });

    svg += `</svg>`;

    const nodesHTML =
        r.nodes.map(node => `

        <div
            class="node-card
            ${node.done ? "done" : ""}"

            style="
                left:${node.position.x}px;
                top:${node.position.y}px;
            "
        >

            <div class="node-step">
                STEP ${node.idx}
            </div>

            <h4>
                ${node.title}
            </h4>

            <p>
                ${node.description}
            </p>

            ${
                node.referenceLink
                    ? `
                    <a
                        href="${node.referenceLink}"
                        target="_blank"
                    >
                        Resource
                    </a>
                `
                    : ""
            }

        </div>

    `).join("");

    inner.innerHTML =
        svg + nodesHTML;
}

// ======================
// INFO PANEL
// ======================

const trackerInfo =
    document.getElementById(
        "trackerInfo"
    );

if (trackerInfo) {

    trackerInfo.innerHTML = `

    <div class="info-card">

        <h3>
            Roadmap Details
        </h3>

        <p>
            Name:
            ${tracker.roadmapName}
        </p>

        <p>
            Status:
            ${tracker.status}
        </p>

        <p>
            Type:
            ${roadmapLevel}
        </p>

        <p>
            Total Steps:
            ${r.nodes.length}
        </p>

        <p>
            Created:
            ${new Date(
                tracker.createdAt
            ).toLocaleString()}
        </p>

    </div>

    `;
}


// ======================
// RENDER
// ======================

function renderAll() {
  console.log("vibhav",tracker);


  const type=tracker.type;
  if(type==="Generated"){
console.log("select is Generated Roadmap")
   renderGeneratedChecklist()
   renderGeneratedProgress()
  
   renderGeneratedCharts()
   

  }else if(type==="CustomTracker"){
    console.log("select is Custom  Roadmap")
   renderCustomTrackerProgress();

    renderCustomTrackerChecklist();

    renderCustomTrackerCharts();
  }
  else{
    console.log("select is Custom Roadmap")
    renderProgress();
renderCharts();     
    renderChecklist();

    // renderCanvas();

     

    
      }
    
}

// ======================
// EVENTS
// ======================

window.addEventListener(
    "resize",
    renderCanvas
);

renderAll();

// ======================
// THEME
// ======================

function applyTheme() {

    const data =
        JSON.parse(
            localStorage.getItem(
                "clarity_data"
            )
        );

    const theme =
        data?.settings?.theme ||
        "dark";

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );
}

// saveBtn.addEventListener("click", async () => {
//     let data;
//         let totalSteps = 0;
//     let completedSteps = 0;
//     let remainingSteps = 0;


//     if(tracker.type !== "CustomTracker"){
//          data = getGeneratedRoadmap();
//         totalSteps = data.nodes.length;
//      completedSteps = tracker.completedSteps;
//          remainingSteps = tracker.remainingSteps;
//         console.log("Tracker type is not CustomTracker, skipping save.");   
//         console.log("totalSteps:", totalSteps);
//         console.log("completedSteps:", completedSteps);
//         console.log("remainingSteps:", remainingSteps);
        
//     }else if(tracker.type === "CustomRoadmap"){
//       data = getCustomRoadmapData();
//       totalSteps = data.steps.length;
//       completedSteps = tracker.completedSteps;
//       remainingSteps = tracker.remainingSteps;
//       console.log("Tracker type is CustomRoadmap, proceeding to save.");
//       console.log("totalSteps:", totalSteps);
//       console.log("completedSteps:", completedSteps);
//       console.log("remainingSteps:", remainingSteps);
//     }
//     else{
//   data = getCustomTrackerData();

//      totalSteps = data.steps.length;
    
//      completedSteps =
//     tracker.completedSteps;
        

//     remainingSteps =
//     tracker.remainingSteps; 
//     console.log("Tracker type is CustomTracker, proceeding to save.");
//     console.log("totalSteps:", totalSteps);
//     console.log("completedSteps:", completedSteps);
//     console.log("remainingSteps:", remainingSteps);
   
//     }
   

//     const status =
//         completedSteps === totalSteps
//             ? "COMPLETED"
//             : completedSteps > 0
//             ? "IN_PROGRESS"
//             : "NOT_STARTED";

//     const trackerPayload = {
//         id: tracker.id,
//         userEmail: tracker.userEmail,

//         roadmapName:
//             tracker.roadmapName,

//         completedSteps,

//         remainingSteps,

//         totalSteps,

//         status,

//         jsonData:
//             JSON.stringify(data)
//     };

//     console.log("harshitha",trackerPayload);
//     const response =
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type":
//                             "application/json"
//                     },
//                     body: JSON.stringify(
//                         trackerPayload
//                     )
//                 }
//             );

//         if (!response.ok) {
//             throw new Error(
//                 "Failed to save tracker"
//             );
//         }

//         alert(
//             "Tracker Saved"
//         );
    

// });

saveBtn.addEventListener("click", async () => {

    let data;
    let totalSteps = 0;
    let completedSteps = 0;
    let remainingSteps = 0;

    // ================================
    // GENERATED ROADMAP
    // ================================
    if (
        tracker.type !== "CustomTracker" &&
        tracker.type !== "CustomRoadmap"
    ) {

        data = getGeneratedRoadmap();

        totalSteps = data.nodes.length;
        completedSteps = tracker.completedSteps;
        remainingSteps = tracker.remainingSteps;

        console.log(
            "Tracker type is Generated Roadmap, proceeding to save."
        );

        console.log("totalSteps:", totalSteps);
        console.log("completedSteps:", completedSteps);
        console.log("remainingSteps:", remainingSteps);
    }

    // ================================
    // CUSTOM ROADMAP
    // ================================
    // else if (tracker.type === "CustomRoadmap") {

    //     data = getCustomRoadmapData();

    //     totalSteps = data.steps.length;
    //     completedSteps = tracker.completedSteps;
    //     remainingSteps = tracker.remainingSteps;

    //     console.log(
    //         "Tracker type is CustomRoadmap, proceeding to save."
    //     );

    //     console.log("totalSteps:", totalSteps);
    //     console.log("completedSteps:", completedSteps);
    //     console.log("remainingSteps:", remainingSteps);
    // }
//     else if (tracker.type === "CustomRoadmap") {

//     data = getCustomRoadmapData();

//     if (!data || !Array.isArray(data.nodes)) {
//         throw new Error("Custom Roadmap data or nodes not found");
//     }

//     totalSteps = data.nodes.length;

//     // Get the CURRENT progress from the displayed roadmap
//     completedSteps = r.nodes.filter(node => node.done).length;

//     remainingSteps = totalSteps - completedSteps;

//     // Copy current done status back into CustomRoadmap data
//     data.nodes.forEach(node => {

//         const currentNode = r.nodes.find(
//             rNode => rNode.id === node.node_id
//         );

//         if (currentNode) {
//             node.done = currentNode.done;
//         }
//     });

//     // Update tracker object
//     tracker.totalSteps = totalSteps;
//     tracker.completedSteps = completedSteps;
//     tracker.remainingSteps = remainingSteps;

//     tracker.completedpercentage =
//         totalSteps > 0
//             ? Math.round((completedSteps / totalSteps) * 100)
//             : 0;

//     tracker.status =
//         completedSteps === 0
//             ? "NOT_STARTED"
//             : completedSteps === totalSteps
//                 ? "COMPLETED"
//                 : "IN_PROGRESS";

//     console.log("Custom Roadmap Data:", data);
//     console.log("totalSteps:", totalSteps);
//     console.log("completedSteps:", completedSteps);
//     console.log("remainingSteps:", remainingSteps);
//     console.log("completedpercentage:", tracker.completedpercentage);
//     console.log("status:", tracker.status);
// }

else if (tracker.type === "CustomRoadmap") {

    console.log("Tracker type is CustomRoadmap, proceeding to save.");

    data = getCustomRoadmapData();

    if (!data || !Array.isArray(data.nodes)) {
        throw new Error(
            "Custom Roadmap data or nodes not found"
        );
    }

    totalSteps =
        data.nodes.length;

    // ==============================
    // GET CURRENT UI PROGRESS
    // ==============================

    completedSteps =
        r.nodes.filter(
            node => node.done
        ).length;

    remainingSteps =
        totalSteps - completedSteps;

    // ==============================
    // COPY UI PROGRESS INTO JSON
    // ==============================

    data.nodes.forEach(node => {

        const currentNode =
            r.nodes.find(
                rNode =>
                    String(rNode.id) ===
                    String(node.node_id)
            );

        if (currentNode) {

            node.done =
                currentNode.done === true;

        } else {

            node.done = false;

        }

    });

    // ==============================
    // UPDATE TRACKER
    // ==============================

    tracker.totalSteps =
        totalSteps;

    tracker.completedSteps =
        completedSteps;

    tracker.remainingSteps =
        remainingSteps;

    tracker.completedpercentage =
        totalSteps > 0
            ? Math.round(
                (completedSteps / totalSteps) * 100
            )
            : 0;

    tracker.status =
        completedSteps === 0
            ? "NOT_STARTED"
            : completedSteps === totalSteps
                ? "COMPLETED"
                : "IN_PROGRESS";

    // IMPORTANT
    // Store updated roadmap JSON in tracker
    tracker.jsonData =
        JSON.stringify(data);

    // Store updated tracker locally
    localStorage.setItem(
        "selected_tracker",
        JSON.stringify(tracker)
    );

    console.log(
        "Custom Roadmap Data:",
        data
    );

    console.log(
        "totalSteps:",
        totalSteps
    );

    console.log(
        "completedSteps:",
        completedSteps
    );

    console.log(
        "remainingSteps:",
        remainingSteps
    );

    console.log(
        "completedpercentage:",
        tracker.completedpercentage
    );

    console.log(
        "status:",
        tracker.status
    );

}

    // ================================
    // CUSTOM TRACKER
    // ================================
    else if (tracker.type === "CustomTracker") {

        data = getCustomTrackerData();

        totalSteps = data.steps.length;
        completedSteps = tracker.completedSteps;
        remainingSteps = tracker.remainingSteps;

        console.log(
            "Tracker type is CustomTracker, proceeding to save."
        );

        console.log("totalSteps:", totalSteps);
        console.log("completedSteps:", completedSteps);
        console.log("remainingSteps:", remainingSteps);
    }

    // ================================
    // STATUS
    // ================================

    const status =
        completedSteps === totalSteps
            ? "COMPLETED"
            : completedSteps > 0
            ? "IN_PROGRESS"
            : "NOT_STARTED";

    // ================================
    // PAYLOAD
    // ================================

    const trackerPayload = {
        id: tracker.id,
        userEmail: tracker.userEmail,

        roadmapName: tracker.roadmapName,

        completedSteps: completedSteps,

        remainingSteps: remainingSteps,

        totalSteps: totalSteps,

        status: status,

        jsonData: JSON.stringify(data)
    };
   const sessionId= sessionStorage.getItem("sessionId");
    const finaltrackerPayload = {
        trackerData: trackerPayload,
        sessionID: sessionId,
        email: tracker.userEmail
    };

    console.log("trackerPayload:", trackerPayload);
  console.log("finaltrackerPayload:", finaltrackerPayload);
    // ================================
    // SAVE TO BACKEND
    // ================================

    const response = await fetch(
        API.saveIndividualTracker(),
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(finaltrackerPayload)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to save tracker");
    }

    alert("Tracker Saved");
});
applyTheme();
await applyLanguage();