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
    showOverlay(overlay);
    document.body.classList.add("overlay-open");
  }

  function closeOverlay() {
    hideOverlay(overlay);
    document.body.classList.remove("overlay-open");
  }

  openBtn.addEventListener("click", openOverlay);
  closeBtn.addEventListener("click", closeOverlay);
  bindOverlayDismiss(overlay, closeOverlay);
}

onReady(initOverlay);
