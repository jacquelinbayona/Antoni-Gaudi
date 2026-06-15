/**
 * @jest-environment jsdom
 */

let mod;

beforeEach(() => {
  document.body.innerHTML = "";
  jest.resetModules();

  // Stub canvas getContext since jsdom does not support it
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    setTransform: jest.fn(),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
  });

  mod = require("../src/js/trencadis-fond");
});

/* ──────────────────────────────────
   hexVersRgb
────────────────────────────────── */
describe("hexVersRgb", () => {
  it("converts a hex colour string to [r, g, b]", () => {
    expect(mod.hexVersRgb("#ff8800")).toEqual([255, 136, 0]);
  });

  it("converts black", () => {
    expect(mod.hexVersRgb("#000000")).toEqual([0, 0, 0]);
  });

  it("converts white", () => {
    expect(mod.hexVersRgb("#ffffff")).toEqual([255, 255, 255]);
  });

  it("converts each palette colour without NaN", () => {
    mod.COULEURS.forEach((hex) => {
      const [r, g, b] = mod.hexVersRgb(hex);
      expect(Number.isNaN(r)).toBe(false);
      expect(Number.isNaN(g)).toBe(false);
      expect(Number.isNaN(b)).toBe(false);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(255);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(255);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(255);
    });
  });
});

/* ──────────────────────────────────
   fragmentPolygone
────────────────────────────────── */
describe("fragmentPolygone", () => {
  // Deterministic RNG for reproducible tests
  const makeRng = (seed = 1) => {
    return () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };
  };

  it("returns an array of [x, y] points", () => {
    const pts = mod.fragmentPolygone(100, 100, 20, makeRng());
    expect(Array.isArray(pts)).toBe(true);
    pts.forEach((pt) => {
      expect(pt).toHaveLength(2);
      expect(typeof pt[0]).toBe("number");
      expect(typeof pt[1]).toBe("number");
    });
  });

  it("generates 4 to 7 vertices", () => {
    // Run multiple times with different seeds
    for (let s = 0; s < 20; s++) {
      const pts = mod.fragmentPolygone(50, 50, 15, makeRng(s));
      expect(pts.length).toBeGreaterThanOrEqual(4);
      expect(pts.length).toBeLessThanOrEqual(7);
    }
  });

  it("generates points near the centre", () => {
    const cx = 200;
    const cy = 300;
    const taille = 30;
    const pts = mod.fragmentPolygone(cx, cy, taille, makeRng());

    pts.forEach(([x, y]) => {
      const dist = Math.hypot(x - cx, y - cy);
      // Points should be within taille of the centre
      expect(dist).toBeLessThanOrEqual(taille * 1.1);
    });
  });

  it("produces different polygons with different seeds", () => {
    const pts1 = mod.fragmentPolygone(100, 100, 20, makeRng(1));
    const pts2 = mod.fragmentPolygone(100, 100, 20, makeRng(42));
    // With different seeds, at least one point should differ
    const same = pts1.length === pts2.length && pts1.every(
      (pt, i) => pt[0] === pts2[i][0] && pt[1] === pts2[i][1],
    );
    expect(same).toBe(false);
  });
});

/* ──────────────────────────────────
   COULEURS palette
────────────────────────────────── */
describe("COULEURS", () => {
  it("contains at least 10 colours", () => {
    expect(mod.COULEURS.length).toBeGreaterThanOrEqual(10);
  });

  it("every entry is a valid 7-char hex colour", () => {
    mod.COULEURS.forEach((c) => {
      expect(c).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

/* ──────────────────────────────────
   initTrencadis
────────────────────────────────── */
describe("initTrencadis", () => {
  beforeEach(() => {
    // Mock requestAnimationFrame to prevent infinite loop
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(() => 0);
  });

  afterEach(() => {
    window.requestAnimationFrame.mockRestore();
  });

  it("creates a canvas element in the document body", () => {
    mod.initTrencadis();
    const canvas = document.getElementById("trencadis-fond");
    expect(canvas).not.toBeNull();
    expect(canvas.tagName).toBe("CANVAS");
  });

  it("sets the canvas as the first child of body", () => {
    const existing = document.createElement("div");
    existing.id = "existing";
    document.body.appendChild(existing);

    mod.initTrencadis();
    expect(document.body.firstChild.id).toBe("trencadis-fond");
  });

  it("applies fixed positioning styles", () => {
    mod.initTrencadis();
    const canvas = document.getElementById("trencadis-fond");
    expect(canvas.style.position).toBe("fixed");
    expect(canvas.style.pointerEvents).toBe("none");
  });

  it("is exposed on window", () => {
    expect(typeof window.initTrencadis).toBe("function");
  });
});
