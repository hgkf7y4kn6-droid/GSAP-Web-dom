import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// A small follower ring that grows over interactive elements. Fine pointers only.
const Cursor = () => {
  const ref = useRef();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const x = gsap.quickTo(ref.current, "x", { duration: 0.25, ease: "power3" });
        const y = gsap.quickTo(ref.current, "y", { duration: 0.25, ease: "power3" });
        const move = (e) => {
          x(e.clientX);
          y(e.clientY);
          ref.current.dataset.active = "true";
          ref.current.dataset.hover = String(
            !!e.target.closest("a, button, input, [role='button']"),
          );
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      },
    );
  });

  return <div ref={ref} className="cursor" aria-hidden="true" />;
};

export default Cursor;
