import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// A circuit trace that draws itself as it scrolls through, echoing the traces
// in the circuit-core film. Static when motion is reduced.
const CircuitDivider = ({ flip = false }) => {
  const ref = useRef();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current.querySelectorAll("path"), {
          drawSVG: "0%",
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        });
        gsap.from(ref.current.querySelectorAll("circle"), {
          opacity: 0,
          scale: 0,
          transformOrigin: "50% 50%",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="divider" aria-hidden="true">
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        fill="none"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        <path className="trace" d="M0 40H300L330 20H620L650 60H900L930 40H1200" />
        <path className="trace amber" d="M0 52H180L200 62H460L480 40H760L780 28H1040L1060 52H1200" />
        <circle className="node" cx="330" cy="20" r="3" />
        <circle className="node" cx="650" cy="60" r="3" />
        <circle className="node amber" cx="480" cy="40" r="3" />
        <circle className="node amber" cx="1040" cy="28" r="3" />
      </svg>
    </div>
  );
};

export default CircuitDivider;
