import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { navLinks } from "../../constants/index.js";

const Navbar = () => {
  useGSAP(() => {
    const navTween = gsap.timeline({
      scrollTrigger: {
        trigger: "nav",
        start: "bottom top",
        toggleActions: "play none none reverse",
      },
    });

    navTween.fromTo(
      "nav",
      { backgroundColor: "transparent", backdropFilter: "blur(0px)" },
      {
        backgroundColor: "#00000050",
        backdropFilter: "blur(10px)",
        duration: 1,
        ease: "power1.inOut",
      },
    );
  });

  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="container mx-auto flex flex-col items-center gap-5 px-5 py-5 md:flex-row md:justify-between">
        <a href="#home" className="flex items-center gap-2">
          <img src="/logo.png" alt="Riches Digital Ventures logo" className="size-9" />
          <p>Riches Digital Ventures</p>
        </a>

        <ul className="flex-center gap-7 lg:gap-12">
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
