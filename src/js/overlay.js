// Overlay functionality for building pages
function initOverlay() {
  const overlay = document.querySelector(".overlay");
  const openBtn = document.getElementById("openOverlay");
  const closeBtn = document.querySelector(".close-overlay");

  if (!overlay || !openBtn || !closeBtn) {
    console.warn("Overlay elements not found on this page");
    return;
  }

  function openOverlay() {
    overlay.classList.remove("hidden");
    overlay.style.opacity = "1";
    document.body.classList.add("overlay-open");
  }

  function closeOverlay() {
    overlay.classList.add("hidden");
    overlay.style.opacity = "0";
    document.body.classList.remove("overlay-open");
  }

  // Open overlay
  openBtn.addEventListener("click", openOverlay);

  // Close overlay
  closeBtn.addEventListener("click", closeOverlay);

  // Close when clicking on overlay background
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
      closeOverlay();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOverlay);
} else {
  initOverlay();
}
