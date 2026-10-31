import { setScrollLocked } from "./smooth-scroll";

// One native <dialog> shows any project's live site without leaving the page.
// Browsers don't report when a site refuses to be framed, so the link to open
// it in a new tab is always visible.
const dialog = document.querySelector("#preview");

if (dialog) {
  const frame = dialog.querySelector("iframe");
  const title = dialog.querySelector("h2");
  const external = dialog.querySelector("[data-external]");
  const status = dialog.querySelector(".status");
  const sizes = dialog.querySelectorAll("[data-size]");

  const setSize = (size) => {
    frame.style.width = size === "mobile" ? "390px" : "100%";
    sizes.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.size === size)));
  };

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-preview-url]");
    if (!opener) return;
    const { previewUrl, previewName } = opener.dataset;
    title.textContent = previewName;
    dialog.setAttribute("aria-label", `Live preview: ${previewName}`);
    frame.title = `${previewName} live site`;
    external.href = previewUrl;
    status.hidden = false;
    frame.src = previewUrl;
    setSize("desktop");
    dialog.showModal();
    setScrollLocked(true);
  });

  frame.addEventListener("load", () => {
    if (frame.src !== "about:blank") status.hidden = true;
  });

  sizes.forEach((b) => b.addEventListener("click", () => setSize(b.dataset.size)));
  dialog.querySelector(".close").addEventListener("click", () => dialog.close());

  // A click on the backdrop lands on the dialog element itself.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    setScrollLocked(false);
    frame.src = "about:blank";
  });
}
