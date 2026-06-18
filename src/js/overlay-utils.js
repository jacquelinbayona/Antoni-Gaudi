/**
 * Shared helpers for opening / closing overlay panels.
 * Used by both overlay.js (building page) and map-buildings.js (map info panel).
 */

function showOverlay(overlay) {
  overlay.classList.remove("hidden");
  overlay.style.opacity = "1";
  overlay.setAttribute("aria-hidden", "false");
}

function hideOverlay(overlay) {
  overlay.classList.add("hidden");
  overlay.style.opacity = "0";
  overlay.setAttribute("aria-hidden", "true");
}

function bindOverlayDismiss(overlay, closeFn) {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeFn();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
      closeFn();
    }
  });
}
