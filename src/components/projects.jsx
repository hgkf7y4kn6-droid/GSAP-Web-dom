import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PreviewFlyout from "./preview-flyout";
import { useMagnetic } from "../hooks/useMagnetic";
import { attachTilt } from "../lib/weight";
import { lovedProjects, projectLists } from "../../constants/index.js";

// Interleave the two lists so the cards alternate left and right beside the
// computer: popular, loved, popular, loved... When one list is longer, its
// extra projects follow at the end rather than being dropped.
const projects = Array.from(
  { length: Math.max(projectLists.length, lovedProjects.length) },
  (_, i) => [
    projectLists[i] && { ...projectLists[i], category: "Most popular" },
    lovedProjects[i] && { ...lovedProjects[i], category: "Most loved" },
  ],
)
  .flat()
  .filter(Boolean);

const Projects = () => {
  const ref = useRef();
  const [previewing, setPreviewing] = useState(null);
  const closePreview = useCallback(() => setPreviewing(null), []);
  useMagnetic(ref, "#projects .card .repo-link", 0.2);

  // Each card is three layers, and each layer owns one transform so GSAP and
  // CSS never fight over the same element:
  //   li     slides in from its own side and floats up into place
  //   .float drifts at its own speed while scrolling (parallax)
  //   .card  lifts, tilts and squishes under the pointer (CSS, see .weighted)
  useGSAP(
    () => {
      // iOS only applies :active (the press squish) when a touch listener exists.
      const noop = () => {};
      document.addEventListener("touchstart", noop, { passive: true });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray("#projects .list > li");
        const floats = items.map((li) => li.querySelector(".float"));
        const avgHeight = () =>
          floats.reduce((sum, el) => sum + el.offsetHeight, 0) / floats.length;

        items.forEach((li, i) => {
          const card = li.querySelector(".card");
          const float = floats[i];

          // Floats up into place as it scrolls in. The shadow deepens with it,
          // so the card reads as lifting off the canvas rather than fading in.
          gsap.from(li, {
            x: i % 2 === 0 ? -48 : 48,
            y: 40,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: li,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
          gsap.fromTo(
            card,
            { "--elev": 0 },
            {
              "--elev": 1,
              ease: "none",
              scrollTrigger: {
                trigger: li,
                start: "top 95%",
                end: "top 55%",
                scrub: 0.6,
              },
            },
          );

          // Heavier (taller) cards drift slower than the scroll, lighter ones
          // faster, alternating slightly so neighbours separate in depth.
          const speed = () =>
            gsap.utils.clamp(
              0.88,
              1.12,
              1 - (float.offsetHeight / avgHeight() - 1) * 0.6 + (i % 2 ? 0.04 : -0.04),
            );
          gsap.fromTo(
            float,
            { y: () => (1 - speed()) * -120 },
            {
              y: () => (1 - speed()) * 120,
              ease: "none",
              scrollTrigger: {
                trigger: li,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      // Tilt toward wherever the cursor presses. Mouse and trackpad only.
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups = gsap.utils
            .toArray("#projects .card")
            .map((card) => attachTilt(card));
          return () => cleanups.forEach((fn) => fn());
        },
      );

      return () => document.removeEventListener("touchstart", noop);
    },
    { scope: ref },
  );

  return (
    <section id="projects" ref={ref} aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="sr-only">
        Projects
      </h2>

      <ul className="list">
        {projects.map(
          ({
            name,
            summary,
            site,
            repo,
            category,
            problem,
            metrics = [],
            stack = [],
            preview = false,
            cover,
          }) => (
            <li key={name}>
              <div className="float">
                <article className="card weighted glow-frames">
                  {/* Front-page preview: opens as the card lifts on hover or
                      keyboard focus; always shown on touch screens. */}
                  {cover && (
                    <div className="cover">
                      <div>
                        <img
                          src={cover}
                          alt={`Preview of the ${name} ${site ? "website" : "repository"}`}
                          width="960"
                          height="600"
                          decoding="async"
                          fetchPriority="low"
                        />
                        <span className="cover-label">
                          {site ? "Live site" : "Repository"}
                        </span>
                      </div>
                    </div>
                  )}
                  <p className="category">{category}</p>
                  <h3>
                    {/* Stretched link: its ::after covers the whole card, so a
                        click anywhere opens the live site (or the repo when
                        there's no site). The repo link and preview button sit
                        above it and keep their own targets. */}
                    <a
                      className="card-link"
                      href={site ?? repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${name}: ${site ? "visit site" : "view repository"} (opens in a new tab)`}
                    >
                      {name}
                    </a>
                  </h3>
                  {problem && <p className="problem">{problem}</p>}
                  <p className="summary">{summary}</p>
                  {metrics.length > 0 && (
                    <dl className="metrics">
                      {metrics.map(({ value, label }) => (
                        <div key={label}>
                          <dt>{value}</dt>
                          <dd>{label}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {stack.length > 0 && (
                    <p className="stack">{stack.join(" · ")}</p>
                  )}
                  <a
                    className="repo-link"
                    href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View repository: ${name} (opens in a new tab)`}
                  >
                    View repository ↗
                  </a>
                  {preview && site && (
                    <button
                      type="button"
                      className="preview-btn"
                      onClick={() => setPreviewing({ name, url: site })}
                    >
                      Live preview
                    </button>
                  )}
                </article>
              </div>
            </li>
          ),
        )}
      </ul>
      {previewing && (
        <PreviewFlyout project={previewing} onClose={closePreview} />
      )}
    </section>
  );
};

export default Projects;
