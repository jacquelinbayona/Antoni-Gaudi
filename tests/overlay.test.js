/**
 * @jest-environment jsdom
 */

let mod;

function setupDOM() {
  document.body.innerHTML = `
    <div class="overlay hidden" style="opacity: 0;">
      <div class="overlay-content">
        <p>Overlay content</p>
      </div>
    </div>
    <button id="openOverlay">Open</button>
    <button class="close-overlay">Close</button>
  `;
}

beforeEach(() => {
  document.body.innerHTML = "";
  jest.resetModules();
});

describe("initOverlay", () => {
  it("does not throw when overlay elements are missing", () => {
    mod = require("../src/js/overlay");
    expect(() => mod.initOverlay()).not.toThrow();
  });

  it("opens overlay on open button click", () => {
    setupDOM();
    mod = require("../src/js/overlay");
    mod.initOverlay();

    const overlay = document.querySelector(".overlay");
    const openBtn = document.getElementById("openOverlay");

    openBtn.click();

    expect(overlay.classList.contains("hidden")).toBe(false);
    expect(overlay.style.opacity).toBe("1");
  });

  it("closes overlay on close button click", () => {
    setupDOM();
    mod = require("../src/js/overlay");
    mod.initOverlay();

    const overlay = document.querySelector(".overlay");
    const openBtn = document.getElementById("openOverlay");
    const closeBtn = document.querySelector(".close-overlay");

    openBtn.click();
    expect(overlay.classList.contains("hidden")).toBe(false);

    closeBtn.click();
    expect(overlay.classList.contains("hidden")).toBe(true);
    expect(overlay.style.opacity).toBe("0");
  });

  it("closes overlay when clicking on background", () => {
    setupDOM();
    mod = require("../src/js/overlay");
    mod.initOverlay();

    const overlay = document.querySelector(".overlay");
    const openBtn = document.getElementById("openOverlay");

    openBtn.click();
    expect(overlay.classList.contains("hidden")).toBe(false);

    // Click directly on the overlay background (not a child)
    overlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(overlay.classList.contains("hidden")).toBe(true);
    expect(overlay.style.opacity).toBe("0");
  });

  it("does not close when clicking inside overlay content", () => {
    setupDOM();
    mod = require("../src/js/overlay");
    mod.initOverlay();

    const overlay = document.querySelector(".overlay");
    const openBtn = document.getElementById("openOverlay");
    const content = overlay.querySelector(".overlay-content");

    openBtn.click();

    // Click on inner content — event target is the child, not the overlay itself
    content.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(overlay.classList.contains("hidden")).toBe(false);
  });

  it("closes overlay on Escape key", () => {
    setupDOM();
    mod = require("../src/js/overlay");
    mod.initOverlay();

    const overlay = document.querySelector(".overlay");
    const openBtn = document.getElementById("openOverlay");

    openBtn.click();
    expect(overlay.classList.contains("hidden")).toBe(false);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(overlay.classList.contains("hidden")).toBe(true);
    expect(overlay.style.opacity).toBe("0");
  });

  it("does not close on Escape if overlay is already hidden", () => {
    setupDOM();
    mod = require("../src/js/overlay");
    mod.initOverlay();

    const overlay = document.querySelector(".overlay");

    // Overlay is hidden initially — Escape should not change opacity to "0" again
    // (it's already "0"), and hidden class should stay
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(overlay.classList.contains("hidden")).toBe(true);
  });

  it("ignores non-Escape keys", () => {
    setupDOM();
    mod = require("../src/js/overlay");
    mod.initOverlay();

    const overlay = document.querySelector(".overlay");
    const openBtn = document.getElementById("openOverlay");

    openBtn.click();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(overlay.classList.contains("hidden")).toBe(false);
  });
});
