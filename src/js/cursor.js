/* ──── CUSTOM CURSOR ──── */
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.15,
    ease: "power2.out",
  });
});
document.querySelectorAll("button, .st-dot, .detail-close").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
});
