fetch("/data/translation.json");
/* langues */
let currentLang = localStorage.getItem("lang") || "fr";
let translations = {};

async function loadTranslations() {
  const res = await fetch("/data/translations.json");
  translations = await res.json();
  applyTranslations();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const keys = el.dataset.i18n.split(".");
    let value = translations[currentLang];

    keys.forEach((k) => (value = value[k]));

    if (value) el.textContent = value;
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyTranslations();
}

// update html lang attribute and active button state
function updateLangUI() {
  try {
    document.documentElement.lang = currentLang;
  } catch (e) {}
  document.querySelectorAll("#lang-switch .trencadis-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // wire up buttons
  document.querySelectorAll("#lang-switch .trencadis-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const lang = btn.dataset.lang;
      if (lang) {
        setLanguage(lang);
        updateLangUI();
      }
    });
  });
  // reflect stored language on load
  updateLangUI();
});

loadTranslations();
// ensure UI updates after translations loaded
loadTranslations()
  .then(updateLangUI)
  .catch(() => {});
