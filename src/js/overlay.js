// Overlay functionality for building pages
function initOverlay() {
  const overlay = document.querySelector(".overlay");
  const openBtn = document.getElementById("openOverlay");
  const closeBtn = document.querySelector(".close-overlay");

  if (!overlay || !openBtn || !closeBtn) {
    console.warn("Overlay elements not found on this page");
    return;
  }

  // Open overlay
  openBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    overlay.style.opacity = "1";
  });

  // Close overlay
  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    overlay.style.opacity = "0";
  });

  // Close when clicking on overlay background
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
      overlay.style.opacity = "0";
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
      overlay.classList.add("hidden");
      overlay.style.opacity = "0";
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOverlay);
} else {
  initOverlay();
}
