/* ═══════════════════════════════════════════════════════
   TRENCADÍS DE FOND — fragment irréguliers interactifs
   Usage : appeler initTrencadis() après le chargement du DOM
   Le canvas se place en fond fixe, ne capte pas les clics
═══════════════════════════════════════════════════════ */

(function () {
  /* ── Palette de couleurs trencadís ── */
  const COULEURS = [
    "#2a8a7a",
    "#c8922a",
    "#5a1a7a",
    "#1a3a6a",
    "#a03818",
    "#4a8a2a",
    "#8a6a1a",
    "#c0d0e0",
    "#e0c8b0",
    "#3ab09a",
    "#e8b44a",
    "#8a3ab0",
    "#2a5a9a",
    "#c04820",
    "#b09030",
  ];

  /* ── Variables globales du module ── */
  let canvas, ctx;
  let W, H;
  let tesselles = [];
  let mx = -999,
    my = -999; // position curseur hors écran par défaut

  /* ─────────────────────────────────────────────────────
     INITIALISATION — crée et insère le canvas dans le DOM
  ───────────────────────────────────────────────────── */
  function initTrencadis() {
    canvas = document.createElement("canvas");
    canvas.id = "trencadis-fond";

    /* Positionnement en fond fixe, derrière tout le contenu */
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
    `;

    /* Insérer en premier enfant du body */
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext("2d");

    /* Redimensionner et générer les tesselles */
    redimensionner();

    /* Écouter les événements souris / touch */
    document.addEventListener("mousemove", surSouris);
    document.addEventListener("touchmove", surTouch, { passive: true });
    document.addEventListener("touchend", () => {
      mx = -999;
      my = -999;
    });
    window.addEventListener("resize", redimensionner);

    /* Lancer la boucle d'animation */
    boucle();
  }

  /* ─────────────────────────────────────────────────────
     REDIMENSIONNEMENT — recalcule le canvas et recrée les tesselles
  ───────────────────────────────────────────────────── */
  function redimensionner() {
    W = canvas.width = window.innerWidth * devicePixelRatio;
    H = canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);
    genererTesselles();
  }

  /* ─────────────────────────────────────────────────────
     GÉNÉRATION DES TESSELLES
     Grille légèrement aléatoire → chaque cellule devient
     un polygone irrégulier (4 à 7 côtés) comme une
     céramique cassée à la main
  ───────────────────────────────────────────────────── */
  function genererTesselles() {
    tesselles = [];

    const largeur = W / devicePixelRatio;
    const hauteur = H / devicePixelRatio;
    const pas = 28; // espacement de la grille de base

    /* Générateur pseudo-aléatoire avec seed fixe
       → même disposition à chaque resize, pas de saut visuel */
    let seed = 3;
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };

    for (let y = -pas; y < hauteur + pas; y += pas) {
      for (let x = -pas; x < largeur + pas; x += pas) {
        /* Centre légèrement décalé pour casser la grille */
        const cx = x + (rng() - 0.5) * pas * 0.6;
        const cy = y + (rng() - 0.5) * pas * 0.6;
        const taille = pas * 0.48 + rng() * pas * 0.22;

        tesselles.push({
          pts: fragmentPolygone(cx, cy, taille, rng),
          cx,
          cy,
          couleur: COULEURS[Math.floor(rng() * COULEURS.length)],
          lumiere: 0, // valeur actuelle lissée [0..1]
          cibleLumiere: 0, // valeur cible
          scale: 1, // agrandissement actuel lissé
          cibleScale: 1, // agrandissement cible
          vitesse: 0.04 + rng() * 0.05, // vitesse de lissage propre à chaque tesselle
        });
      }
    }
  }

  /* ─────────────────────────────────────────────────────
     POLYGONE IRRÉGULIER
     Génère les points d'un fragment de céramique cassée :
     n sommets répartis en cercle avec angle et rayon aléatoires
  ───────────────────────────────────────────────────── */
  function fragmentPolygone(cx, cy, taille, rng) {
    const n = 4 + Math.floor(rng() * 4); // 4 à 7 côtés
    const pts = [];

    for (let i = 0; i < n; i++) {
      /* Angle de base régulier + perturbation aléatoire */
      const angle = (i / n) * Math.PI * 2 + (rng() - 0.5) * (Math.PI / n) * 0.9;
      /* Rayon variable → fragment pas circulaire */
      const rayon = taille * (0.45 + rng() * 0.55);
      pts.push([cx + Math.cos(angle) * rayon, cy + Math.sin(angle) * rayon]);
    }
    return pts;
  }

  /* ─────────────────────────────────────────────────────
     BOUCLE D'ANIMATION
  ───────────────────────────────────────────────────── */
  function boucle() {
    dessiner();
    requestAnimationFrame(boucle);
  }

  /* ─────────────────────────────────────────────────────
     DESSIN — frame par frame
  ───────────────────────────────────────────────────── */
  function dessiner() {
    const W2 = W / devicePixelRatio;
    const H2 = H / devicePixelRatio;

    /* Fond transparent — le site s'affiche derrière */
    ctx.clearRect(0, 0, W2, H2);

    const RAYON_INFLUENCE = 110; // px autour du curseur

    tesselles.forEach((t) => {
      const d = Math.hypot(t.cx - mx, t.cy - my);

      /* Influence [0..1] — puissance 2 pour une atténuation douce */
      const influence =
        d < RAYON_INFLUENCE ? Math.pow(1 - d / RAYON_INFLUENCE, 2) : 0;

      /* Cibles : lumière max 60%, agrandissement max +8% */
      t.cibleLumiere = influence * 0.6;
      t.cibleScale = 1 + influence * 0.08;

      /* Lissage exponentiel individuel (chaque tesselle a sa vitesse) */
      t.lumiere += (t.cibleLumiere - t.lumiere) * t.vitesse;
      t.scale += (t.cibleScale - t.scale) * t.vitesse;

      /* Décomposer la couleur hex → RGB */
      const [r, g, b] = hexVersRgb(t.couleur);

      /* Opacité de base très faible : fond discret */
      const alpha = 0.07 + t.lumiere * 0.35;

      ctx.save();

      /* Agrandissement centré sur la tesselle */
      ctx.translate(t.cx, t.cy);
      ctx.scale(t.scale, t.scale);
      ctx.translate(-t.cx, -t.cy);

      /* Tracé du polygone */
      ctx.beginPath();
      ctx.moveTo(t.pts[0][0], t.pts[0][1]);
      for (let i = 1; i < t.pts.length; i++) {
        ctx.lineTo(t.pts[i][0], t.pts[i][1]);
      }
      ctx.closePath();

      /* Remplissage coloré */
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();

      /* Reflet spéculaire subtil au survol */
      if (t.lumiere > 0.05) {
        ctx.fillStyle = `rgba(255,240,210,${t.lumiere * 0.06})`;
        ctx.fill();
      }

      /* Joint entre tesselles — fin et quasi invisible */
      ctx.strokeStyle = `rgba(0,0,0,${0.12 + t.lumiere * 0.08})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.restore();
    });
  }

  /* ─────────────────────────────────────────────────────
     UTILITAIRES
  ───────────────────────────────────────────────────── */
  function hexVersRgb(hex) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
  }

  function surSouris(e) {
    mx = e.clientX;
    my = e.clientY;
  }

  function surTouch(e) {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
  }

  /* ── Exposer la fonction d'init globalement ── */
  window.initTrencadis = initTrencadis;
})();
