import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const mediaRef = useRef();
  const videoRef = useRef();

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const prefersReducedMotion = useMediaQuery({
    query: "(prefers-reduced-motion: reduce)",
  });

  useGSAP(() => {
    const heroSplit = new SplitText(".title", { type: "chars, words" });
    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

    // Pause the decorative paper animations while the hero is off screen so
    // phones aren't decoding video nobody can see.
    const papers = gsap.utils.toArray(".left-paper-ui, .right-paper-ui");
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      onToggle: ({ isActive }) =>
        papers.forEach((paper) =>
          isActive && !prefersReducedMotion
            ? paper.play().catch(() => {})
            : paper.pause(),
        ),
    });

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

  useGSAP(
    () => {
      if (!prefersReducedMotion) {
        // On mobile the right paper sits just above the paragraph, so both
        // papers drift up there instead of the right one moving down into it.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .to(".right-paper-ui", { y: isMobile ? -150 : 200 }, 0)
          .to(".left-paper-ui", { y: isMobile ? -150 : -200 }, 0);
      }

      const video = videoRef.current;

      // Pin the computer from the very top of the page through the end of the
      // projects section, so it stays the centrepiece while the project cards
      // pass on either side. The small scrub delay smooths out video seeking
      // on touch screens.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          endTrigger: "#projects",
          end: "bottom bottom",
          scrub: 0.5,
          pin: mediaRef.current,
          anticipatePin: 1,
        },
      });

      // On tablets and up, ease the computer down a little as the projects
      // arrive so the cards have room beside it.
      if (!isMobile) {
        gsap.to(mediaRef.current, {
          scale: 0.8,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "#projects",
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
          },
        });
      }

      // Scrub the video from its first to its last frame as the user scrolls.
      const animateVideo = () => {
        tl.to(video, { currentTime: video.duration, ease: "none" });
      };

      if (video.readyState >= 1) {
        animateVideo();
      } else {
        video.addEventListener("loadedmetadata", animateVideo, { once: true });
        // iOS Safari won't load a video until it has played, so start and
        // immediately pause it (it's muted, so this is allowed without a tap).
        video
          .play()
          .then(() => {
            video.pause();
            video.currentTime = 0;
          })
          .catch(() => {});
      }

      return () => video.removeEventListener("loadedmetadata", animateVideo);
    },
    { dependencies: [isMobile, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <>
      <section id="hero">
        <h1 className="title">Riches Digital Ventures</h1>

        <video
          className="left-paper-ui"
          poster="/images/paper-ui-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/paper-ui.mp4" type="video/mp4" />
          <source src="/videos/paper-ui.webm" type="video/webm" />
        </video>
        <video
          className="right-paper-ui"
          poster="/images/paper-ui-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/paper-ui.mp4" type="video/mp4" />
          <source src="/videos/paper-ui.webm" type="video/webm" />
        </video>

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

      <div className="video absolute inset-0">
        <div ref={mediaRef} className="media">
          <div className="glow" aria-hidden="true" />
          <video
            ref={videoRef}
            poster="/images/hero-poster.jpg"
            muted
            playsInline
            preload="auto"
            aria-label="Animated computer screen showing code turning into an app interface"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            <source src="/videos/hero.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </>
  );
};

export default Hero;
