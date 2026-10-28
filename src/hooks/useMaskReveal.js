import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";

// Reveals each line of the matching headings from behind a mask as they scroll in.
export const useMaskReveal = (scope, selector) => {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(selector).forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 100,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.08,
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              }),
          });
        });
      });
    },
    { scope },
  );
};
