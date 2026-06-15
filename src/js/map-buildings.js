// Map buildings to their corresponding pages
const buildingMap = {
  "bld-batllo": "casabatllo.html",
  "bld-palau": "lapedrera.html",
  "bld-guell": "parcguell.html",
  "bld-sagrada": "sagradafamilia.html",
};

function initBuildingLinks() {
  Object.entries(buildingMap).forEach(([buildingId, pageUrl]) => {
    const building = document.getElementById(buildingId);

    if (building) {
      // Make clickable
      building.style.cursor = "pointer";

      // Add hover effect
      building.addEventListener("mouseenter", () => {
        building.style.opacity = "1";
        building.style.filter = "url(#glow-f)";
      });

      building.addEventListener("mouseleave", () => {
        building.style.opacity = "0";
        building.style.filter = "url(#soft-glow)";
      });

      // Navigate to building page
      building.addEventListener("click", () => {
        window.location.href = pageUrl;
      });
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBuildingLinks);
} else {
  initBuildingLinks();
}
