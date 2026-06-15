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

const drawnPath = document.getElementById("drawn-path");
const pathWagon = document.getElementById("path-wagon");
const mapScene = document.getElementById("map-scene");
let drawnPathLength = 0;
const pathDraw = { progress: 0 };
const stationCoords = [
  { x: 720, y: 180 },
  { x: 340, y: 290 },
  { x: 160, y: 130 },
  { x: 560, y: 420 },
];
let stationPathProgress = [0, 0.36, 0.58, 1];

function getClosestPathProgress(x, y) {
  if (!drawnPath || !drawnPathLength) return 0;

  let closestLength = 0;
  let closestDistance = Number.POSITIVE_INFINITY;
  const samples = 260;

  for (let i = 0; i <= samples; i += 1) {
    const sampleLength = (drawnPathLength * i) / samples;
    const point = drawnPath.getPointAtLength(sampleLength);
    const distance = Math.hypot(point.x - x, point.y - y);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestLength = sampleLength;
    }
  }

  return closestLength / drawnPathLength;
}

function syncPathWagonToLine() {
  if (!drawnPath || !pathWagon || !mapScene || !drawnPathLength) return;

  const dashOffset =
    Number.parseFloat(gsap.getProperty(drawnPath, "strokeDashoffset")) || 0;
  const visibleLength = Math.max(
    0,
    Math.min(drawnPathLength, drawnPathLength - dashOffset),
  );
  const svgPoint = drawnPath.getPointAtLength(visibleLength);
  const screenPoint = svgPoint.matrixTransform(drawnPath.getScreenCTM());
  const sceneRect = mapScene.getBoundingClientRect();

  gsap.set(pathWagon, {
    x: screenPoint.x - sceneRect.left,
    y: screenPoint.y - sceneRect.top,
    xPercent: -50,
    yPercent: -50,
  });
}

function updateDrawnPath() {
  if (!drawnPath || !drawnPathLength) return;

  gsap.set(drawnPath, {
    strokeDashoffset: drawnPathLength * (1 - pathDraw.progress),
  });
  syncPathWagonToLine();
}

if (drawnPath) {
  drawnPathLength = drawnPath.getTotalLength();
  gsap.set(drawnPath, {
    strokeDasharray: drawnPathLength,
    strokeDashoffset: drawnPathLength,
  });
  stationPathProgress = stationCoords
    .map(({ x, y }) => getClosestPathProgress(x, y))
    .sort((a, b) => a - b);
  syncPathWagonToLine();
}

gsap.set(
  [
    "#bld-sagrada",
    "#bld-batllo",
    "#bld-guell",
    "#bld-palau",
    "#pulse-sagrada",
    "#pulse-batllo",
    "#pulse-guell",
    "#pulse-palau",
    "#dot-0",
    "#dot-1",
    "#dot-2",
    "#dot-3",
    "#lbl-0",
    "#lbl-1",
    "#lbl-2",
    "#lbl-3",
  ],
  { opacity: 0, pointerEvents: "none" },
);

// ── Phase 1: zoom into wagon (0% → 22% scroll) ──
masterTL.to(
  "#wagon-wrap",
  {
    y: "8vh",
    x: "-1000px",
    duration: 0.22,
    ease: "power2.in",
  },
  0,
);

// fade out du wagon
masterTL.to(
  "#wagon-wrap",
  {
    opacity: 0,
    duration: 0.22,
    ease: "power2.out",
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

// ── Phase 3: draw the metro path with station stops ──
const drawStart = 0.285;
const drawStops = [
  { progress: stationPathProgress[0], travel: 0.018, hold: 0.064 },
  { progress: stationPathProgress[1], travel: 0.14, hold: 0.07 },
  { progress: stationPathProgress[2], travel: 0.14, hold: 0.07 },
  { progress: stationPathProgress[3], travel: 0.14, hold: 0.055 },
];
const stationBuildingIds = ["bld-sagrada", "bld-batllo", "bld-guell", "bld-palau"];
let drawCursor = drawStart;
const stationArrivals = [];
const stationOverlayStarts = [];
const stationDepartures = [];

drawStops.forEach((stop) => {
  masterTL.to(
    pathDraw,
    {
      progress: stop.progress,
      duration: stop.travel,
      ease: "power3.out",
      onUpdate: updateDrawnPath,
    },
    drawCursor,
  );
  stationArrivals.push(drawCursor + stop.travel);
  drawCursor += stop.travel;
  stationOverlayStarts.push(drawCursor + 0.018);

  masterTL.to(
    pathDraw,
    {
      progress: stop.progress,
      duration: stop.hold,
      ease: "none",
      onUpdate: updateDrawnPath,
    },
    drawCursor,
  );
  stationDepartures.push(drawCursor + stop.hold);
  drawCursor += stop.hold;
});

masterTL.to("#dashed-path", { opacity: 1, duration: 0.05 }, 0.315);

// ── Phase 4: reveal buildings and info panels exactly at each stop ──
[
  {
    building: "#bld-sagrada",
    extras: ["#pulse-sagrada", "#dot-0", "#lbl-0"],
  },
  {
    building: "#bld-batllo",
    extras: ["#pulse-batllo", "#dot-1", "#lbl-1"],
  },
  {
    building: "#bld-guell",
    extras: ["#pulse-guell", "#dot-2", "#lbl-2"],
  },
  {
    building: "#bld-palau",
    extras: ["#pulse-palau", "#dot-3", "#lbl-3"],
  },
].forEach((station, index) => {
  masterTL.set(
    station.building,
    { opacity: 0.85, pointerEvents: "auto" },
    stationArrivals[index],
  );
  masterTL.set(
    station.extras,
    { opacity: 1, pointerEvents: "auto" },
    stationArrivals[index],
  );
  masterTL.call(
    () => window.openMapOverlayByBuildingId?.(stationBuildingIds[index]),
    [],
    stationOverlayStarts[index],
  );
  masterTL.call(
    () => window.closeMapOverlay?.(),
    [],
    stationDepartures[index],
  );
});

// ── Phase 5: white dot sticks to the drawn line endpoint ──
masterTL.to("#path-wagon", { opacity: 1, duration: 0.04 }, drawStart);

// ── Counter dots appear ──
masterTL.to("#station-counter", { opacity: 1, duration: 0.05 }, 0.36);

// ── Highlight counter dots as wagon passes stations ──
stationArrivals.forEach((p, i) => {
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
   DIRECT ENTRY TO MAP
───────────────────────────── */
function scrollToMapScene() {
  const wrapper = document.getElementById("scroll-wrapper");
  if (!wrapper) return;

  const scrollDistance = wrapper.offsetHeight - window.innerHeight;
  const mapProgress = 0.7;

  window.scrollTo({
    top: wrapper.offsetTop + scrollDistance * mapProgress,
    behavior: "auto",
  });
}

if (window.location.hash === "#map") {
  const goToMapWhenReady = () => {
    ScrollTrigger.refresh();
    requestAnimationFrame(scrollToMapScene);
  };

  if (document.readyState === "complete") {
    goToMapWhenReady();
  } else {
    window.addEventListener("load", goToMapWhenReady, { once: true });
  }
}

/* ─────────────────────────────
   WAGON WHEEL SPIN (CSS anim)
───────────────────────────── */
const style = document.createElement("style");
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
