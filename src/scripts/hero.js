import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const title = document.querySelector("#hero .title");

if (title) {
  const split = SplitText.create(title, { type: "chars, words" });
  split.chars.forEach((char) => char.classList.add("text-gradient"));

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(split.chars, {
      yPercent: 100,
      opacity: 0,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.05,
    });

    SplitText.create("#hero .subtitle", {
      type: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          opacity: 0,
          yPercent: 100,
          duration: 1.8,
          ease: "expo.out",
          stagger: 0.06,
          delay: 1,
        }),
    });
  });
}
