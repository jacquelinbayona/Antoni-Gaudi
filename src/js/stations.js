/* ──── STATION DATA ──── */
const STATIONS = [
  {
    tag: "Station 01 · Eixample",
    title: "La Sagrada Família",
    year: "1882 — en cours",
    desc: "Chef-d'œuvre absolu de Gaudí, cette basilique catholique mêle gothique et Art nouveau de manière entièrement organique. Ses façades racontent la vie du Christ en pierre sculptée. L'intérieur, éclairé par des milliers de vitraux colorés, crée une forêt de lumière kaléidoscopique qui change selon les heures. Inachevée à la mort de Gaudí en 1926, la construction se poursuit encore aujourd'hui.",
    archi: "Antoni Gaudí",
    style: "Modernisme catalan",
    height: "172 m (prévu)",
    classement: "UNESCO 2005",
    icon: "S·F",
    colors: [
      "#C4622D",
      "#D4A843",
      "#1A3F8F",
      "#3A6B4A",
      "#A83228",
      "#E8803A",
      "#F5EAD8",
    ],
  },
  {
    tag: "Station 02 · Passeig de Gràcia",
    title: "Casa Batlló",
    year: "1904 — 1906",
    desc: "Rénovation radicale d'un immeuble bourgeois, la Casa Batlló est une ode à la mer, aux dragons et aux os humains. Sa façade recouverte de mosaïques de verre irisées évoque des écailles de lézard sous la lumière catalane. Son toit ondulé en forme de dos de dragon défie toute convention. Gaudí a conçu chaque détail, des poignées de portes aux rampes d'escalier.",
    archi: "Antoni Gaudí",
    style: "Art nouveau · Modernisme",
    height: "32 m",
    classement: "UNESCO 2005",
    icon: "C·B",
    colors: [
      "#1A3F8F",
      "#4A9FD4",
      "#FFDE21",
      "#7AB8E4",
      "#1A2A6A",
      "#B8D4E8",
      "#ECF4FF",
    ],
  },
  {
    tag: "Station 03 · Gràcia",
    title: "Park Güell",
    year: "1900 — 1914",
    desc: "Conçu comme une cité-jardin utopique pour la bourgeoisie barcelonaise, le Park Güell n'a jamais rempli sa fonction d'origine — seulement deux maisons furent construites. Devenu parc public en 1926, il éblouit par ses mosaïques trencadís (tessons de céramique), ses colonnes gréco-romaines revisitées, et sa grande esplanade avec la célèbre salamandre multicolore à l'entrée.",
    archi: "Antoni Gaudí",
    style: "Modernisme organique",
    height: "—",
    classement: "UNESCO 1984",
    icon: "P·G",
    colors: [
      "#3A6B4A",
      "#FFDE21",
      "#C4622D",
      "#1A3F8F",
      "#6B3A8B",
      "#8BC44A",
      "#D4F0A0",
    ],
  },
  {
    tag: "Station 04 · Passeig de Gràcia",
    title: "La Pedrera",
    year: "1906 — 1912",
    desc: " Aussi appelée Casa Milà, cette résidence privée est célèbre pour sa façade de pierre ondulante et ses balcons en fer forgé qui ressemblent à des algues marines. Le toit-terrasse, avec ses cheminées sculpturales surnommées 'les guerriers', offre une vue imprenable sur la ville. La Pedrera incarne la vision de Gaudí d'une architecture vivante, où chaque élément est à la fois fonctionnel et artistique.",
    archi: "Antoni Gaudí · Casa Milà",
    style: "Art nouveau · Modernisme",
    height: "47 m",
    classement: "UNESCO 1984",
    icon: "L·P",
    colors: [
      "#FFDE21",
      "#C4622D",
      "#1A3F8F",
      "#8B3A8B",
      "#3A6B4A",
      "#FFB830",
      "#FFF0A0",
    ],
  },
];
const container = document.querySelector(".stations-container");

function renderStations() {
  container.innerHTML = "";

  STATIONS.forEach((station, index) => {
    const card = document.createElement("div");
    card.classList.add("station-card");

    card.innerHTML = `
      <div class="station-icon">${station.icon}</div>
      <div class="station-meta">
        <p class="tag">${station.tag}</p>
        <h3>${station.title}</h3>
        <p class="year">${station.year}</p>
      </div>
    `;

    card.addEventListener("click", () => openOverlay(station));

    container.appendChild(card);
  });
}

renderStations();
const overlay = document.querySelector(".detail-overlay");
const overlayContent = document.querySelector(".overlay-content");

function openOverlay(station) {
  overlayContent.innerHTML = `
    <div class="overlay-header">
      <span class="tag">${station.tag}</span>
      <h2>${station.title}</h2>
      <p class="year">${station.year}</p>
    </div>

    <div class="overlay-body">
      <p class="desc">${station.desc}</p>

      <div class="info-grid">
        <div><strong>Architecte</strong><p>${station.archi}</p></div>
        <div><strong>Style</strong><p>${station.style}</p></div>
        <div><strong>Hauteur</strong><p>${station.height}</p></div>
        <div><strong>UNESCO</strong><p>${station.classement}</p></div>
      </div>

      <div class="color-palette">
        ${station.colors.map((c) => `<span style="background:${c}"></span>`).join("")}
      </div>
    </div>
  `;

  overlay.classList.add("active");
}
document.querySelector(".overlay-close").addEventListener("click", () => {
  overlay.classList.remove("active");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("active");
  }
});
document.querySelector(".overlay-close").addEventListener("click", () => {
  overlay.classList.remove("active");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("active");
  }
});

/* ──── PAGE-LEVEL OVERLAY (Building pages like Sagrada Familia) ──── */
const pageOverlay = document.querySelector(".overlay");
const openOverlayBtn = document.getElementById("openOverlay");
const closeOverlayBtn = document.querySelector(".close-overlay");

if (openOverlayBtn) {
  openOverlayBtn.addEventListener("click", () => {
    pageOverlay.classList.remove("hidden");
  });
}

if (closeOverlayBtn) {
  closeOverlayBtn.addEventListener("click", () => {
    pageOverlay.classList.add("hidden");
  });
}

if (pageOverlay) {
  pageOverlay.addEventListener("click", (e) => {
    if (e.target === pageOverlay) {
      pageOverlay.classList.add("hidden");
    }
  });
}
