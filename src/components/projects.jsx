import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";
import PreviewFlyout from "./preview-flyout";
import { useMagnetic } from "../hooks/useMagnetic";
import { lovedProjects, projectLists } from "../../constants/index.js";

// Interleave the two lists so the cards alternate left and right beside the
// computer: popular, loved, popular, loved...
const projects = projectLists.flatMap((popular, i) => [
  { ...popular, category: "Most popular" },
  ...(lovedProjects[i] ? [{ ...lovedProjects[i], category: "Most loved" }] : []),
]);

const Projects = () => {
  const prefersReducedMotion = useMediaQuery({
    query: "(prefers-reduced-motion: reduce)",
  });

  const ref = useRef();
  const [previewing, setPreviewing] = useState(null);
  const closePreview = useCallback(() => setPreviewing(null), []);
  useMagnetic(ref, "#projects .card a", 0.2);

  // Slide each card in from its own side as it scrolls into view.
  useGSAP(() => {
    if (prefersReducedMotion) return;

    gsap.utils.toArray("#projects .card").forEach((card, i) => {
      gsap.from(card, {
        x: i % 2 === 0 ? -48 : 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, [prefersReducedMotion]);

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
            url,
            category,
            problem,
            metrics = [],
            stack = [],
            linkLabel = "View repo",
            preview = false,
          }) => (
            <li key={name}>
              <article className="card">
                <p className="category">{category}</p>
                <h3>{name}</h3>
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
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${linkLabel}: ${name} (opens in a new tab)`}
                >
                  {linkLabel} ↗
                </a>
                {preview && (
                  <button
                    type="button"
                    className="preview-btn"
                    onClick={() => setPreviewing({ name, url })}
                  >
                    Live preview
                  </button>
                )}
              </article>
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
