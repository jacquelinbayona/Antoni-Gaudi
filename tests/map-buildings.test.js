/**
 * @jest-environment jsdom
 */

let mod;

beforeEach(() => {
  document.body.innerHTML = "";
  jest.resetModules();

  // Provide a #map-scene container the module appends overlays into
  const mapScene = document.createElement("div");
  mapScene.id = "map-scene";
  document.body.appendChild(mapScene);

  mod = require("../src/js/map-buildings");
});

/* ──────────────────────────────────
   buildingMap data integrity
────────────────────────────────── */
describe("buildingMap", () => {
  it("contains exactly four buildings", () => {
    expect(Object.keys(mod.buildingMap)).toHaveLength(4);
  });

  it.each(["bld-sagrada", "bld-batllo", "bld-guell", "bld-palau"])(
    "%s has required fields",
    (id) => {
      const info = mod.buildingMap[id];
      expect(info).toBeDefined();
      expect(info.pageUrl).toEqual(expect.any(String));
      expect(info.title).toEqual(expect.any(String));
      expect(info.date).toEqual(expect.any(String));
      expect(info.text).toEqual(expect.any(String));
      expect(info.overlaySide).toMatch(/^(left|right)$/);
      expect(info.dotId).toEqual(expect.any(String));
      expect(info.labelId).toEqual(expect.any(String));
      expect(Array.isArray(info.facts)).toBe(true);
      expect(info.facts.length).toBeGreaterThan(0);
    },
  );

  it("each fact is a [label, value] pair", () => {
    Object.values(mod.buildingMap).forEach((info) => {
      info.facts.forEach((fact) => {
        expect(fact).toHaveLength(2);
        expect(typeof fact[0]).toBe("string");
        expect(typeof fact[1]).toBe("string");
      });
    });
  });
});

/* ──────────────────────────────────
   createMapOverlay
────────────────────────────────── */
describe("createMapOverlay", () => {
  it("creates an aside element inside #map-scene", () => {
    const overlay = mod.createMapOverlay();
    expect(overlay.tagName).toBe("ASIDE");
    expect(overlay.id).toBe("map-info-overlay");
    expect(document.getElementById("map-info-overlay")).toBe(overlay);
  });

  it("starts hidden with aria-hidden=true", () => {
    const overlay = mod.createMapOverlay();
    expect(overlay.classList.contains("hidden")).toBe(true);
    expect(overlay.getAttribute("aria-hidden")).toBe("true");
  });

  it("contains a close button, title, date, text, facts, and link", () => {
    const overlay = mod.createMapOverlay();
    expect(overlay.querySelector(".map-info-close")).not.toBeNull();
    expect(overlay.querySelector("h2")).not.toBeNull();
    expect(overlay.querySelector(".map-info-date")).not.toBeNull();
    expect(overlay.querySelector(".map-info-text")).not.toBeNull();
    expect(overlay.querySelector(".map-info-facts")).not.toBeNull();
    expect(overlay.querySelector(".map-info-link")).not.toBeNull();
  });
});

/* ──────────────────────────────────
   openMapOverlay
────────────────────────────────── */
describe("openMapOverlay", () => {
  const sagrada = {
    pageUrl: "sagradafamilia.html",
    title: "Sagrada Família",
    overlaySide: "right",
    date: "1882 — En cours",
    text: "A great building.",
    facts: [
      ["Hauteur", "172 m"],
      ["Style", "Modernisme catalan"],
    ],
  };

  it("populates overlay content from info object", () => {
    mod.openMapOverlay(sagrada);

    const overlay = document.getElementById("map-info-overlay");
    expect(overlay.querySelector("h2").textContent).toBe(sagrada.title);
    expect(overlay.querySelector(".map-info-date").textContent).toBe(sagrada.date);
    expect(overlay.querySelector(".map-info-text").textContent).toBe(sagrada.text);
    expect(overlay.querySelector(".map-info-link").href).toContain(sagrada.pageUrl);
  });

  it("renders facts as sections with h3 and p", () => {
    mod.openMapOverlay(sagrada);

    const overlay = document.getElementById("map-info-overlay");
    const sections = overlay.querySelectorAll(".map-info-facts section");
    expect(sections).toHaveLength(2);
    expect(sections[0].querySelector("h3").textContent).toBe("Hauteur");
    expect(sections[0].querySelector("p").textContent).toBe("172 m");
  });

  it("removes hidden class and sets aria-hidden to false", () => {
    mod.openMapOverlay(sagrada);

    const overlay = document.getElementById("map-info-overlay");
    expect(overlay.classList.contains("hidden")).toBe(false);
    expect(overlay.getAttribute("aria-hidden")).toBe("false");
  });

  it("positions right-side overlay correctly", () => {
    mod.openMapOverlay(sagrada);

    const overlay = document.getElementById("map-info-overlay");
    expect(overlay.classList.contains("is-right")).toBe(true);
    expect(overlay.classList.contains("is-left")).toBe(false);
    expect(overlay.style.left).toBe("auto");
  });

  it("positions left-side overlay correctly", () => {
    const leftInfo = { ...sagrada, overlaySide: "left" };
    mod.openMapOverlay(leftInfo);

    const overlay = document.getElementById("map-info-overlay");
    expect(overlay.classList.contains("is-left")).toBe(true);
    expect(overlay.classList.contains("is-right")).toBe(false);
    expect(overlay.style.right).toBe("auto");
  });

  it("reuses existing overlay on subsequent calls", () => {
    mod.openMapOverlay(sagrada);
    const first = document.getElementById("map-info-overlay");

    mod.openMapOverlay({ ...sagrada, title: "Updated" });
    const second = document.getElementById("map-info-overlay");

    expect(second).toBe(first);
    expect(second.querySelector("h2").textContent).toBe("Updated");
  });
});

/* ──────────────────────────────────
   closeMapOverlay
────────────────────────────────── */
describe("closeMapOverlay", () => {
  it("does not throw when called before any overlay is opened", () => {
    expect(() => mod.closeMapOverlay()).not.toThrow();
  });

  it("adds hidden class and sets aria-hidden to true", () => {
    mod.openMapOverlay(mod.buildingMap["bld-sagrada"]);
    mod.closeMapOverlay();

    const overlay = document.getElementById("map-info-overlay");
    expect(overlay.classList.contains("hidden")).toBe(true);
    expect(overlay.getAttribute("aria-hidden")).toBe("true");
  });
});

/* ──────────────────────────────────
   openMapOverlayByBuildingId
────────────────────────────────── */
describe("openMapOverlayByBuildingId", () => {
  it("opens overlay for a valid building id", () => {
    mod.openMapOverlayByBuildingId("bld-batllo");

    const overlay = document.getElementById("map-info-overlay");
    expect(overlay.querySelector("h2").textContent).toBe("Casa Batlló");
  });

  it("does nothing for an unknown building id", () => {
    mod.openMapOverlayByBuildingId("bld-unknown");
    expect(document.getElementById("map-info-overlay")).toBeNull();
  });
});

/* ──────────────────────────────────
   bindMapInfoTrigger
────────────────────────────────── */
describe("bindMapInfoTrigger", () => {
  it("opens overlay on element click", () => {
    const btn = document.createElement("button");
    document.body.appendChild(btn);

    mod.bindMapInfoTrigger(btn, mod.buildingMap["bld-guell"]);
    btn.click();

    const overlay = document.getElementById("map-info-overlay");
    expect(overlay.querySelector("h2").textContent).toBe("Park Güell");
  });

  it("does not throw when element is null", () => {
    expect(() => mod.bindMapInfoTrigger(null, mod.buildingMap["bld-guell"])).not.toThrow();
  });
});

/* ──────────────────────────────────
   Escape key closes overlay
────────────────────────────────── */
describe("keyboard interaction", () => {
  it("closes overlay on Escape key", () => {
    mod.openMapOverlayByBuildingId("bld-palau");

    const overlay = document.getElementById("map-info-overlay");
    expect(overlay.classList.contains("hidden")).toBe(false);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(overlay.classList.contains("hidden")).toBe(true);
  });
});
