/* CLARITY — static HTML/CSS/JS */
const reviews = [
  {
    name: "Arjun Sharma",
    review:
      "The roadmap was surprisingly detailed. It gave me a clear path to become a frontend developer without feeling overwhelmed.",
    rating: 5
  },

  {
    name: "Priya Verma",
    review:
      "I used it to plan my data analytics journey. The step-by-step structure saved me hours of research.",
    rating: 5
  },

  {
    name: "Rohan Patel",
    review:
      "The goal tracking feature helped me stay consistent for over a month. Really useful for self-learning.",
    rating: 5
  },

  {
    name: "Sneha Reddy",
    review:
      "I generated a roadmap for learning French. The recommendations felt practical and easy to follow.",
    rating: 5
  },

  {
    name: "Aditya Singh",
    review:
      "The UI feels premium and the generated roadmap actually made sense compared to random internet guides.",
    rating: 5
  },

  {
    name: "Kavya Nair",
    review:
      "I liked how quickly it created a personalized plan. The downloadable roadmap was a nice bonus.",
    rating: 5
  },

  {
    name: "Vikram Rao",
    review:
      "Used it for planning my startup journey. The roadmap gave me a much clearer direction than before.",
    rating: 5
  },

  {
    name: "Neha Gupta",
    review:
      "Simple, clean and effective. It helped me break a large goal into manageable steps.",
    rating: 5
  }
];

const track = document.getElementById("reviewsTrack");

function createReviewCard(review) {
  return `
    <div class="review-card">
        <div class="review-header">

            <div class="avatar">
              ${review.name.charAt(0)}
            </div>

            <div>
              <h3>${review.name}</h3>
              <div class="stars">
                ${"★".repeat(review.rating)}
              </div>
            </div>

        </div>

        <p>${review.review}</p>
    </div>
  `;
}

// First set
track.innerHTML = reviews
  .map(createReviewCard)
  .join("");

// Duplicate automatically
track.innerHTML += reviews
  .map(createReviewCard)
  .join("");

  
const heroRoadmaps = [

  {
    loadingText:"Generating Web Development Roadmap...",
    nodes:[
      {label:"Goal",x:300,y:50},
      {label:"HTML & CSS",x:120,y:150},
      {label:"JavaScript",x:300,y:150},
      {label:"React",x:480,y:150},
      {label:"Backend",x:180,y:300},
      {label:"Projects",x:420,y:300},
      {label:"Job Ready",x:300,y:420}
    ]
  },

  {
    loadingText:"Generating French Learning Roadmap...",
    nodes:[
      {label:"Goal",x:100,y:230},
      {label:"Vocabulary",x:220,y:100},
      {label:"Grammar",x:220,y:350},
      {label:"Listening",x:380,y:100},
      {label:"Speaking",x:380,y:350},
      {label:"Practice",x:520,y:230},
      {label:"Fluent",x:300,y:230}
    ]
  },

  {
    loadingText:"Generating AI Engineer Roadmap...",
    nodes:[
      {label:"Goal",x:300,y:60},
      {label:"Python",x:90,y:150},
      {label:"Data Science",x:250,y:190},
      {label:"Machine Learning",x:420,y:150},
      {label:"Deep Learning",x:120,y:330},
      {label:"Projects",x:480,y:330},
      {label:"AI Engineer",x:300,y:420}
    ]
  },

  {
    loadingText:"Generating Fitness Roadmap...",
    nodes:[
      {label:"Goal",x:300,y:50},
      {label:"Nutrition",x:300,y:130},
      {label:"Workout Basics",x:300,y:210},
      {label:"Strength",x:300,y:290},
      {label:"Consistency",x:300,y:370},
      {label:"Transformation",x:120,y:430},
      {label:"Peak Fitness",x:480,y:430}
    ]
  },

{
  loadingText:"Generating Startup Roadmap...",
  nodes:[
    {label:"Start",x:300,y:80},

    {label:"Research & Validate",x:300,y:220},

    {label:"Build MVP",x:300,y:360},

    {label:"Get First Customers",x:300,y:500},

   
  ]
}

];
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Year
  $('#year').textContent = new Date().getFullYear();

  // Particles
  const pc = $('#particles');
  for (let i=0;i<18;i++){
    const p = document.createElement('span');
    p.className='particle';
    p.style.top = ((i*53)%100)+'%';
    p.style.left = ((i*37)%100)+'%';
    p.style.animationDelay = ((i%7)*0.7)+'s';
    p.style.animationDuration = (7 + (i%5))+'s';
    p.style.opacity = 0.4 + ((i%4)*0.1);
    pc.appendChild(p);
  }

  // Nav scrolled + mobile menu
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const ham = $('#hamburger');
  const mm = $('#mobileMenu');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mm.classList.toggle('open');
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open'); mm.classList.remove('open');
  }));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.15});
  $$('.reveal').forEach(el => io.observe(el));

  // Feature cards mouse-tracking glow
  $$('.feature-card').forEach(c => {
    c.addEventListener('mousemove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left)+'px');
      c.style.setProperty('--my', (e.clientY - r.top)+'px');
    });
  });



const tracker = document.querySelector(".mouse-tracker");

// Only enable on devices with a mouse
if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    tracker.style.left = e.clientX + "px";
    tracker.style.top = e.clientY + "px";
  });
} else {
  tracker.style.display = "none";
}

  // Build features grid
  const featureItems = [
  {
    t: "Roadmap Generator",
    d: "Generate structured step-by-step roadmaps for any goal, skill, career, or project in seconds.",
    icon: "◐"
  },
  {
    t: "Downloadable Roadmaps",
    d: "Download your generated roadmaps and access them anytime, anywhere.",
    icon: "↓"
  },
  {
    t: "Goal Tracking",
    d: "Track your progress and stay focused on achieving your goals without losing direction.",
    icon: "◇"
  },
  {
    t: "Progress Dashboard",
    d: "Visualize milestones, completion status, and overall progress through an intuitive dashboard.",
    icon: "▦"
  },
  {
    t: "Custom Roadmaps",
    d: "Create personalized roadmaps tailored to your learning style, timeline, and objectives.",
    icon: "✦"
  },
  {
    t: "Custom Tracker",
    d: "Build custom tracking systems for your goals, habits, projects, and personal milestones.",
    icon: "⌬"
  }
];
  const fg = $('#featuresGrid');
  featureItems.forEach((f,i) => {
    const wrap = document.createElement('div');
    wrap.className = 'reveal';
    wrap.style.transitionDelay = (i*60)+'ms';
    wrap.innerHTML = `
      <article class="feature-card glass f-item">
        <div class="f-ico">${f.icon}</div>
        <h3>${f.t}</h3>
        <p>${f.d}</p>
      </article>`;
    fg.appendChild(wrap);
    io.observe(wrap);
    const card = wrap.querySelector('.feature-card');
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left)+'px');
      card.style.setProperty('--my', (e.clientY - r.top)+'px');
    });
  });

  /* ---------- Roadmap renderer ---------- */
  const SVG_NS = 'http://www.w3.org/2000/svg';
function createHeroRoadmap(data){

  return {
    width:600,
    height:560,
    loadingText:data.loadingText,

    nodes:[
      {id:"g", ...data.nodes[0]},
      {id:"a", ...data.nodes[1]},
      {id:"b", ...data.nodes[2]},
      {id:"c", ...data.nodes[3]},
      {id:"d", ...data.nodes[4]},
      {id:"e", ...data.nodes[5]},
      {id:"f", ...data.nodes[6]}
    ],

    edges:[
      {from:"g",to:"a"},
      {from:"g",to:"b"},
      {from:"g",to:"c"},
      {from:"a",to:"d"},
      {from:"b",to:"d"},
      {from:"b",to:"e"},
      {from:"c",to:"e"},
      {from:"d",to:"f"},
      {from:"e",to:"f"}
    ]
  };

}
  const roadmaps = {

    what: {
      width:640, height:420,
      loadingText:'Structuring Roadmap...',
      nodes:[
        { id:"you",  x:80,  y:200, label:"You" },
        { id:"ai",   x:240, y:100, label:"AI Personalization" },
        { id:"plan", x:240, y:300, label:"Plan" },
        { id:"track",x:420, y:200, label:"Tracking" },
        { id:"goal", x:560, y:200, label:"Goal" },
      ],
      edges:[
        {from:"you",to:"ai"},{from:"you",to:"plan"},
        {from:"ai",to:"track"},{from:"plan",to:"track"},
        {from:"track",to:"goal"},
      ],
    },
    how: (() => {
      const steps = ["Select Goal","Choose Preferences","Generate Roadmap","Track Progress","Get Insights"];
      const nodes = steps.map((s,i) => ({
        id:`s${i}`, x:80 + i*130, y:200 + (i%2===0?0:-40), label:s,
      }));
      const edges = nodes.slice(0,-1).map((n,i) => ({from:n.id, to:nodes[i+1].id}));
      return { width:760, height:360, loadingText:'Mapping Your Process...', nodes, edges };
    })(),
  };

  function el(name, attrs={}, children=[]){
    const n = document.createElementNS(SVG_NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    children.forEach(c => n.appendChild(c));
    return n;
  }

  function renderRoadmap(container, cfg){
    const {width,height,nodes,edges,loadingText} = cfg;
    container.innerHTML = '';

    const loader = document.createElement('span');
    loader.className = 'loading-text';
    loader.textContent = loadingText;
    container.appendChild(loader);

    const svg = el('svg', {viewBox:`0 0 ${width} ${height}`, preserveAspectRatio:'xMidYMid meet'});

    // defs
    const defs = el('defs');
    defs.innerHTML = `
      <radialGradient id="ndGrad-${Math.random().toString(36).slice(2,7)}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>`;
    svg.appendChild(defs);
    const ndGradId = defs.querySelector('radialGradient').id;

    // edges
    const edgeEls = edges.map(e => {
      const a = nodes.find(n=>n.id===e.from), b = nodes.find(n=>n.id===e.to);
      const mx = (a.x+b.x)/2, my = (a.y+b.y)/2 - 20;
      const path = el('path', {
        d:`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`,
        class:'rm-line', stroke:'rgba(200,169,107,0.6)',
      });
      svg.appendChild(path);
      return { e, path, fromIdx: nodes.findIndex(n=>n.id===e.from), toIdx: nodes.findIndex(n=>n.id===e.to) };
    });

    // nodes (groups)
    const nodeEls = nodes.map((n,i) => {
      const g = el('g');
      const glow = el('circle', {cx:n.x, cy:n.y, r:40, fill:`url(#${ndGradId})`, opacity:'0'});
      const circ = el('circle', {cx:n.x, cy:n.y, r:22, class:'rm-node'});
      const num  = el('text', {x:n.x, y:n.y+4, class:'rm-num'});
      num.textContent = String(i+1).padStart(2,'0');
      const lab  = el('text', {x:n.x, y:n.y+40, class:'rm-label'});
      lab.textContent = n.label;
      g.appendChild(glow); g.appendChild(circ); g.appendChild(num); g.appendChild(lab);
      svg.appendChild(g);
      return { glow, circ, num, lab };
    });

    container.appendChild(svg);

    let started = false;
    let timers = [];
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

    function reset(){
      loader.style.display = '';
      nodeEls.forEach(({glow,circ,num,lab}) => {
        glow.setAttribute('opacity','0');
        circ.classList.remove('appear');
        num.classList.remove('show');
        lab.classList.remove('show');
      });
      edgeEls.forEach(({path}) => path.classList.remove('draw'));
    }

    function run(){
      reset();
      timers.push(setTimeout(() => { loader.style.display = 'none'; }, 900));
      nodes.forEach((_,i) => {
        timers.push(setTimeout(() => {
          const {glow,circ,num,lab} = nodeEls[i];
          glow.setAttribute('opacity','1');
          circ.classList.add('appear');
          num.classList.add('show');
          lab.classList.add('show');
          edgeEls.forEach(({path,fromIdx,toIdx}) => {
            if (i >= Math.max(fromIdx,toIdx)) path.classList.add('draw');
          });
        }, 900 + i*550));
      });
      timers.push(setTimeout(run, 900 + nodes.length*550 + 3500));
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started){
          started = true;
          run();
        }
      });
    }, {threshold:0.25});
    obs.observe(container);
  }

 $$('[data-roadmap]').forEach(c => {

  const key = c.getAttribute('data-roadmap');

  if(key === 'hero'){

    let currentIndex = 0;

    function renderHeroCycle(){

      const roadmapConfig = createHeroRoadmap(
        heroRoadmaps[currentIndex]
      );

      renderRoadmap(c, roadmapConfig);

      currentIndex++;

      if(currentIndex >= heroRoadmaps.length){
        currentIndex = 0;
      }
    }

    renderHeroCycle();

    setInterval(renderHeroCycle, 10000);

  } else if(roadmaps[key]) {

    renderRoadmap(c, roadmaps[key]);

  }

});
})();