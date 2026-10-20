import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const videoRef = useRef();

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  useGSAP(() => {
    const heroSplit = new SplitText(".title", { type: "chars, words" });
    const paragraphSplit = new SplitText(".subtitle", { type: "lines" });

    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

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

  }, []);

  useGSAP(
    () => {
      // clamp() keeps the start from landing above the top of the page, so the
      // pinned video doesn't jump away from where the layout puts it.
      const startValue = isMobile ? "clamp(top 50%)" : "clamp(center 60%)";
      const endValue = "top top";

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

      const video = videoRef.current;

      // Pin the video while it plays through the rest of the hero, and release
      // it once the projects section reaches the top of the screen so the
      // animation finishes inside that section.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: video,
          start: startValue,
          endTrigger: "#projects",
          end: endValue,
          scrub: true,
          pin: true,
        },
      });

      // Scrub the video from its first to its last frame as the user scrolls,
      // shrinking the computer slightly as it settles into the next section.
      // On desktop it also drifts right, clearing the left column for the
      // project list.
      const animateVideo = () => {
        tl.to(video, {
          currentTime: video.duration,
          scale: 0.8,
          x: isDesktop ? "20vw" : 0,
          ease: "none",
        });
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
    { dependencies: [isMobile, isDesktop], revertOnUpdate: true },
  );

  return (
    <>
      <section id="hero" className="noisy">
        <h1 className="title">Riches Digital Ventures</h1>

        <video
          aria-label="left paper ui"
          className="left-paper-ui"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/paper-ui.mp4" type="video/mp4" />
          <source src="/videos/paper-ui.webm" type="video/webm" />
        </video>
        <video
          aria-label="right paper ui"
          className="right-paper-ui"
          autoPlay
          muted
          loop
          playsInline
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
            <div className="hidden space-y-5 md:block">
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
              <a href="#RichesDigitalVentures">View projects</a>
            </div>
          </div>
        </div>
      </section>

      <div className="video absolute inset-0">
        <video
          ref={videoRef}
          aria-label="hero animation"
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>
      </div>
    </>
  );
};

export default Hero;
