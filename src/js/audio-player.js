console.log("audio-player.js chargé");
function initAudioGuide() {
  const audioBtn = document.querySelector(".audio-btn");
  const audioGuide = document.getElementById("audio-guide");

  console.log("Audio init:", audioBtn, audioGuide);

  if (!audioBtn || !audioGuide) return;

  audioBtn.addEventListener("click", () => {
    console.log("click audio");

    if (audioGuide.paused) {
      audioGuide
        .play()
        .then(() => console.log("playing"))
        .catch((err) => console.error("play error:", err));

      audioBtn.classList.add("playing");
      audioBtn.setAttribute("aria-pressed", "true");
    } else {
      audioGuide.pause();

      audioBtn.classList.remove("playing");
      audioBtn.setAttribute("aria-pressed", "false");
    }
  });

  audioGuide.addEventListener("ended", () => {
    audioBtn.classList.remove("playing");
    audioBtn.setAttribute("aria-pressed", "false");
  });
}

window.initAudioGuide = initAudioGuide;
