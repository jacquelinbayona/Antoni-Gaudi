/**
 * @jest-environment jsdom
 */

let mod;

function setupDOM(paused = true) {
  document.body.innerHTML = `
    <button class="audio-btn" aria-pressed="false">Play</button>
    <audio id="audio-guide" src="test.mp3"></audio>
  `;

  const audioGuide = document.getElementById("audio-guide");

  // jsdom's HTMLMediaElement.paused is a read-only getter, so we redefine it
  let _paused = paused;
  Object.defineProperty(audioGuide, "paused", {
    get: () => _paused,
    configurable: true,
  });

  audioGuide.play = jest.fn().mockImplementation(() => {
    _paused = false;
    return Promise.resolve();
  });
  audioGuide.pause = jest.fn().mockImplementation(() => {
    _paused = true;
  });

  return { audioGuide, audioBtn: document.querySelector(".audio-btn") };
}

beforeEach(() => {
  document.body.innerHTML = "";
  jest.resetModules();
});

describe("initAudioGuide", () => {
  it("does not throw when audio elements are missing", () => {
    mod = require("../src/js/audio-player");
    expect(() => mod.initAudioGuide()).not.toThrow();
  });

  it("toggles play on first click", () => {
    const { audioGuide, audioBtn } = setupDOM(true);
    mod = require("../src/js/audio-player");
    mod.initAudioGuide();

    audioBtn.click();

    expect(audioGuide.play).toHaveBeenCalled();
    expect(audioBtn.classList.contains("playing")).toBe(true);
    expect(audioBtn.getAttribute("aria-pressed")).toBe("true");
  });

  it("toggles pause on second click", () => {
    const { audioGuide, audioBtn } = setupDOM(true);
    mod = require("../src/js/audio-player");
    mod.initAudioGuide();

    // First click → play
    audioBtn.click();
    expect(audioGuide.play).toHaveBeenCalledTimes(1);

    // Second click → pause (paused is now false after play mock)
    audioBtn.click();
    expect(audioGuide.pause).toHaveBeenCalledTimes(1);
    expect(audioBtn.classList.contains("playing")).toBe(false);
    expect(audioBtn.getAttribute("aria-pressed")).toBe("false");
  });

  it("handles play() rejection gracefully", () => {
    document.body.innerHTML = `
      <button class="audio-btn" aria-pressed="false">Play</button>
      <audio id="audio-guide" src="test.mp3"></audio>
    `;
    const audioGuide = document.getElementById("audio-guide");
    Object.defineProperty(audioGuide, "paused", {
      get: () => true,
      configurable: true,
    });
    audioGuide.play = jest.fn().mockRejectedValue(new Error("not allowed"));
    audioGuide.pause = jest.fn();

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mod = require("../src/js/audio-player");
    mod.initAudioGuide();

    const audioBtn = document.querySelector(".audio-btn");
    audioBtn.click();

    expect(audioGuide.play).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("adds playing class and aria-pressed when starting playback", () => {
    const { audioGuide, audioBtn } = setupDOM(true);
    mod = require("../src/js/audio-player");
    mod.initAudioGuide();

    audioBtn.click();

    expect(audioBtn.classList.contains("playing")).toBe(true);
    expect(audioBtn.getAttribute("aria-pressed")).toBe("true");
  });

  it("removes playing class and resets aria-pressed when pausing", () => {
    // Start in playing state (paused = false)
    const { audioGuide, audioBtn } = setupDOM(false);
    mod = require("../src/js/audio-player");
    mod.initAudioGuide();

    audioBtn.click();

    expect(audioGuide.pause).toHaveBeenCalled();
    expect(audioBtn.classList.contains("playing")).toBe(false);
    expect(audioBtn.getAttribute("aria-pressed")).toBe("false");
  });
});
