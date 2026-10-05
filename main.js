// Wait until the full DOM is loaded before running scripts
window.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger plugin from GSAP
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector("header");

  // ==========================
  // Mobile Menu Toggle
  // ==========================

  // Toggles mobile nav visibility on hamburger click
  function toggleMobileNav() {
    document.getElementById("mobileMenu").classList.toggle("show");
  }

  // Expose function globally to use in inline HTML
  window.toggleMobileNav = toggleMobileNav;

  const whatsappWidget = document.querySelector(".whatsapp-widget");
  if (whatsappWidget) {
    whatsappWidget.querySelector(".floating-whatsapp").addEventListener("click", () => whatsappWidget.classList.toggle("is-open"));
    whatsappWidget.querySelector(".whatsapp-close").addEventListener("click", () => whatsappWidget.classList.remove("is-open"));
    let dragging = false, moved = false, offsetX = 0, offsetY = 0;
    whatsappWidget.addEventListener("pointerdown", event => { dragging = true; moved = false; const box = whatsappWidget.getBoundingClientRect(); offsetX = event.clientX - box.left; offsetY = event.clientY - box.top; whatsappWidget.setPointerCapture(event.pointerId); });
    whatsappWidget.addEventListener("pointermove", event => { if (!dragging) return; moved = true; const x = Math.max(8, Math.min(window.innerWidth - whatsappWidget.offsetWidth - 8, event.clientX - offsetX)); const y = Math.max(8, Math.min(window.innerHeight - whatsappWidget.offsetHeight - 8, event.clientY - offsetY)); whatsappWidget.style.left = `${x}px`; whatsappWidget.style.top = `${y}px`; whatsappWidget.style.right = "auto"; whatsappWidget.style.transform = "none"; });
    whatsappWidget.addEventListener("pointerup", () => { dragging = false; });
    whatsappWidget.querySelector(".floating-whatsapp").addEventListener("click", event => { if (moved) { event.stopImmediatePropagation(); moved = false; } }, true);
  }

  const progress = document.querySelector(".scroll-progress");
  const updateProgress = () => { if (progress) progress.style.width = `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`; };
  window.addEventListener("scroll", updateProgress, { passive: true }); updateProgress();
  window.addEventListener("pointermove", event => { document.body.style.setProperty("--pointer-x", `${event.clientX}px`); document.body.style.setProperty("--pointer-y", `${event.clientY}px`); });
  document.querySelectorAll("a[href$='.html'], a[href^='index.html']").forEach(link => link.addEventListener("click", event => { const url = link.href; if (!url.includes("#") && new URL(url).origin === location.origin) { event.preventDefault(); const curtain = document.querySelector(".page-transition"); gsap.to(curtain, { scaleY: 1, duration: .35, ease: "power2.in", onComplete: () => location.href = url }); } }));
  gsap.utils.toArray(".timeline-img, .collection-image").forEach(image => gsap.to(image, { yPercent: -8, ease: "none", scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: true } }));

  // ==========================
  // Initial Page Load Animations
  // ==========================

  function runInitialAnimations() {
    // Create a timeline with default easing
    const onLoadTl = gsap.timeline({ defaults: { ease: "power2.out" } });

    onLoadTl
      // Animate header border width expansion
      .to(
        "header",
        {
          "--border-width": "100%",
          duration: 3,
        },
        0
      )
      // Slide in desktop nav links & sidebar icons from above
      .from(
        ".desktop-nav a, .social-sidebar a",
        {
          y: -100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        0
      )
      // Animate sidebar border height
      .to(
        ".social-sidebar",
        {
          "--border-height": "100%",
          duration: 10,
        },
        0
      )
      // Fade in hero heading
      .to(
        ".hero-content h1",
        {
          opacity: 1,
          duration: 1,
        },
        0
      )
      // Animate text stroke to solid color
      .to(
        ".hero-content h1",
        {
          delay: 0.5,
          duration: 1.2,
          color: "var(--sienna)",
          "-webkit-text-stroke": "0px var(--sienna)",
        },
        0
      )
      // Slide in each line of the heading from the right
      .from(
        ".hero-content .line",
        {
          x: 100,
          delay: 1,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        0
      )
      .to(
        ".hero-subtitle, .hero-proof",
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        "-=0.35"
      )
      // Reveal the bottle wrapper
      .to(
        ".hero-bottle-wrapper",
        {
          opacity: 1,
          scale: 1,
          delay: 1.5,
          duration: 1.3,
          ease: "power3.out",
        },
        0
      )
      // Pop-in stamp image with scaling
      .to(
        ".hero-stamp",
        {
          opacity: 1,
          scale: 1,
          delay: 2,
          duration: 0.2,
          ease: "back.out(3)",
        },
        0
      )
      // Subtle vibration/bounce effect on the stamp
      .to(
        ".hero-stamp",
        {
          y: "+=5",
          x: "-=3",
          repeat: 2,
          yoyo: true,
          duration: 0.05,
          ease: "power1.inOut",
        },
        0
      );
  }

  // ==========================
  // Reusable Scroll-Based Animation Setup
  // ==========================

  function pinAndAnimate({
    trigger,
    endTrigger,
    pin,
    animations,
    markers = false,
    headerOffset = 0,
  }) {
    // Define scroll end position with header offset
    const end = `top top+=${headerOffset}`;

    // Create a GSAP timeline connected to ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: `top top+=${headerOffset}`,
        endTrigger,
        end,
        scrub: true,
        pin,
        pinSpacing: false,
        markers: markers, // for debugging
        invalidateOnRefresh: true, // ensures recalculation on resize
      },
    });

    // Loop through each animation object
    animations.forEach(({ target, vars, position = 0 }) => {
      tl.to(target, vars, position);
    });
  }

  // ==========================
  // ScrollTrigger Configurations for Desktop & Mobile
  // ==========================

  function setupScrollAnimations() {
    const headerOffset = header.offsetHeight - 1;

    // Use matchMedia to handle responsive behaviors
    ScrollTrigger.matchMedia({
      // Desktop scroll animations
      "(min-width: 769px)": function () {
        // 1. Bottle animates on scroll from hero to intro
        pinAndAnimate({
          trigger: ".hero",
          endTrigger: ".section-intro",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.8 } },
          ],
          headerOffset,
        });

        // 2. Bottle shifts right during the intro section
        pinAndAnimate({
          trigger: ".section-intro",
          endTrigger: ".timeline-entry:nth-child(even)",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "30%" } },
          ],
          markers: false,
          headerOffset,
        });

        // 3. Bottle shifts left during the first timeline entry
        pinAndAnimate({
          trigger: ".timeline-entry:nth-child(even)",
          endTrigger: ".timeline-entry:nth-child(odd)",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: -10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "-25%" } },
          ],
          markers: false,
          headerOffset,
        });
      },

      // Mobile scroll animation (lightweight for smaller viewports)
      "(max-width: 768px)": function () {
        gsap.to(".hero-bottle-wrapper", {
          opacity: 1,
          duration: 1,
          delay: 0.5,
        });

        // Lightweight mobile scroll experience: the bottle and hero copy
        // respond to the user's scroll without pinning the small viewport.
        gsap.to(".hero-bottle", {
          y: "18%",
          rotate: 0,
          scale: 0.82,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(".hero-content", {
          y: "-12%",
          opacity: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        [".section-intro", ".timeline-entry", ".collection-section", ".testimonials-section"].forEach((section) => {
          gsap.from(section, {
            y: 45,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.7,
            },
          });
        });
      },
    });
  }

  // ==========================
  // Init Everything on Load
  // ==========================

  runInitialAnimations(); // Load-in animations
  setupScrollAnimations(); // Scroll-based animations

  // Final recalculation for all ScrollTriggers
  ScrollTrigger.refresh();
});
