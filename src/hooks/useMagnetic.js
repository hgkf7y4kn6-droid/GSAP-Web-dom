import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Gives matching elements a subtle pull toward the pointer. Fine pointers only.
export const useMagnetic = (scope, selector, strength = 0.25) => {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups = gsap.utils.toArray(selector).map((el) => {
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
        },
      );
    },
    { scope },
  );
};
