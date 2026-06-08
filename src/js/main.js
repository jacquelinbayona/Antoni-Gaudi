/* init global */
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ─────────────────────────────
   PROGRESS BAR
───────────────────────────── */
const progressLine = document.getElementById("progress-line");
window.addEventListener("scroll", () => {
  const pct =
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressLine.style.height = pct + "%";
});

/* ─────────────────────────────
   BUILD MOSAIC GRID
───────────────────────────── */
function buildMosaic(colors) {
  const grid = document.getElementById("d-mosaic");
  grid.innerHTML = "";
  const cols = 18,
    rows = 22;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  for (let i = 0; i < cols * rows; i++) {
    const c = colors[Math.floor(Math.random() * colors.length)];
    const cell = document.createElement("div");
    cell.className = "mosaic-cell";
    cell.style.background = c;
    cell.style.opacity = (0.15 + Math.random() * 0.45).toFixed(2);
    cell.style.margin = "1px";
    grid.appendChild(cell);
  }
}

/* ─────────────────────────────
   STATION DETAIL
───────────────────────────── */
let currentStation = 0;

function openStation(i) {
  currentStation = i;
  const s = STATIONS[i];
  document.getElementById("d-tag").textContent = s.tag;
  document.getElementById("d-title").textContent = s.title;
  document.getElementById("d-year").textContent = s.year;
  document.getElementById("d-desc").textContent = s.desc;
  document.getElementById("d-archi").textContent = s.archi;
  document.getElementById("d-style").textContent = s.style;
  document.getElementById("d-height").textContent = s.height;
  document.getElementById("d-class").textContent = s.classement;
  document.getElementById("d-icon").textContent = s.icon;
  buildMosaic(s.colors);
  document.getElementById("detail-overlay").classList.add("open");
  // mark dot
  document
    .querySelectorAll(".st-dot")
    .forEach((d, j) => d.classList.toggle("active", j === i));
}
function closeStation() {
  document.getElementById("detail-overlay").classList.remove("open");
}
function nextStation() {
  openStation((currentStation + 1) % 4);
}
function prevStation() {
  openStation((currentStation + 3) % 4);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeStation();
  if (e.key === "ArrowRight") nextStation();
  if (e.key === "ArrowLeft") prevStation();
});

/* ─────────────────────────────
   TUNNEL ARCHES — animate scale
───────────────────────────── */
gsap.to(".tunnel-arch", {
  scale: 1.04,
  yoyo: true,
  repeat: -1,
  duration: 3,
  ease: "sine.inOut",
  stagger: { each: 0.4, from: "edges" },
});

/* ─────────────────────────────
   MAIN SCROLL TIMELINE
───────────────────────────── */
const masterTL = gsap.timeline({
  scrollTrigger: {
    trigger: "#scroll-wrapper",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.8,
  },
});

// ── Phase 1: zoom into wagon (0% → 22% scroll) ──
masterTL.to(
  "#wagon-wrap",
  {
    scale: 14,
    y: "8vh",
    duration: 0.22,
    ease: "power2.in",
  },
  0,
);

masterTL.to("#intro-label", { opacity: 0, duration: 0.08 }, 0);
masterTL.to("#scroll-hint", { opacity: 0, duration: 0.06 }, 0);

// ── Phase 2: flash white → fade in map (22% → 30%) ──
masterTL.to(
  "#tunnel",
  {
    opacity: 0,
    duration: 0.08,
    ease: "power3.in",
  },
  0.22,
);

masterTL.to(
  "#map-scene",
  {
    opacity: 1,
    duration: 0.1,
    ease: "power2.out",
  },
  0.28,
);

masterTL.to(
  "#map-title",
  {
    opacity: 1,
    y: 0,
    duration: 0.08,
  },
  0.3,
);

masterTL.fromTo("#map-title", { y: -20 }, { y: 0 }, 0.28);

// ── Phase 3: draw the metro path (30% → 55%) ──
masterTL.to(
  "#drawn-path",
  {
    strokeDashoffset: 0,
    duration: 0.25,
    ease: "none",
  },
  0.3,
);

masterTL.to("#dashed-path", { opacity: 1, duration: 0.05 }, 0.34);

// ── Phase 4: reveal buildings along the way ──
masterTL.to("#bld-sagrada", { opacity: 0.85, duration: 0.06 }, 0.32);
masterTL.to(
  ["#pulse-sagrada", "#dot-0", "#lbl-0"],
  { opacity: 1, duration: 0.05 },
  0.36,
);

masterTL.to("#bld-batllo", { opacity: 0.85, duration: 0.06 }, 0.4);
masterTL.to(
  ["#pulse-batllo", "#dot-1", "#lbl-1"],
  { opacity: 1, duration: 0.05 },
  0.43,
);

masterTL.to("#bld-guell", { opacity: 0.85, duration: 0.06 }, 0.46);
masterTL.to(
  ["#pulse-guell", "#dot-2", "#lbl-2"],
  { opacity: 1, duration: 0.05 },
  0.49,
);

masterTL.to("#bld-palau", { opacity: 0.85, duration: 0.06 }, 0.52);
masterTL.to(
  ["#pulse-palau", "#dot-3", "#lbl-3"],
  { opacity: 1, duration: 0.05 },
  0.55,
);

// ── Phase 5: small wagon follows the path (35% → 100%) ──
masterTL.to("#path-wagon", { opacity: 1, duration: 0.04 }, 0.35);

masterTL.to(
  "#path-wagon",
  {
    motionPath: {
      path: "#metro-motion-path",
      align: "#metro-motion-path",
      alignOrigin: [0.5, 0.8],
      autoRotate: true,
      start: 0,
      end: 1,
    },
    duration: 0.6,
    ease: "power1.inOut",
  },
  0.35,
);

// ── Counter dots appear ──
masterTL.to("#station-counter", { opacity: 1, duration: 0.05 }, 0.36);

// ── Highlight counter dots as wagon passes stations ──
const stProgress = [0.4, 0.53, 0.63, 0.85];
stProgress.forEach((p, i) => {
  masterTL.to(
    `#cdot-${i}`,
    {
      backgroundColor: "var(--terracotta)",
      scale: 1.4,
      duration: 0.04,
    },
    p,
  );
});

/* ─────────────────────────────
   WAGON WHEEL SPIN (CSS anim)
───────────────────────────── */
const style = document.createElement("style");
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
