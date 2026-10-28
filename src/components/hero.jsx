import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const prefersReducedMotion = useMediaQuery({
    query: "(prefers-reduced-motion: reduce)",
  });

  useGSAP(() => {
    const heroSplit = new SplitText(".title", { type: "chars, words" });
    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

    if (prefersReducedMotion) return;

    const paragraphSplit = new SplitText(".subtitle", { type: "lines" });

    gsap.from(heroSplit.chars, {
      yPercent: 100,
      opacity: 0,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.05,
    });

    gsap.from(paragraphSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
      delay: 1,
    });
  }, [prefersReducedMotion]);

  return (
    <>
      <section id="hero">
        <video
          className="hero-loop"
          poster="/images/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        <h1 className="title">Riches Digital Ventures</h1>

        <svg
          className="arrow"
          viewBox="0 0 16 112"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M8 0v110M1 103l7 7 7-7" />
        </svg>

        <div className="body">
          <div className="content">
            <div className="tagline">
              <p>Move faster. Build smarter. Design bolder.</p>
              <p className="subtitle">
                Applied <br /> Agentic AI
              </p>
            </div>

            <div className="view-cocktails">
              <p className="subtitle">
                Every project on my site is a blend of using modern tools,
                knowledge from my certification and independent learning,
                creative flair, and developed solely by me.
              </p>
              <a href="#projects">View projects</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
