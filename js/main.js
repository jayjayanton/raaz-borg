/* RAAZ BORG — shared interface logic */

/* language toggle with persistence */
(function () {
  const saved = localStorage.getItem("rb-lang") || "en";
  document.body.dataset.lang = saved;
  document.documentElement.lang = saved;
  const t = document.getElementById("langToggle");
  if (t) {
    t.textContent = saved === "en" ? "ES" : "EN";
    t.addEventListener("click", () => {
      const next = document.body.dataset.lang === "en" ? "es" : "en";
      document.body.dataset.lang = next;
      document.documentElement.lang = next;
      localStorage.setItem("rb-lang", next);
      t.textContent = next === "en" ? "ES" : "EN";
    });
  }
})();

/* mobile nav */
(function () {
  const b = document.getElementById("burger");
  const links = document.querySelector(".nav-links");
  if (b && links) b.addEventListener("click", () => links.classList.toggle("open"));
})();

/* scroll reveal */
(function () {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

/* duplicate ticker content for seamless loop */
(function () {
  document.querySelectorAll(".ticker-track").forEach((track) => {
    track.innerHTML = "<span>" + track.innerHTML + "</span><span aria-hidden='true'>" + track.innerHTML + "</span>";
  });
})();

/* typed system line */
(function () {
  const el = document.querySelector(".sysline .type-target");
  if (!el) return;
  const lines = JSON.parse(el.dataset.lines || "[]");
  let li = 0, ci = 0, dir = 1;
  function tick() {
    const line = lines[li % lines.length];
    ci += dir;
    el.textContent = line.slice(0, ci);
    if (dir === 1 && ci >= line.length) { dir = -1; setTimeout(tick, 2200); return; }
    if (dir === -1 && ci <= 0) { dir = 1; li++; setTimeout(tick, 400); return; }
    setTimeout(tick, dir === 1 ? 45 : 18);
  }
  tick();
})();


/* product image switcher */
function changeProductImage(imageId, button) {
  const mainImage = document.getElementById(imageId);
  const thumbnail = button.querySelector("img");

  if (!mainImage || !thumbnail) return;

  mainImage.src = thumbnail.src;
  mainImage.alt = thumbnail.alt;

  button.parentElement.querySelectorAll(".thumb")
    .forEach(btn => btn.classList.remove("active"));

  button.classList.add("active");
}

document.querySelectorAll(".selectable-sizes").forEach(group => {
  group.querySelectorAll("button:not(:disabled)").forEach(button => {
    button.addEventListener("click", () => {
      group.querySelectorAll("button").forEach(btn => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");
    });
  });
});


document.querySelectorAll(".order-product").forEach(button => {
  button.addEventListener("click", async () => {
    const card = button.closest(".p-card");
    const product = card.querySelector("h3").textContent.trim();
    const size = card.querySelector(".selectable-sizes .selected")
      ?.dataset.size || "One Size";

    const method = button.dataset.method;
    const isSpanish = document.body.dataset.lang === "es";

    const subject = `RAAZ BORG Order Inquiry - ${product}`;

    const message = isSpanish
      ? `Hola RAAZ BORG, estoy interesado/a en comprar ${product}, talla ${size}. ¿Está disponible?`
      : `Hello RAAZ BORG, I'm interested in ordering ${product}, size ${size}. Is it available?`;

    if (method === "email") {
      const mailto = `mailto:raazborgstudios@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailto;
    }

    if (method === "instagram") {
      try {
        await navigator.clipboard.writeText(message);
      } catch (error) {
        window.prompt("Copy your message:", message);
      }

      window.open(
        "https://www.instagram.com/raazborg/",
        "_blank",
        "noopener,noreferrer"
      );
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("productLightbox");
    if (!lightbox) return;

    const lightboxImage = document.getElementById("lightboxImage");
    const closeButton = lightbox.querySelector(".lightbox-close");
    if (!lightboxImage || !closeButton) return;

    let previousFocus = null;

    function openLightbox(image) {
        previousFocus = document.activeElement;

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;

        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImage.removeAttribute("src");
        document.body.style.overflow = "";

        if (previousFocus && previousFocus.focus) {
            previousFocus.focus();
        }
    }

    document.querySelectorAll(".product-gallery img").forEach(image => {
        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "Enlarge " + image.alt);

        image.addEventListener("click", () => openLightbox(image));

        image.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(image);
            }
        });
    });

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !lightbox.hidden) {
            closeLightbox();
        }

        if (event.key === "Tab" && !lightbox.hidden) {
            event.preventDefault();
            closeButton.focus();
        }
    });
});


/* product lightbox with gallery */
document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("productLightbox");
  if (!lightbox) return;

  const lightboxImage = document.getElementById("lightboxImage");
  const counter = document.getElementById("lightboxCounter");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  if (!lightboxImage || !counter || !closeButton || !prevButton || !nextButton) return;

  let galleryImages = [];
  let currentIndex = 0;
  let previousFocus = null;

  function showImage(index) {
        if (!galleryImages.length) return;

  currentIndex = (index + galleryImages.length) % galleryImages.length;

  const image = galleryImages[currentIndex];

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;

  counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;

        const hasMultiple = galleryImages.length > 1;
        prevButton.hidden = !hasMultiple;
        nextButton.hidden = !hasMultiple;
    }

    function openLightbox(mainImage) {
        previousFocus = document.activeElement;

        const card = mainImage.closest(".p-card");
        const thumbnails = card.querySelectorAll(".product-thumbnails .thumb img");

        galleryImages = thumbnails.length
            ? Array.from(thumbnails).map(img => ({
                src: img.src,
                alt: img.alt
            }))
            : [{ src: mainImage.src, alt: mainImage.alt }];

        currentIndex = galleryImages.findIndex(
            image => image.src === mainImage.src
        );

        if (currentIndex < 0) currentIndex = 0;

        showImage(currentIndex);
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImage.removeAttribute("src");
        document.body.style.overflow = "";
        galleryImages = [];

        if (previousFocus?.focus) previousFocus.focus();
    }

  document.querySelectorAll(".product-gallery img").forEach(image => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", "Enlarge " + image.alt);

    image.addEventListener("click", () => openLightbox(image));

    image.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  /* Open individual thumbnails in the lightbox */
  document.querySelectorAll(".product-thumbnails .thumb").forEach(button => {
    button.addEventListener("click", () => {
      const thumbnail = button.querySelector("img");
      const card = button.closest(".p-card");
      const mainImage = card.querySelector(".product-gallery img");

      if (!thumbnail || !mainImage) return;

      // Update the main image as usual
      mainImage.src = thumbnail.src;
      mainImage.alt = thumbnail.alt;

      // Open the selected thumbnail enlarged
      openLightbox(mainImage);
    });
  });


    prevButton.addEventListener("click", () => showImage(currentIndex - 1));
    nextButton.addEventListener("click", () => showImage(currentIndex + 1));
    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", event => {
        if (lightbox.hidden) return;

        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowLeft") showImage(currentIndex - 1);
        if (event.key === "ArrowRight") showImage(currentIndex + 1);

        if (event.key === "Tab") {
            const controls = [
                closeButton,
                ...(!prevButton.hidden ? [prevButton, nextButton] : [])
            ];
            const index = controls.indexOf(document.activeElement);
            const direction = event.shiftKey ? -1 : 1;

            event.preventDefault();
            controls[(index + direction + controls.length) % controls.length].focus();
        }
    });
});

/* Clashes Card Flip */
document.querySelectorAll(".clashes-realm-card").forEach(card => {

  const inner = card.querySelector(".realm-flip-inner");
  const lore = card.querySelector(".realm-lore");

  function flipCard() {
    const wasFlipped = card.classList.contains("flipped");

    // Close all cards before opening the selected one
    document.querySelectorAll(".clashes-realm-card").forEach(other => {
      other.classList.remove("flipped");
      other.setAttribute("aria-pressed", "false");
    });

    if (!wasFlipped) {
      card.classList.add("flipped");
      card.setAttribute("aria-pressed", "true");
    }
  }

  // Reset scroll only after the flip animation completes
  
    inner.addEventListener("transitionend", event => {
      if (event.target !== inner || event.propertyName !== "transform") return;

      // Reset only after the card has finished closing
      if (lore && !card.classList.contains("flipped")) {
        lore.scrollTop = 0;
      }
    });


  card.addEventListener("click", flipCard);

  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flipCard();
    }
  });

});

/* ------- GRAND PRIX ARCHIVE ------ */
(() => {

  // Replace placeholder information with verified event details.
  const editions = [
  {
    year: "2020",
  name: "White Carbon Combat",
  color: "#e9edf0",
  image: "",
  champion: "",
  fighterId: "",
  en: "Eight Ecuadorian athletes competed in the first transmission. Add the confirmed results and defining moments here.",
  es: "Ocho atletas ecuatorianos participaron en la primera transmisión. Agrega aquí los resultados confirmados y los momentos destacados."
    },
  {
    year: "2021",
  name: "Blue Oblivion BJJ",
  color: "#00d8e2",
  image: "",
  champion: "",
  fighterId: "",
  en: "The system expanded into the Oblivion Protocol. Add the confirmed matches and tournament outcome here.",
  es: "El sistema se expandió al Protocolo Oblivion. Agrega aquí los combates confirmados y el resultado del torneo."
    },
  {
    year: "2021",
  name: "Violet Combat Royale",
  color: "#b579f7",
  image: "",
  champion: "",
  fighterId: "",
  en: "The Royale format brought a new challenge to the Grid. Add the verified highlights and winner here.",
  es: "El formato Royale trajo un nuevo desafío a la Red. Agrega aquí los momentos destacados confirmados y al ganador."
    },
  {
    year: "2022",
  name: "Oxide Overdrive",
  color: "#e87524",
  image: "assets/Oxide-Overdrive-Lineup.png",
  champion: "",
  fighterId: "",
  en: "The wasteland era began with Oxide Overdrive. Add the confirmed event recap and final result here.",
  es: "La era del páramo comenzó con Oxide Overdrive. Agrega aquí la reseña confirmada y el resultado final."
    },
  {
    year: "2024",
  name: "Praetoreans Interface GP",
  color: "#9c7a28",
  image: "",
  champion: "",
  fighterId: "",
  en: "Heroes faced heroes in the latest completed edition. Add the confirmed tournament recap here.",
  es: "Héroes se enfrentaron a héroes en la última edición celebrada. Agrega aquí la reseña confirmada del torneo."
    }
  ];

  const overlay = document.getElementById("gpArchiveOverlay");
  if (!overlay) return; // Archive UI only exists on the Clashes page.
  const panel = overlay.querySelector(".gp-archive-panel");
  const triggers = [...document.querySelectorAll(".timeline .t-item[data-gp]")];

  const $ = id => document.getElementById(id);

  let active = 0;
  let previousFocus = null;

  const language = () =>
  document.body.dataset.lang === "es" ? "es" : "en";

  function show(index) {
    active = (index + editions.length) % editions.length;

  const edition = editions[active];

  panel.style.setProperty("--gp-color", edition.color);

  $("gpArchiveYear").textContent = edition.year;
  $("gpArchiveTitle").textContent = edition.name;

  $("gpArchiveChampion").textContent =
  edition.champion ||
  (language() === "es" ? "POR CONFIRMAR" : "TO BE CONFIRMED");

  $("gpArchiveSummary").textContent = edition[language()];

  $("gpArchiveCount").textContent =
  `${String(active + 1).padStart(2, "0")} / ${String(editions.length).padStart(2, "0")}`;

  const link = $("gpArchiveFighterLink");

  link.hidden = !(edition.champion && edition.fighterId);

  if (!link.hidden) {
    link.href = `fighters.html#${encodeURIComponent(edition.fighterId)}`;
    }

  const img = $("gpArchiveImage");
  const fallback = $("gpArchiveImageFallback");

  img.hidden = true;
  fallback.hidden = false;
  img.removeAttribute("src");

  if (edition.image) {
    img.onload = () => {
      img.hidden = false;
      fallback.hidden = true;
    };

      img.onerror = () => {
    img.hidden = true;
  fallback.hidden = false;
      };

  img.alt = edition.name + " fighters";
  img.src = edition.image;
    }

  panel.scrollTop = 0;
  }

  function openArchive(index) {
    previousFocus = document.activeElement;
  show(index);

  overlay.hidden = false;
  document.body.classList.add("gp-archive-open");
  panel.focus();
  }

  function closeArchive() {
    overlay.hidden = true;
  document.body.classList.remove("gp-archive-open");

  if (previousFocus) previousFocus.focus();
  }

  triggers.forEach(trigger => {
    const index = Number(trigger.dataset.gp);

    trigger.addEventListener("click", () => openArchive(index));

    trigger.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
  openArchive(index);
      }
    });
  });

  $("gpArchiveClose").addEventListener("click", closeArchive);
  $("gpArchivePrev").addEventListener("click", () => show(active - 1));
  $("gpArchiveNext").addEventListener("click", () => show(active + 1));

  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeArchive();
  });

  document.addEventListener("keydown", event => {
    if (overlay.hidden) return;

  if (event.key === "Escape") {
    closeArchive();
    }

  if (event.key === "ArrowLeft") {
    show(active - 1);
    }

  if (event.key === "ArrowRight") {
    show(active + 1);
    }

  if (event.key === "Tab") {
      const focusables = [...panel.querySelectorAll(
  'button, a[href]:not([hidden])'
      )].filter(el => !el.hidden);

  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
  last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
  first.focus();
      }
    }
  });

  new MutationObserver(() => {
    if (!overlay.hidden) show(active);
  }).observe(document.body, {
    attributes: true,
  attributeFilter: ["data-lang"]
  });

})();


/* Realm Nexus */

/* ============ RAAZ BORG — FIGHTER PROGRESSION ============ */

const processStages = [
  {
    en: ["FIGHTER SIGN-UP",
      "The fighter submits their information and signs up to participate in the RAAZ BORG selection process."],
    es: ["INSCRIPCIÓN DEL PELEADOR",
      "El peleador envía sus datos y se inscribe para participar en el proceso de selección de RAAZ BORG."]
  },
  {
    en: ["ROSTER & REGISTRATION",
      "The fighter enters the roster pool and completes the registration payment to participate."],
    es: ["REGISTRO Y PAGO",
      "El peleador ingresa al grupo de participantes y realiza el pago de inscripción."]
  },
  {
    en: ["PAYMENT CONFIRMED",
      "Once payment is received, the fighter receives confirmation by email or text message."],
    es: ["PAGO CONFIRMADO",
      "Una vez recibido el pago, el peleador recibe una confirmación por correo electrónico o mensaje de texto."]
  },
  {
    en: ["MATCH ASSIGNMENT",
      "The RAAZ BORG team selects a matchup based on skill level and notifies the designated fighters by email, including the confirmed date, location and instructions."],
    es: ["ASIGNACIÓN DE COMBATE",
      "El equipo de RAAZ BORG selecciona el enfrentamiento según el nivel de habilidad y notifica a los peleadores por correo electrónico, incluyendo fecha, lugar e instrucciones."]
  },
  {
    en: ["THE FIGHT",
      "The fighter enters the arena. Victory means advancement to the next qualifying round. Defeat means an opportunity to register again."],
    es: ["EL COMBATE",
      "El peleador entra a la arena. Una victoria significa avanzar a la siguiente ronda clasificatoria. Una derrota ofrece la oportunidad de inscribirse nuevamente."]
  },
  {
    en: ["GRAND PRIX QUALIFICATION",
      "Winners continue competing until the available Grand Prix spots are filled. The GP champion earns a cash prize and can advance to the next league."],
    es: ["CLASIFICACIÓN AL GRAND PRIX",
      "Los ganadores continúan compitiendo hasta completar los cupos disponibles del Grand Prix. El campeón obtiene un premio económico y puede avanzar a la siguiente liga."]
  }
];

let activeProcessStep = 0;

const stepButtons = document.querySelectorAll(".process-step");
const processTitle = document.getElementById("processTitle");
const processDescription = document.getElementById("processDescription");
const processNumber = document.getElementById("processNumber");

function processLanguage() {
  return document.body.dataset.lang === "es" ? "es" : "en";
}

function renderProcess() {
  if (!processTitle || !processDescription || !processNumber) return;

  const lang = processLanguage();
  const stage = processStages[activeProcessStep][lang];

  processTitle.textContent = stage[0];
  processDescription.textContent = stage[1];
  processNumber.textContent =
    `PROTOCOL ${String(activeProcessStep + 1).padStart(2, "0")} / 06`;

  stepButtons.forEach((button, index) => {
    button.classList.toggle("active", index === activeProcessStep);
    button.setAttribute("aria-pressed", String(index === activeProcessStep));
  });
}

function changeProcessStep(step) {
  activeProcessStep =
    (step + processStages.length) % processStages.length;

  renderProcess();
}

stepButtons.forEach(button => {
  button.addEventListener("click", () => {
    changeProcessStep(Number(button.dataset.step));
  });
});

const processPrev = document.getElementById("processPrev");
if (processPrev) {
  processPrev.addEventListener("click", () => {
    changeProcessStep(activeProcessStep - 1);
  });
}

const processNext = document.getElementById("processNext");
if (processNext) {
  processNext.addEventListener("click", () => {
    changeProcessStep(activeProcessStep + 1);
  });
}


// Keep the interactive content synchronized with language changes.
const languageObserver = new MutationObserver(renderProcess);
languageObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ["data-lang"]
});

renderProcess();

/* ============ RAAZ BORG — REALM NEXUS ============ */
const realms = [
  {
    name: "WHITE CARBON COMBAT",
    color: "#e9edf0",
    dark: "#59636e",
    symbol: "◇",
    taglineEn: "The first transmission",
    taglineEs: "La primera transmisión",
    beltEn: "WHITE BELT",
    beltEs: "CINTURÓN BLANCO",
    levelEn: "Novice / Beginner",
    levelEs: "Principiante / Novato",
    loreEn: "Every legend begins as an unknown. In the White Carbon sector, untested fighters enter the Grid with nothing but instinct and ambition. Here, the first victories forge the heroes of tomorrow.",
    loreEs: "Toda leyenda comienza como un desconocido. En el sector White Carbon, los peleadores sin experiencia ingresan a la Red con instinto y ambición. Aquí, las primeras victorias forjan a los héroes del mañana."
  },
  {
    name: "ZAPHIRE TRIALS",
    color: "#00d8e2",
    dark: "#103b77",
    symbol: "⬡",
    taglineEn: "Beyond the Grid",
    taglineEs: "Más allá de la Red",
    beltEn: "BLUE BELT",
    beltEs: "CINTURÓN AZUL",
    levelEn: "Intermediate",
    levelEs: "Intermedio",
    loreEn: "Beyond the first threshold lies the Oblivion Protocol. Fighters who have survived initiation must sharpen their technique and master the chaos. The Grid no longer rewards potential alone.",
    loreEs: "Más allá del primer umbral se encuentra el Protocolo Oblivion. Los peleadores que superaron la iniciación deben perfeccionar su técnica y dominar el caos. La Red ya no recompensa solo el potencial."
  },
  {
    name: "VIOLET COMBAT ROYALE",
    color: "#b579f7",
    dark: "#301445",
    symbol: "✧",
    taglineEn: "Every unit for itself",
    taglineEs: "Cada unidad por su cuenta",
    beltEn: "PURPLE BELT",
    beltEs: "CINTURÓN MORADO",
    levelEn: "Advanced",
    levelEs: "Avanzado",
    loreEn: "The Violet sector belongs to tacticians. Every movement is calculated, every weakness exploited. Those who enter have learned that strength alone cannot guarantee survival.",
    loreEs: "El sector Violeta pertenece a los estrategas. Cada movimiento es calculado y cada debilidad aprovechada. Quienes ingresan saben que la fuerza por sí sola no garantiza la supervivencia." 
  },
  {
    name: "OXIDE OVERDRIVE",
    color: "#bd7835",
    dark: "#593017",
    symbol: "⚙",
    taglineEn: "The wasteland awakens",
    taglineEs: "El páramo despierta",
    beltEn: "BROWN BELT",
    beltEs: "CINTURÓN CAFÉ",
    levelEn: "Expert",
    levelEs: "Experto",
    loreEn: "The Oxide Overdrive is a realm of relentless combat. Here, warriors are forged in the crucible of constant battle, where only the most skilled and adaptable survive.",
    loreEs: "Oxide Overdrive es un reino de combate implacable. Aquí, los guerreros se forjan en el crisol de la batalla constante, donde solo los más hábiles y adaptables sobreviven."
  },
  {
    name: "PRAETOREANS INTERFACE",
    color: "#9c7a28",
    dark: "#45351a",
    symbol: "♜",
    taglineEn: "Heroes versus heroes",
    taglineEs: "Héroes contra héroes",
    beltEn: "BLACK BELT — 1ST DEGREE",
    beltEs: "CINTURÓN NEGRO — 1.er GRADO",
    levelEn: "Elite",
    levelEs: "Élite",
    loreEn: "The Praetoreans guard the inner Grid. These black belts have crossed the threshold from challenger to elite warrior. Their battles defend the honor of the system itself.",
    loreEs: "Los Praetoreanos custodian el núcleo de la Red. Estos cinturones negros han cruzado el umbral de aspirantes a guerreros de élite. Sus combates defienden el honor del propio sistema."
  },
  {
    name: "NEXUS NOIR",
    color: "#f53683",
    dark: "#381328",
    symbol: "◈",
    taglineEn: "Signal unknown",
    taglineEs: "Señal desconocida",
    beltEn: "BLACK BELT — 2ND DEGREE",
    beltEs: "CINTURÓN NEGRO — 2.º GRADO",
    levelEn: "Master",
    levelEs: "Maestro",
    loreEn: "Deep within the Noir network, masters operate beyond conventional limits. Experience becomes their weapon, precision their language. Every encounter is a battle of minds.",
    loreEs: "En lo profundo de la red Noir, los maestros operan más allá de los límites convencionales. La experiencia es su arma y la precisión su lenguaje. Cada encuentro es una batalla de mentes."
  },
  {
    name: "ECLIPSE SYNDICATE",
    color: "#8681b9",
    dark: "#101322",
    symbol: "◉",
    taglineEn: "A new protocol",
    taglineEs: "Un nuevo protocolo",
    beltEn: "BLACK BELT — 3RD DEGREE",
    beltEs: "CINTURÓN NEGRO — 3.er GRADO",
    levelEn: "Grandmaster",
    levelEs: "Gran maestro",
    loreEn: "At the highest reaches of the Grid stands the Eclipse Syndicate. Its warriors have transcended ordinary combat, commanding years of discipline and mastery. Here, legends confront legends.",
    loreEs: "En las alturas de la Red se alza Eclipse Syndicate. Sus guerreros han trascendido el combate ordinario, dominando años de disciplina y maestría. Aquí, las leyendas se enfrentan a leyendas."
  }
];


/* ============ GENERATE REALM CARDS ============ */

const track = document.getElementById('track');


realms.forEach((realm, index) => {
  const card = document.createElement("article");

  card.className = "realm-card";
  card.style.setProperty("--color", realm.color);
  card.style.setProperty("--dark", realm.dark);

  card.innerHTML = `
    <div class="realm-card-inner">

      <div class="realm-card-face realm-card-front">
        <span class="realm-id">
          REALM ${String(index + 1).padStart(2, "0")} / 07
        </span>

        <div class="realm-symbol">${realm.symbol}</div>

       
      </div>


      <div class="realm-card-face realm-card-back">

        <span class="realm-id">
          <span class="lang-en">FIGHTER CLASSIFICATION</span>
          <span class="lang-es">CLASIFICACIÓN DEL PELEADOR</span>
        </span>

        <div class="realm-back-heading">
          <h2>
            <span class="lang-en">${realm.beltEn}</span>
            <span class="lang-es">${realm.beltEs}</span>
          </h2>

          <p class="realm-level">
            <span class="lang-en">${realm.levelEn}</span>
            <span class="lang-es">${realm.levelEs}</span>
          </p>
        </div>

      </div>


    </div>
  `;

  track.appendChild(card);
});


/* ============ CAROUSEL STATE ============ */

let current = 0;
const cards = [...track.children];

/* ============ RENDER CAROUSEL ============ */
function render() {
  cards.forEach((card, index) => {
    let distance = (index - current + cards.length) % cards.length;

    if (distance > cards.length / 2) {
      distance -= cards.length;
    }

    const absoluteDistance = Math.abs(distance);

    card.style.setProperty('--offset', distance);
    card.style.setProperty(
      '--scale',
      absoluteDistance === 0 ? 1 : absoluteDistance === 1 ? 0.8 : 0.65
    );
    card.style.setProperty(
      '--opacity',
      absoluteDistance === 0 ? 1 : absoluteDistance === 1 ? 0.5 : 0.1
    );
    card.style.setProperty(
      '--brightness',
      absoluteDistance === 0 ? 1 : 0.6
    );

    card.style.zIndex = 10 - absoluteDistance;

    card.setAttribute(
      'aria-hidden',
      absoluteDistance === 0 ? 'false' : 'true'
    );
  });

  document.getElementById('realmCounter').textContent =
    `${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;

  document.getElementById('realmTitle').textContent = realms[current].name;
}

/* ============ NAVIGATION ============ */

function move(direction) {
  cards.forEach(card => card.classList.remove("flipped"));
  current = (current + direction + cards.length) % cards.length;
  render();
}

document.getElementById('prev').addEventListener('click', () => move(-1));
document.getElementById('next').addEventListener('click', () => move(1));

/* ============ CLICKABLE REALM CARDS ============ */

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (index !== current) {
      current = index;
      cards.forEach(c => c.classList.remove("flipped"));
      render();
    } else {
      card.classList.toggle("flipped");
    }
  });
});

/* ============ KEYBOARD NAVIGATION ============ */

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    move(-1);
  }

  if (event.key === 'ArrowRight') {
    move(1);
  }
});

/* ============ MOBILE SWIPE SUPPORT ============ */

let touchStartX = 0;
const viewport = document.getElementById('viewport');

viewport.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

viewport.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].screenX - touchStartX;

  if (Math.abs(distance) > 40) {
    move(distance < 0 ? 1 : -1);
  }
}, { passive: true });

/* ============ EXPLORE REALM ============ */

document.getElementById('realmExplore').addEventListener('click', () => {
  const note = document.getElementById('realmNote');

  note.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
});

/* ============ INITIALIZE ============ */

render();


/* fake cart counter (shop) */
(function () {
  let count = 0;
  const badge = document.getElementById("cartCount");
  document.querySelectorAll(".p-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      count++;
      if (badge) badge.textContent = count;
      const en = btn.querySelector(".lang-en"), es = btn.querySelector(".lang-es");
      if (en) en.textContent = "ADDED ✓";
      if (es) es.textContent = "AÑADIDO ✓";
      btn.style.borderColor = "var(--acid)";
      btn.style.color = "var(--acid)";
      setTimeout(() => {
        if (en) en.textContent = "ADD +";
        if (es) es.textContent = "AGREGAR +";
        btn.style.borderColor = ""; btn.style.color = "";
      }, 1400);
    });
  });

})();