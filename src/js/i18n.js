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

loadTranslations();
