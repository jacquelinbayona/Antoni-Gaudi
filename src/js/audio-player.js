const AUDIO_FILES = {
  fr: {
    sagradafamilia: "audio/sagradafamilia.mp3",
    casabatllo: "audio/casa-fr.mp3",
    parcguell: "audio/parc-fr.mp3",
    lapedrera: "audio/pedrera-fr.mp3",
  },
  en: {
    sagradafamilia: "audio/sagrada-en.mp3",
    casabatllo: "audio/casa-en.mp3",
    parcguell: "audio/parkc-en.mp3",
    lapedrera: "audio/pedrera-en.mp3",
  },
  es: {
    sagradafamilia: "audio/sagrada-es.mp3",
    casabatllo: "audio/casa-es.mp3",
    parcguell: "audio/parc-es.mp3",
    lapedrera: "audio/pedreraspanish.mp3",
  },
  ca: {
    sagradafamilia: "audio/sagradafamilia.mp3",
    casabatllo: "audio/casa-fr.mp3",
    parcguell: "audio/parc-fr.mp3",
    lapedrera: "audio/pedrera-fr.mp3",
  },
};

function getCurrentLang() {
  return localStorage.getItem("lang") || "fr";
}

function getAudioPageKey() {
  return (
    document.body?.dataset?.audioPage || document.body?.dataset?.station || ""
  );
}

function getAudioSourceForPage() {
  const pageKey = getAudioPageKey();
  const lang = getCurrentLang();
  const map = AUDIO_FILES[lang] || AUDIO_FILES.fr;
  return map[pageKey] || map.sagradafamilia || "";
}

function updateAudioButtonState(audioBtn, audioGuide, isPlaying) {
  if (!audioBtn) return;
  audioBtn.classList.toggle("playing", isPlaying);
  audioBtn.setAttribute("aria-pressed", String(isPlaying));
}

function playAudioGuide(audioBtn, audioGuide) {
  if (!audioBtn || !audioGuide) return;

  const nextSrc = getAudioSourceForPage();
  if (!nextSrc) return;

  if (audioGuide.src && audioGuide.src.endsWith(nextSrc)) {
    // same file: just play/pause
  } else {
    audioGuide.src = nextSrc;
    audioGuide.load();
  }

  audioGuide
    .play()
    .then(() => updateAudioButtonState(audioBtn, audioGuide, true))
    .catch((error) => {
      console.warn("Audio playback failed:", error);
      updateAudioButtonState(audioBtn, audioGuide, false);
    });
}

function toggleAudioGuide() {
  const audioBtn = document.querySelector(".audio-btn");
  const audioGuide = document.getElementById("audio-guide");

  if (!audioBtn || !audioGuide) return;

  if (!audioGuide.paused) {
    audioGuide.pause();
    updateAudioButtonState(audioBtn, audioGuide, false);
    return;
  }

  playAudioGuide(audioBtn, audioGuide);
}

function initAudioGuide() {
  const audioBtn = document.querySelector(".audio-btn");
  const audioGuide = document.getElementById("audio-guide");

  if (!audioBtn || !audioGuide) return;

  audioBtn.addEventListener("click", toggleAudioGuide);

  audioGuide.addEventListener("ended", () => {
    updateAudioButtonState(audioBtn, audioGuide, false);
  });

  window.addEventListener("langChanged", () => {
    if (!audioGuide.paused) {
      const nextSrc = getAudioSourceForPage();
      if (nextSrc) {
        audioGuide.src = nextSrc;
        audioGuide.load();
        audioGuide.play().catch(() => {});
      }
    }
  });
}

window.initAudioGuide = initAudioGuide;
window.toggleAudioGuide = toggleAudioGuide;
window.getAudioSourceForPage = getAudioSourceForPage;
