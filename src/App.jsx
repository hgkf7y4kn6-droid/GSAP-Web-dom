import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Projects from "./components/projects";
import About from "./components/about";
import Contact from "./components/contact";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Phones resize the viewport as the address bar shows and hides while
// scrolling. Ignoring those resizes stops scroll animations from
// recalculating mid-scroll, which is what makes them stutter.
ScrollTrigger.config({ ignoreMobileResize: true });

const App = () => {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
    </>
  );
};

export default App;
