/* ─────────────────────────────────────────
   i18n.js — système de traduction
   Langue lue depuis ?lg= dans l'URL (défaut : fr)
───────────────────────────────────────── */

let currentLang = getLangFromURL();
let translations = {};

/** Lit le paramètre ?lg= dans l'URL, sinon retourne "fr" */
function getLangFromURL() {
  const params = new URLSearchParams(window.location.search);
  const lg = params.get("lg");
  return ["fr", "en", "es", "ca"].includes(lg) ? lg : "fr";
}

/** Change la langue en mettant à jour l'URL et en rechargeant */
function setLanguage(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set("lg", lang);
  window.location.href = url.toString();
}

/** Applique les traductions sur tous les éléments [data-i18n] */
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const keys = el.dataset.i18n.split(".");
    let value = translations[currentLang];
    for (const k of keys) {
      if (value == null) break;
      value = value[k];
    }
    if (value != null) el.textContent = value;
  });

  // Met à jour l'attribut lang sur <html>
  document.documentElement.lang = currentLang;
}

/** Met à jour l'état actif des boutons de langue */
function updateLangUI() {
  document.querySelectorAll("#lang-switch .trencadis-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

/** Charge le fichier de traductions puis applique */
async function loadTranslations() {
  try {
    const res = await fetch("/data/translations.json");
    translations = await res.json();
    applyTranslations();
    updateLangUI();
  } catch (e) {
    console.error("Erreur chargement translations.json :", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Branche les boutons de langue
  document.querySelectorAll("#lang-switch .trencadis-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (lang) setLanguage(lang);
    });
  });

  updateLangUI();
});

loadTranslations();
