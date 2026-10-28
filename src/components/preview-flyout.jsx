import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { setScrollLocked } from "../lib/smooth-scroll";

const VIEWPORTS = {
  desktop: { label: "Desktop", width: "100%" },
  mobile: { label: "Mobile", width: "390px" },
};

// A slide-in panel that shows a project's live site without leaving the page.
// Browsers don't report when a site refuses to be framed, so the link to open
// it in a new tab is always visible.
const PreviewFlyout = ({ project, onClose }) => {
  const closeRef = useRef();
  const panelRef = useRef();
  const [viewport, setViewport] = useState("desktop");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current.focus();
    setScrollLocked(true);

    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      // Keep keyboard focus inside the dialog.
      const items = panelRef.current.querySelectorAll(
        "a[href], button:not([disabled])",
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      setScrollLocked(false);
      opener?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="flyout-backdrop" onClick={onClose}>
      <aside
        ref={panelRef}
        className="flyout"
        role="dialog"
        aria-modal="true"
        aria-label={`Live preview: ${project.name}`}
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <div>
            <p className="eyebrow">Live preview</p>
            <h3>{project.name}</h3>
          </div>

          <div className="actions">
            <div role="group" aria-label="Preview size" className="toggle">
              {Object.entries(VIEWPORTS).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={viewport === key}
                  onClick={() => setViewport(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              Open in new tab ↗
            </a>
            <button
              ref={closeRef}
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="frame-wrap">
          {!loaded && <p className="status">Loading preview…</p>}
          <iframe
            key={project.url}
            title={`${project.name} live site`}
            src={project.url}
            style={{ width: VIEWPORTS[viewport].width }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
          />
        </div>

        <p className="hint">
          Preview blank or refused? The site may not allow embedding. Use
          &ldquo;Open in new tab&rdquo; above.
        </p>
      </aside>
    </div>,
    document.body,
  );
};

export default PreviewFlyout;
