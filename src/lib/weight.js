// Gives a card physical weight under the cursor: it tilts toward the side the
// pointer presses on. Only sets two CSS variables; the easing that makes the
// motion feel heavy lives in CSS (see .weighted in index.css), where the
// registered properties --rx and --ry are transitioned. That transition is
// what smooths each pointer update, so no animation loop runs here.
const MAX_TILT = 5; // degrees

export const attachTilt = (el, maxTilt = MAX_TILT) => {
  const move = (e) => {
    const r = el.getBoundingClientRect();
    // -0.5 to 0.5 across the card, from its centre.
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    // Pressing on the right edge sinks the right side away from you.
    el.style.setProperty("--ry", `${(px * maxTilt * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-py * maxTilt * 2).toFixed(2)}deg`);
  };
  const leave = () => {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
    leave();
  };
};
