gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ─────────────────────────────
   CUSTOM CURSOR
───────────────────────────── */
const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.15,
    ease: "power2.out",
  });
});
