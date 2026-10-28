import { useMediaQuery } from "react-responsive";

// The circuit-core film, fixed behind every section of the page. Reduced-motion
// users get the still frame instead.
const CircuitBackdrop = () => {
  const reduced = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });

  return (
    <div className="circuit-backdrop" aria-hidden="true">
      {reduced ? (
        <img src="/images/circuit-core-poster.jpg" alt="" />
      ) : (
        <video
          poster="/images/circuit-core-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/circuit-core.webm" type="video/webm" />
          <source src="/videos/circuit-core.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default CircuitBackdrop;
