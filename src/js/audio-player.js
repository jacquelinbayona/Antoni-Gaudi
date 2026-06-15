function initAudioGuide() {
  const audioBtn = document.querySelector(".audio-btn");
  const audioGuide = document.getElementById("audio-guide");

  if (!audioBtn || !audioGuide) return;

  audioBtn.addEventListener("click", () => {
    if (audioGuide.paused) {
      audioGuide.play().catch((err) => console.error(err));
      audioBtn.classList.add("playing");
      audioBtn.setAttribute("aria-pressed", "true");
    } else {
      audioGuide.pause();
      audioBtn.classList.remove("playing");
      audioBtn.setAttribute("aria-pressed", "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", initAudioGuide);
