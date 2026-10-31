import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { startSmoothScroll } from "./smooth-scroll";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

// Phones resize the viewport as the address bar shows and hides while
// scrolling. Ignoring those resizes stops scroll animations from
// recalculating mid-scroll, which is what makes them stutter.
ScrollTrigger.config({ ignoreMobileResize: true });

const MOTION = "(prefers-reduced-motion: no-preference)";
const FINE_MOTION = "(pointer: fine) and (prefers-reduced-motion: no-preference)";
const mm = gsap.matchMedia();

startSmoothScroll();

// Fade in the glassy nav background once the page scrolls. The blur layer is
// always there and only its opacity changes, which phones can animate far
// more smoothly than an animated backdrop-filter.
const nav = document.querySelector(".site-nav");
if (nav) {
  ScrollTrigger.create({
    start: 40,
    end: "max",
    onToggle: ({ isActive }) => nav.classList.toggle("scrolled", isActive),
  });
}

// A small follower ring that grows over interactive elements.
const cursor = document.querySelector(".cursor");
mm.add(FINE_MOTION, () => {
  if (!cursor) return;
  const x = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3" });
  const y = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3" });
  const move = (e) => {
    x(e.clientX);
    y(e.clientY);
    cursor.dataset.active = "true";
    cursor.dataset.hover = String(
      !!e.target.closest("a, button, input, [role='button']"),
    );
  };
  window.addEventListener("pointermove", move);
  return () => window.removeEventListener("pointermove", move);
});

// Elements marked data-magnetic get a subtle pull toward the pointer.
mm.add(FINE_MOTION, () => {
  const cleanups = gsap.utils.toArray("[data-magnetic]").map((el) => {
    const strength = Number(el.dataset.magnetic) || 0.25;
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });
  return () => cleanups.forEach((fn) => fn());
});

mm.add(MOTION, () => {
  // Headings marked data-reveal rise line by line from behind a mask.
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 100,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }),
    });
  });

  // Circuit traces draw themselves as they scroll through.
  gsap.utils.toArray(".divider").forEach((divider) => {
    gsap.from(divider.querySelectorAll("path"), {
      drawSVG: "0%",
      stagger: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: divider,
        start: "top 90%",
        end: "bottom 55%",
        scrub: 0.5,
      },
    });
    gsap.from(divider.querySelectorAll("circle"), {
      opacity: 0,
      scale: 0,
      transformOrigin: "50% 50%",
      stagger: 0.12,
      scrollTrigger: {
        trigger: divider,
        start: "top 80%",
        end: "bottom 55%",
        scrub: 0.5,
      },
    });
  });

  // Elements marked data-slide ease in from their side as they scroll in.
  gsap.utils.toArray("[data-slide]").forEach((el) => {
    const distance = window.matchMedia("(min-width: 768px)").matches ? 48 : 24;
    gsap.from(el, {
      x: el.dataset.slide === "right" ? distance : -distance,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    });
  });
});
