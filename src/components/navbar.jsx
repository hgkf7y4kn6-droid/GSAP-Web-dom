import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { navLinks } from "../../constants/index.js";

const Navbar = () => {
  const navRef = useRef();

  // Fade in the glassy background once the page scrolls. The blur layer is
  // always there and only its opacity changes, which phones can animate far
  // more smoothly than an animated backdrop-filter.
  useGSAP(() => {
    ScrollTrigger.create({
      start: 40,
      end: "max",
      onToggle: ({ isActive }) =>
        navRef.current.classList.toggle("scrolled", isActive),
    });
  });

  return (
    <nav ref={navRef}>
      <div className="container mx-auto flex items-center justify-between gap-4 px-5 py-4 md:py-5">
        <a href="#hero" className="brand">
          <img src="/logo.png" alt="" className="size-9" />
          <span className="sr-only sm:not-sr-only">Riches Digital Ventures</span>
        </a>

        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
