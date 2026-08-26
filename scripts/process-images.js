#!/usr/bin/env node
/**
 * scripts/process-images.js
 * ─────────────────────────
 * 1. Copia los originales a assets/img/originals/ (backup)
 * 2. Para cada imagen genera 3 versiones WebP optimizadas:
 *      {slug}.webp        → 800×800  (página de detalle)
 *      {slug}-card.webp   → 480×480  (cards del catálogo)
 *      {slug}-thumb.webp  → 150×150  (miniaturas del carrito)
 * 3. Elimina los archivos originales de las carpetas de categoría
 *
 * Fondo de relleno: #ede9fe (--brand-light)
 * Encuadre:        fit: contain  (no recorta, preserva el diseño completo)
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMG_DIR = path.resolve(__dirname, "../assets/img");
const ORIGINALS_DIR = path.join(IMG_DIR, "originals");

// ── Colores ───────────────────────────────────────────────────────────────────
const BG = { r: 237, g: 233, b: 254, alpha: 1 }; // #ede9fe

// ── Tamaños de salida ─────────────────────────────────────────────────────────
const SIZES = [
  { suffix: "",       width: 800, height: 800, quality: 85 },
  { suffix: "-card",  width: 480, height: 480, quality: 82 },
  { suffix: "-thumb", width: 150, height: 150, quality: 78 },
];

// ── Mapa de imágenes: origen → slug de destino ────────────────────────────────
// src: ruta relativa a IMG_DIR  |  dest: categoría/nombre-sin-extensión
const IMAGE_MAP = [
  // ── PM ──────────────────────────────────────────────────────────────────────
  { src: "project-manager-i-can-explain-it-to-you.jpg", dest: "pm/i-can-explain-it-to-you" },

  // ── Cloud ────────────────────────────────────────────────────────────────────
  { src: "cloud/cloud-arquitect.png",  dest: "cloud/cloud-arquitect" },

  // ── DevOps ───────────────────────────────────────────────────────────────────
  { src: "devops/breaking-prod.webp",              dest: "devops/breaking-prod" },
  { src: "devops/cicd-or-die-trying.webp",         dest: "devops/cicd-or-die-trying" },
  { src: "devops/devops-acronym.avif",             dest: "devops/devops-acronym" },
  { src: "devops/i-broke-prod-again.avif",         dest: "devops/i-broke-prod-again" },
  { src: "devops/it-works-in-my-container.jpg",    dest: "devops/it-works-in-my-container" },
  { src: "devops/no-deploy-fridays.webp",          dest: "devops/no-deploy-fridays" },

  // ── Enigma ───────────────────────────────────────────────────────────────────
  { src: "enigma/enigma-blue-print.jpg", dest: "enigma/enigma-blue-print" },
  { src: "enigma/enigma-machine.jpg",    dest: "enigma/enigma-machine" },

  // ── General ──────────────────────────────────────────────────────────────────
  { src: "general/donramon_lavenganzanuncaesbuena.png",   dest: "general/don-ramon-venganza" },
  { src: "general/donramon_lavenganzanuncaesbuena-2.png", dest: "general/don-ramon-venganza-2" },
  { src: "general/polera_no_lloren_por_mi.png",           dest: "general/no-lloren-por-mi" },
  { src: "general/stonks.webp",                           dest: "general/stonks" },
  { src: "general/this-is-fine-meme-gunshow.webp",        dest: "general/this-is-fine" },

  // ── IT Crowd (carpeta origen: it_crowd/ → destino: it-crowd/) ────────────────
  { src: "it_crowd/0118-999-881-999-119-725-3.webp",                                        dest: "it-crowd/0118-999-881-999-119-725-3" },
  { src: "it_crowd/RTFM.jpg",                                                               dest: "it-crowd/rtfm" },
  { src: "it_crowd/choose-your-weapon.jpg",                                                 dest: "it-crowd/choose-your-weapon" },
  { src: "it_crowd/i-dont-work-here.jpg",                                                   dest: "it-crowd/i-dont-work-here" },
  { src: "it_crowd/i-hope-this-email-finds-you-well.webp",                                  dest: "it-crowd/i-hope-this-email-finds-you-well" },
  { src: "it_crowd/i-read-your-email.jpg",                                                  dest: "it-crowd/i-read-your-email" },
  { src: "it_crowd/i-see-dumb-people.jpg",                                                  dest: "it-crowd/i-see-dumb-people" },
  { src: "it_crowd/if-you-type-google-into-google-you-can-brake-the-internet.jpg",          dest: "it-crowd/type-google-into-google" },
  { src: "it_crowd/meh.jpg",                                                                dest: "it-crowd/meh" },
  { src: "it_crowd/moss-keep-calm-and-put-the-fire-with-the-rest-of-the-fire.jpg",          dest: "it-crowd/moss-keep-calm" },
  { src: "it_crowd/moss-turn-it-off.jpg",                                                   dest: "it-crowd/moss-turn-it-off" },
  { src: "it_crowd/music_I_like.jpg",                                                       dest: "it-crowd/music-i-like" },
  { src: "it_crowd/pixel-pirate-flag.png",                                                  dest: "it-crowd/pixel-pirate-flag" },
  { src: "it_crowd/roy-people-what-a-bunch-of-bastards.jpg",                                dest: "it-crowd/roy-people" },
  { src: "it_crowd/the-cake-is-a-lie.avif",                                                 dest: "it-crowd/the-cake-is-a-lie" },
  { src: "it_crowd/the-sun-is-trying-to-kill-me.jpg",                                       dest: "it-crowd/the-sun-is-trying-to-kill-me" },

  // ── Linux ────────────────────────────────────────────────────────────────────
  { src: "linux/sudo-rm-rf.jpg", dest: "linux/sudo-rm-rf" },

  // ── Personajes ───────────────────────────────────────────────────────────────
  { src: "personajes/acdc-tesla-edison.jpg",                      dest: "personajes/acdc-tesla-edison" },
  { src: "personajes/alan-turing.webp",                           dest: "personajes/alan-turing" },
  { src: "personajes/chuck-norris-doesnt-code.webp",              dest: "personajes/chuck-norris-doesnt-code" },
  { src: "personajes/tesla.webp",                                 dest: "personajes/tesla" },
  { src: "personajes/things-you-need-to-know-about-chuck-norris.jpg", dest: "personajes/chuck-norris-facts" },
  { src: "personajes/turing-test.avif",                           dest: "personajes/turing-test" },

  // ── Programador ──────────────────────────────────────────────────────────────
  { src: "programador/c-you-have-no-class.jpg",                                                         dest: "programador/c-you-have-no-class" },
  { src: "programador/css.jpg",                                                                         dest: "programador/css" },
  { src: "programador/ctm-compilara-todo-manana.png",                                                   dest: "programador/ctm-compilara-todo-manana" },
  { src: "programador/false-its-funny-because-its-true.jpg",                                            dest: "programador/false-its-funny" },
  { src: "programador/i_dont_always_test_my_code.webp",                                                 dest: "programador/i-dont-always-test-my-code" },
  { src: "programador/im-just-here-for-the-pizza.jpg",                                                   dest: "programador/im-just-here-for-the-pizza" },
  { src: "programador/problem-coffee-programmer_.jpg",                                                   dest: "programador/problem-coffee-programmer" },
  { src: "programador/programming-is-10-writing-code-and-90-understanding-why-its-not-working.avif",    dest: "programador/programming-is-10-percent" },
  { src: "programador/this-meeting-could-have-been-an-email.webp",                                      dest: "programador/this-meeting" },

  // ── QA ───────────────────────────────────────────────────────────────────────
  { src: "qa/polera_qualityassurance_600_600.jpg",   dest: "qa/quality-assurance" },
  { src: "qa/polera_qualityassurance02_600_600.jpg", dest: "qa/quality-assurance-2" },
];

// ── Utilidades ────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// Elimina una carpeta solo si está vacía
function removeDirIfEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  const contents = fs.readdirSync(dir);
  if (contents.length === 0) {
    fs.rmdirSync(dir);
    console.log(`🗑️  Carpeta vacía eliminada: ${path.relative(IMG_DIR, dir)}`);
  }
}

// ── Principal ─────────────────────────────────────────────────────────────────

async function processImages() {
  ensureDir(ORIGINALS_DIR);

  let ok = 0;
  let skipped = 0;
  let errors = 0;

  for (const entry of IMAGE_MAP) {
    const srcPath = path.join(IMG_DIR, entry.src);

    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️  No encontrado (omitido): ${entry.src}`);
      skipped++;
      continue;
    }

    // 1. Backup del original (mover a originals/)
    const origDest = path.join(ORIGINALS_DIR, entry.src);
    ensureDir(path.dirname(origDest));
    if (!fs.existsSync(origDest)) {
      fs.copyFileSync(srcPath, origDest);
    }

    // Eliminar el original de la carpeta de categoría ANTES de procesar,
    // así sharp siempre lee desde originals/ y escribe en un path diferente
    try {
      if (fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
    } catch {
      // En Windows a veces tarda en liberar; ignorar y continuar
    }

    // 2. Generar 3 tamaños en WebP, leyendo desde la copia en originals/
    let anyError = false;
    for (const size of SIZES) {
      const outDir = path.join(IMG_DIR, path.dirname(entry.dest));
      ensureDir(outDir);
      const outFile = path.join(IMG_DIR, `${entry.dest}${size.suffix}.webp`);

      try {
        const buffer = await sharp(origDest)
          .resize(size.width, size.height, {
            fit: "contain",
            background: BG,
          })
          .webp({ quality: size.quality })
          .toBuffer();
        fs.writeFileSync(outFile, buffer);
      } catch (err) {
        console.error(`❌ Error procesando ${entry.src} [${size.suffix || "full"}]:`, err.message);
        errors++;
        anyError = true;
      }
    }

    if (!anyError) {
      console.log(`✅ ${entry.dest}  (full / card / thumb)`);
      ok++;
    } else {
      console.log(`⚠️  ${entry.dest}  (con errores parciales)`);
    }
  }

  // Limpiar it_crowd/ si quedó vacía (fue renombrada a it-crowd/)
  removeDirIfEmpty(path.join(IMG_DIR, "it_crowd"));

  console.log(`\n────────────────────────────────────────`);
  console.log(`🦄 Procesadas: ${ok}  |  omitidas: ${skipped}  |  errores: ${errors}`);
  console.log(`📁 Originales guardados en: assets/img/originals/`);
  console.log(`────────────────────────────────────────`);
}

processImages().catch(console.error);
