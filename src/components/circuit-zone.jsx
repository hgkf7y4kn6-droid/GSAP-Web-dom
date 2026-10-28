import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";

// Wraps the closing sections in one ambient circuit-core film. Phones and
// reduced-motion users get the still frame, and the film only plays while
// this zone is on screen.
const CircuitZone = ({ children }) => {
  const zoneRef = useRef();
  const videoRef = useRef();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const reduced = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });
  const still = isMobile || reduced;

  useGSAP(
    () => {
      const video = videoRef.current;
      if (still || !video) return;
      ScrollTrigger.create({
        trigger: zoneRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) =>
          isActive ? video.play().catch(() => {}) : video.pause(),
      });
    },
    { dependencies: [still], scope: zoneRef },
  );

  return (
    <div ref={zoneRef} className="circuit-zone">
      <div className="backdrop" aria-hidden="true">
        {still ? (
          <img src="/images/circuit-core-poster.jpg" alt="" />
        ) : (
          <video
            ref={videoRef}
            poster="/images/circuit-core-poster.jpg"
            muted
            loop
            playsInline
            preload="none"
          >
            <source src="/videos/circuit-core.webm" type="video/webm" />
            <source src="/videos/circuit-core.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      {children}
    </div>
  );
};

export default CircuitZone;
