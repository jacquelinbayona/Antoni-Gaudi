const buildingMap = {
  "bld-sagrada": {
    pageUrl: "sagradafamilia.html",
    dotId: "dot-0",
    labelId: "lbl-0",
    title: "Sagrada Família",
    overlaySide: "right",
    date: "1882 — En cours",
    text: "Chef-d'œuvre absolu de Gaudí, cette basilique catholique mêle gothique et Art nouveau de manière entièrement organique. Ses façades racontent la vie du Christ en pierre sculptée.",
    facts: [
      ["Hauteur", "172 m"],
      ["Style", "Modernisme catalan"],
      ["Classement", "UNESCO 2005"],
    ],
  },
  "bld-batllo": {
    pageUrl: "casabatllo.html",
    dotId: "dot-1",
    labelId: "lbl-1",
    title: "Casa Batlló",
    overlaySide: "left",
    date: "1904 — 1906",
    text: "Rénovation radicale d'un immeuble bourgeois, la Casa Batlló est une ode à la mer, aux dragons et aux formes organiques. Sa façade de mosaïques irisées change avec la lumière.",
    facts: [
      ["Hauteur", "32 m"],
      ["Style", "Art nouveau"],
      ["Classement", "UNESCO 2005"],
    ],
  },
  "bld-guell": {
    pageUrl: "parcguell.html",
    dotId: "dot-2",
    labelId: "lbl-2",
    title: "Park Güell",
    overlaySide: "left",
    date: "1900 — 1914",
    text: "Conçu comme une cité-jardin utopique, le Park Güell est devenu un parc public où les mosaïques trencadís, les colonnes et les formes courbes composent un monde à part.",
    facts: [
      ["Surface", "17 ha"],
      ["Style", "Modernisme organique"],
      ["Classement", "UNESCO 1984"],
    ],
  },
  "bld-palau": {
    pageUrl: "lapedrera.html",
    dotId: "dot-3",
    labelId: "lbl-3",
    title: "La Pedrera",
    overlaySide: "right",
    date: "1906 — 1912",
    text: "Aussi appelée Casa Milà, cette résidence est célèbre pour sa façade de pierre ondulante et ses balcons en fer forgé. Son toit-terrasse transforme les cheminées en sculptures.",
    facts: [
      ["Hauteur", "47 m"],
      ["Style", "Modernisme"],
      ["Classement", "UNESCO 1984"],
    ],
  },
};

let activeMapOverlay = null;

function createMapOverlay() {
  const overlay = document.createElement("aside");
  overlay.id = "map-info-overlay";
  overlay.className = "map-info-overlay hidden";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <button class="map-info-close" type="button" aria-label="Fermer">×</button>
    <div class="map-info-content">
      <p class="map-info-date"></p>
      <h2></h2>
      <p class="map-info-text"></p>
      <div class="map-info-facts"></div>
      <a class="map-info-link" href="#">Lire l'information complète</a>
    </div>
  `;

  document.getElementById("map-scene")?.appendChild(overlay);
  overlay
    .querySelector(".map-info-close")
    ?.addEventListener("click", closeMapOverlay);
  return overlay;
}

function openMapOverlay(info) {
  const overlay = activeMapOverlay || createMapOverlay();
  activeMapOverlay = overlay;
  const isLeft = info.overlaySide === "left";

  overlay.querySelector(".map-info-date").textContent = info.date;
  overlay.querySelector("h2").textContent = info.title;
  overlay.querySelector(".map-info-text").textContent = info.text;
  overlay.querySelector(".map-info-link").href = info.pageUrl;
  overlay.querySelector(".map-info-facts").innerHTML = info.facts
    .map(([label, value]) => `<section><h3>${label}</h3><p>${value}</p></section>`)
    .join("");

  overlay.classList.toggle("is-left", isLeft);
  overlay.classList.toggle("is-right", !isLeft);
  overlay.style.left = isLeft ? "clamp(24px, 5vw, 80px)" : "auto";
  overlay.style.right = isLeft ? "auto" : "clamp(24px, 5vw, 80px)";
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

function closeMapOverlay() {
  if (!activeMapOverlay) return;
  activeMapOverlay.classList.add("hidden");
  activeMapOverlay.setAttribute("aria-hidden", "true");
}

function openMapOverlayByBuildingId(buildingId) {
  const info = buildingMap[buildingId];
  if (!info) return;
  openMapOverlay(info);
}

function bindMapInfoTrigger(element, info) {
  if (!element) return;

  element.addEventListener("click", (event) => {
    event.preventDefault();
    openMapOverlay(info);
  });
}

function initBuildingLinks() {
  Object.entries(buildingMap).forEach(([buildingId, info]) => {
    const building = document.getElementById(buildingId);

    if (building) {
      building.style.cursor = "pointer";
      building.style.pointerEvents = "none";

      building.addEventListener("mouseenter", () => {
        if (Number.parseFloat(getComputedStyle(building).opacity) === 0) return;
        building.style.opacity = "1";
        building.style.filter = "url(#glow-f)";
      });

      building.addEventListener("mouseleave", () => {
        if (Number.parseFloat(getComputedStyle(building).opacity) === 0) return;
        building.style.opacity = "0.85";
        building.style.filter = "url(#soft-glow)";
      });
    }

    bindMapInfoTrigger(building, info);
    bindMapInfoTrigger(document.getElementById(info.dotId), info);
    bindMapInfoTrigger(document.getElementById(info.labelId), info);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMapOverlay();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBuildingLinks);
} else {
  initBuildingLinks();
}

window.openMapOverlayByBuildingId = openMapOverlayByBuildingId;
window.closeMapOverlay = closeMapOverlay;

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    buildingMap,
    createMapOverlay,
    openMapOverlay,
    closeMapOverlay,
    openMapOverlayByBuildingId,
    bindMapInfoTrigger,
    initBuildingLinks,
  };
}
