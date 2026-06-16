function initAudioGuide() {
  const audioBtn = document.querySelector(".audio-btn");
  const audioGuide = document.getElementById("audio-guide");

  if (!audioBtn || !audioGuide) return;

  audioBtn.addEventListener("click", () => {
    if (audioGuide.paused) {
      audioGuide
        .play()
        .then(() => {
          audioBtn.classList.add("playing");
          audioBtn.setAttribute("aria-pressed", "true");
        })
        .catch((err) => {
          console.error("Audio playback failed:", err);
          audioBtn.classList.remove("playing");
          audioBtn.setAttribute("aria-pressed", "false");
        });
    } else {
      audioGuide.pause();
      audioBtn.classList.remove("playing");
      audioBtn.setAttribute("aria-pressed", "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", initAudioGuide);
