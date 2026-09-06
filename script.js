/* ==========================================================================
   FERRARI — THE ART OF PERFORMANCE
   ========================================================================== */

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isMobile = window.matchMedia("(max-width: 860px)").matches;

/* --------------------------------------------------------------------------
   1. FRAME SEQUENCE — original mechanics, kept intact
   -------------------------------------------------------------------------- */
const canvas = document.getElementById("sequence-canvas");
const ctx = canvas.getContext("2d");
const loader = document.getElementById("loader");
const loaderFill = document.getElementById("loader-fill");
const progressText = document.getElementById("progress-text");
const loaderRingFill = document.getElementById("loader-ring-fill");
const loaderCaption = document.getElementById("loader-caption");
const LOADER_RING_CIRCUMFERENCE = 2 * Math.PI * 55;
const LOADER_CAPTIONS = [
  "Loading frames",
  "Warming the engine",
  "Calibrating aerodynamics",
  "Polishing every line",
  "Ready to drive",
];

const totalCarFrames = 300;
const totalHorseFrames = 300;
const totalFrames = totalCarFrames + totalHorseFrames;

const images = [];
let loadedCount = 0;

let targetFrame = 0;
let currentFrame = 0;
let scrollProgress = 0; // 0 - 1, kept in sync with Lenis

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderFrame();
}

function pad(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function preloadImages() {
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();

    if (i <= totalCarFrames) {
      img.src = `car/ezgif-frame-${pad(i, 3)}.jpg`;
    } else {
      const horseIndex = i - totalCarFrames;
      img.src = `horse/ezgif-frame-${pad(horseIndex, 3)}.jpg`;
    }

    img.onload = img.onerror = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / totalFrames) * 100);
      progressText.innerText = `${percent}%`;
      if (loaderFill) loaderFill.style.width = `${percent}%`;
      if (loaderRingFill) {
        loaderRingFill.style.strokeDashoffset = `${
          LOADER_RING_CIRCUMFERENCE * (1 - percent / 100)
        }`;
      }
      if (loaderCaption) {
        const stage = Math.min(
          LOADER_CAPTIONS.length - 1,
          Math.floor((percent / 100) * (LOADER_CAPTIONS.length - 1)),
        );
        if (loaderCaption.dataset.stage !== String(stage)) {
          loaderCaption.dataset.stage = String(stage);
          loaderCaption.textContent = LOADER_CAPTIONS[stage];
        }
      }

      if (loadedCount === totalFrames) {
        finishLoading();
      }
    };

    images.push(img);
  }
}

function finishLoading() {
  loader.classList.add("is-hiding");
  setTimeout(() => (loader.style.display = "none"), 900);
  requestAnimationFrame(updateFrame);
  playHeroIntro();
}

function renderFrame() {
  const roundedFrame = Math.round(currentFrame);
  const img = images[roundedFrame];
  if (!img || !img.complete || !img.naturalWidth) return;

  const imgRatio = 16 / 9;
  const canvasRatio = canvas.width / canvas.height;
  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / imgRatio;
    offsetX = 0;
    offsetY = (canvas.height - drawHeight) / 2;
  } else {
    drawWidth = canvas.height * imgRatio;
    drawHeight = canvas.height;
    offsetX = (canvas.width - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function updateFrame() {
  // same lerp inertia as the original build
  currentFrame += (targetFrame - currentFrame) * 0.08;
  renderFrame();
  requestAnimationFrame(updateFrame);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
preloadImages();

/* --------------------------------------------------------------------------
   2. LENIS + GSAP SCROLLTRIGGER
   -------------------------------------------------------------------------- */
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: reduceMotion ? 0 : 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !reduceMotion,
  syncTouch: false,
});

lenis.on("scroll", () => {
  ScrollTrigger.update();
  // progress through the pinned frame sequence itself, not the whole
  // document — keeps frame playback in sync with the RANGES timeline
  // even though normal-flow sections now follow it on the page.
  const containerEl = document.querySelector(".scroll-container");
  const rect = containerEl.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  scrollProgress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
  targetFrame = Math.min(
    totalFrames - 1,
    Math.max(0, scrollProgress * (totalFrames - 1)),
  );
  onScrollProgress(scrollProgress);
});

gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* --------------------------------------------------------------------------
   3. NAV STATE
   -------------------------------------------------------------------------- */
const nav = document.getElementById("nav");
function onScrollProgress(p) {
  nav.classList.toggle("is-scrolled", p > 0.01);
  updateProgressUI(p);
  updateAmbient(p);
  updateParticleIntensity(p);
}

/* --------------------------------------------------------------------------
   4. HERO INTRO (page-load reveal, not scroll-linked)
   -------------------------------------------------------------------------- */
function playHeroIntro() {
  if (reduceMotion) {
    gsap.set([".hero-title-line", ".hero-sub", "#scroll-cue"], {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    });
    return;
  }
  gsap.fromTo(
    [".hero-title-line", ".hero-sub"],
    { opacity: 0, y: 60, filter: "blur(10px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.4,
      ease: "power3.out",
      stagger: 0.18,
    },
  );
  gsap.fromTo(
    "#scroll-cue",
    { opacity: 0 },
    { opacity: 1, duration: 1, delay: 0.9 },
  );
  gsap.set(".scene--hero", { opacity: 1 });
}

/* --------------------------------------------------------------------------
   5. STORY CHOREOGRAPHY
   Every range is a fraction (0–1) of the total scroll distance.
   -------------------------------------------------------------------------- */
const RANGES = {
  hero: [0, 0.09],
  design: [0.06, 0.205],
  performance: [0.185, 0.315],
  typeMoment: [0.3, 0.365],
  form: [0.35, 0.465],
  experience: [0.45, 0.545],
  precision: [0.53, 0.6],
  horse: [0.585, 0.88],
  finale: [0.855, 0.95],
  cta: [0.935, 1.0],
};

function pct(range, i) {
  return `${(range[0] + (range[1] - range[0]) * i) * 100}% top`;
}

/* fade-in / hold / fade-out proportions of a scene's own range.
   A longer hold keeps content readable and stops it dying just as
   the person finishes reading it. */
function fadeScene(
  selector,
  range,
  { childReveal = true, extra, holdAtEnd = false } = {},
) {
  const el = document.querySelector(selector);
  if (!el) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scroll-container",
      start: pct(range, 0),
      end: pct(range, 1),
      scrub: 0.6,
    },
  });

  tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "none" });
  if (holdAtEnd) {
    tl.to(el, { opacity: 1, duration: 0.84 });
  } else {
    tl.to(el, { opacity: 1, duration: 0.68 }).to(el, {
      opacity: 0,
      duration: 0.16,
      ease: "none",
    });
  }

  if (childReveal && !reduceMotion) {
    const heading = el.querySelector(
      ".story-heading, .type-moment-heading, .finale-heading, .cta-heading",
    );
    const rest = el.querySelectorAll(
      ".eyebrow, .story-copy, .stat-row, .cta-sub, .cta-button",
    );
    if (heading) {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 46, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: ".scroll-container",
            start: pct(range, 0),
            end: pct(range, 0.28),
            scrub: 0.6,
          },
        },
      );
    }
    if (rest.length) {
      gsap.fromTo(
        rest,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".scroll-container",
            start: pct(range, 0.04),
            end: pct(range, 0.3),
            scrub: 0.6,
          },
        },
      );
    }
  }

  if (typeof extra === "function") extra(tl, el);
}

fadeScene(".scene--hero", RANGES.hero, { childReveal: false });
fadeScene(".scene--design", RANGES.design, {
  extra: () => {
    ["a", "b"].forEach((k, i) => {
      const el = document.querySelector(`.micro-detail--${k}`);
      if (!el || reduceMotion) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.14,
          ease: "none",
          scrollTrigger: {
            trigger: ".scroll-container",
            start: pct(RANGES.design, 0.35 + i * 0.25),
            end: pct(RANGES.design, 0.55 + i * 0.25),
            scrub: 0.6,
            toggleActions: "play reverse play reverse",
          },
        },
      );
    });
  },
});
fadeScene(".scene--performance", RANGES.performance);
fadeScene(".scene--type-moment", RANGES.typeMoment, {
  childReveal: false,
  extra: (tl, el) => {
    const heading = el.querySelector(".type-moment-heading");
    if (reduceMotion) {
      gsap.set(heading, { scale: 1, opacity: 1 });
      return;
    }
    gsap.fromTo(
      heading,
      { scale: 1.6, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-container",
          start: pct(RANGES.typeMoment, 0),
          end: pct(RANGES.typeMoment, 0.6),
          scrub: 0.6,
        },
      },
    );
  },
});
fadeScene(".scene--form", RANGES.form, {
  extra: () => {
    const path = document.querySelector(".silhouette-line path");
    if (!path) return;
    if (reduceMotion) {
      gsap.set(path, { strokeDashoffset: 0 });
      return;
    }
    gsap.fromTo(
      path,
      { strokeDashoffset: 1400 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-container",
          start: pct(RANGES.form, 0),
          end: pct(RANGES.form, 0.8),
          scrub: 0.6,
        },
      },
    );
  },
});
fadeScene(".scene--experience", RANGES.experience, {
  extra: () => {
    ["a", "b", "c"].forEach((k, i) => {
      const el = document.querySelector(`.callout--${k}`);
      if (!el) return;
      if (reduceMotion) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, x: -14 },
        {
          opacity: 1,
          x: 0,
          duration: 0.18,
          ease: "none",
          scrollTrigger: {
            trigger: ".scroll-container",
            start: pct(RANGES.experience, 0.1 + i * 0.22),
            end: pct(RANGES.experience, 0.3 + i * 0.22),
            scrub: 0.6,
          },
        },
      );
    });
  },
});
fadeScene(".scene--horse", RANGES.horse, {
  childReveal: false,
  extra: () => {
    const story = document.querySelector(".horse-story");
    if (story) {
      if (reduceMotion) {
        gsap.set(story, { opacity: 1 });
      } else {
        gsap.fromTo(
          story,
          { opacity: 0, y: 30, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.16,
            ease: "none",
            scrollTrigger: {
              trigger: ".scroll-container",
              start: pct(RANGES.horse, 0.02),
              end: pct(RANGES.horse, 0.18),
              scrub: 0.6,
            },
          },
        );
      }
    }
    ["a", "b"].forEach((k, i) => {
      const el = document.querySelector(`.horse-note--${k}`);
      if (!el) return;
      if (reduceMotion) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.14,
          ease: "none",
          scrollTrigger: {
            trigger: ".scroll-container",
            start: pct(RANGES.horse, 0.34 + i * 0.24),
            end: pct(RANGES.horse, 0.5 + i * 0.24),
            scrub: 0.6,
            toggleActions: "play reverse play reverse",
          },
        },
      );
    });
  },
});
fadeScene(".scene--precision", RANGES.precision, {
  childReveal: false,
  extra: () => {
    gsap.fromTo(
      ".precision-word",
      { opacity: 0, letterSpacing: "0.1em" },
      {
        opacity: 1,
        letterSpacing: "0.34em",
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-container",
          start: pct(RANGES.precision, 0),
          end: pct(RANGES.precision, 0.5),
          scrub: 0.6,
        },
      },
    );
  },
});
fadeScene(".scene--finale", RANGES.finale, {
  childReveal: false,
  extra: () => {
    gsap.fromTo(
      ".finale-heading",
      { opacity: 0, y: 30, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-container",
          start: pct(RANGES.finale, 0),
          end: pct(RANGES.finale, 0.4),
          scrub: 0.6,
        },
      },
    );
  },
});
fadeScene(".scene--cta", RANGES.cta, { holdAtEnd: true });

/* breathing hold on the final horse pose */
let breatheTween = null;
ScrollTrigger.create({
  trigger: ".scroll-container",
  start: pct(RANGES.finale, 0),
  end: pct(RANGES.finale, 0.75),
  onToggle: (self) => {
    if (reduceMotion) return;
    if (self.isActive && !breatheTween) {
      breatheTween = gsap.to("#sequence-canvas", {
        scale: 1.015,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    } else if (!self.isActive && breatheTween) {
      breatheTween.kill();
      gsap.set("#sequence-canvas", { scale: 1 });
      breatheTween = null;
    }
  },
});

/* scroll cue disappears immediately once the user commits to scrolling */
gsap.to("#scroll-cue", {
  opacity: 0,
  duration: 0.2,
  ease: "none",
  scrollTrigger: {
    trigger: ".scroll-container",
    start: "0% top",
    end: "4% top",
    scrub: 0.6,
  },
});

/* --------------------------------------------------------------------------
   6. PROGRESS UI
   -------------------------------------------------------------------------- */
const STAGES = [
  { label: "Design", range: RANGES.design },
  {
    label: "Performance",
    range: [RANGES.performance[0], RANGES.typeMoment[1]],
  },
  { label: "Form", range: RANGES.form },
  { label: "Experience", range: RANGES.experience },
  { label: "Precision", range: RANGES.precision },
  { label: "Legacy", range: [RANGES.horse[0], RANGES.cta[1]] },
];

const progressUI = document.querySelector(".progress-ui");
const progressCurrentEl = document.querySelector(".progress-current");
const progressLabelEl = document.querySelector(".progress-label");
let activeStage = -1;

function updateProgressUI(p) {
  const visible = p > RANGES.hero[1] * 0.6 && p < RANGES.cta[1];
  progressUI.classList.toggle("is-visible", visible);

  let stageIndex = STAGES.findIndex((s) => p >= s.range[0] && p <= s.range[1]);
  if (stageIndex === -1) {
    // between stages: keep showing the nearer one
    stageIndex = STAGES.reduce(
      (closest, s, i) => (p > s.range[1] ? i : closest),
      activeStage < 0 ? 0 : activeStage,
    );
  }
  if (stageIndex !== activeStage && stageIndex >= 0) {
    activeStage = stageIndex;
    progressCurrentEl.textContent = pad(stageIndex + 1, 2);
    if (reduceMotion) {
      progressLabelEl.textContent = STAGES[stageIndex].label;
    } else {
      gsap.to(progressLabelEl, {
        opacity: 0,
        y: -6,
        duration: 0.18,
        ease: "none",
        onComplete: () => {
          progressLabelEl.textContent = STAGES[stageIndex].label;
          gsap.fromTo(
            progressLabelEl,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.22 },
          );
        },
      });
    }
  }
}

/* --------------------------------------------------------------------------
   7. AMBIENT LIGHTING
   -------------------------------------------------------------------------- */
const lightOverlay = document.getElementById("light-overlay");
const lightSweep = document.getElementById("light-sweep");
const AMBIENT_STOPS = [
  { at: 0.0, color: "#240509", opacity: 0.55 },
  { at: 0.2, color: "#3A0B10", opacity: 0.4 },
  { at: 0.44, color: "#0B1214", opacity: 0.5 }, // cockpit — cooler
  { at: 0.57, color: "#000000", opacity: 0.35 }, // horse begins
  { at: 0.75, color: "#2A0509", opacity: 0.55 }, // deep red glow
  { at: 1.0, color: "#120306", opacity: 0.5 },
];

function lerpColor(a, b, t) {
  const pa = parseInt(a.slice(1), 16),
    pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255,
    ag = (pa >> 8) & 255,
    ab = pa & 255;
  const br = (pb >> 16) & 255,
    bg = (pb >> 8) & 255,
    bb = pb & 255;
  const r = Math.round(ar + (br - ar) * t),
    g = Math.round(ag + (bg - ag) * t),
    bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

function updateAmbient(p) {
  let i = 0;
  while (i < AMBIENT_STOPS.length - 2 && p > AMBIENT_STOPS[i + 1].at) i++;
  const s0 = AMBIENT_STOPS[i],
    s1 = AMBIENT_STOPS[i + 1];
  const t =
    s1.at === s0.at
      ? 0
      : Math.min(1, Math.max(0, (p - s0.at) / (s1.at - s0.at)));
  const color = lerpColor(s0.color, s1.color, t);
  const opacity = s0.opacity + (s1.opacity - s0.opacity) * t;
  lightOverlay.style.background = `radial-gradient(120% 90% at 50% 20%, ${color} 0%, transparent 60%)`;
  lightOverlay.style.opacity = opacity;

  if (!reduceMotion) {
    const sweepX = -60 + p * 260;
    lightSweep.style.transform = `translateX(${sweepX}%)`;
  }
}

/* --------------------------------------------------------------------------
   8. PARTICLES (subtle, canvas-based, lightweight)
   -------------------------------------------------------------------------- */
const pCanvas = document.getElementById("particles-canvas");
const pCtx = pCanvas.getContext("2d");
let particles = [];
const PARTICLE_COUNT = reduceMotion ? 0 : isMobile ? 18 : 46;

function resizeParticles() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeParticles);
resizeParticles();

function initParticles() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      r: Math.random() * 1.4 + 0.4,
      vy: -(Math.random() * 0.15 + 0.03),
      vx: (Math.random() - 0.5) * 0.06,
      a: Math.random() * 0.5 + 0.2,
    });
  }
}

let particleIntensity = 0;
function updateParticleIntensity(p) {
  // subtle throughout, more present during the horse reveal
  const base = 0.12;
  const horseBoost =
    p > RANGES.horse[0] && p < RANGES.finale[1]
      ? 0.55 * Math.min(1, (p - RANGES.horse[0]) / 0.1)
      : 0;
  particleIntensity = base + horseBoost;
}

function animateParticles() {
  if (PARTICLE_COUNT === 0) return;
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  pCanvas.style.opacity = particleIntensity.toFixed(2);
  for (const pt of particles) {
    pt.x += pt.vx;
    pt.y += pt.vy;
    if (pt.y < -4) pt.y = pCanvas.height + 4;
    if (pt.x < -4) pt.x = pCanvas.width + 4;
    if (pt.x > pCanvas.width + 4) pt.x = -4;
    pCtx.beginPath();
    pCtx.fillStyle = `rgba(243,238,233,${pt.a})`;
    pCtx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
    pCtx.fill();
  }
  requestAnimationFrame(animateParticles);
}
if (PARTICLE_COUNT > 0) {
  initParticles();
  requestAnimationFrame(animateParticles);
}

/* --------------------------------------------------------------------------
   11. NAV SMOOTH-SCROLL LINKS
   -------------------------------------------------------------------------- */
document.querySelectorAll(".nav-links a[data-nav]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.dataset.nav;
    const range = RANGES[target];
    if (!range) return;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    lenis.scrollTo(maxScroll * range[0], { duration: 1.6 });
  });
});

/* --------------------------------------------------------------------------
   12. SEQUENCE HAND-OFF
   Once the pinned frame story finishes, hide the fixed canvas/scenes so the
   normal-flow content below is never covered by an invisible fixed layer.
   -------------------------------------------------------------------------- */
ScrollTrigger.create({
  trigger: ".scroll-container",
  start: "top top",
  end: "bottom bottom",
  onLeave: () => document.body.classList.add("sequence-done"),
  onEnterBack: () => document.body.classList.remove("sequence-done"),
});

/* --------------------------------------------------------------------------
   13. REVEAL-ON-SCROLL for normal-flow marketing sections
   A single, non-scrubbed fade-and-rise — distinct from the pinned
   crossfades above, and only plays once per direction.
   -------------------------------------------------------------------------- */
document.querySelectorAll(".reveal").forEach((el) => {
  if (reduceMotion) {
    gsap.set(el, { opacity: 1 });
    return;
  }
  gsap.fromTo(
    el,
    { opacity: 0, y: 36, filter: "blur(6px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    },
  );
});

/* --------------------------------------------------------------------------
   14. MODEL CAROUSEL
   -------------------------------------------------------------------------- */
(function initModelCarousel() {
  const track = document.getElementById("model-slides");
  const dotsWrap = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll(".model-slide");
  if (!slides.length) return;

  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", `Go to model ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll(".carousel-dot");

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
  render();
})();
