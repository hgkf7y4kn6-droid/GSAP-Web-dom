import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";

const Hero = () => {
  useGSAP(() => {
    const heroSplit = new SplitText(".title", { type: "chars, words" });
  }, []);

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

        <video
          aria-label="hero animation"
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>

        <div className="body">
          <div className="content">
            <div className="hidden space-y-5 md:block">
              <p>Cool. Crisp. Classic.</p>
              <p className="subtitle">
                Sip the Spirit <br /> of Summer
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
    </>
  );
};

export default Hero;
