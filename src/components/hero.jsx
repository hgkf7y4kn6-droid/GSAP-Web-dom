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
        <h1 className="title">Software Dev</h1>

        <img
          src="/images/hero-left-paper-ui.png"
          alt="left paper ui"
          className="left-paper-ui"
        />
        <img
          src="/images/hero-right-paper-ui.png"
          alt="right paper ui"
          className="right-paper-ui"
        />

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
