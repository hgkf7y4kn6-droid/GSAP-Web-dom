import gsap from "gsap";
import { DrawSVGPlugin, ScrollTrigger, SplitText } from "gsap/all";
import { useEffect } from "react";
import { startSmoothScroll } from "./lib/smooth-scroll";
import Cursor from "./components/cursor";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Projects from "./components/projects";
import CircuitDivider from "./components/circuit-divider";
import CircuitBackdrop from "./components/circuit-backdrop";
import About from "./components/about";
import Contact from "./components/contact";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

// Phones resize the viewport as the address bar shows and hides while
// scrolling. Ignoring those resizes stops scroll animations from
// recalculating mid-scroll, which is what makes them stutter.
ScrollTrigger.config({ ignoreMobileResize: true });

const App = () => {
  useEffect(() => startSmoothScroll(), []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <CircuitBackdrop />
      <Cursor />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Projects />
        <CircuitDivider />
        <About />
        <CircuitDivider flip />
        <Contact />
      </main>
    </>
  );
};

export default App;
