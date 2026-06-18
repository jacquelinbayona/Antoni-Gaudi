function initAudioGuide() {
  const audioBtn = document.querySelector(".audio-btn");
  const audioGuide = document.getElementById("audio-guide");

  console.log("init audio:", audioBtn, audioGuide);

  if (!audioBtn || !audioGuide) return;

  audioBtn.addEventListener("click", () => {
    console.log("click audio");

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

onReady(initAudioGuide);
