import { lazy, Suspense } from "react";

// three.js and the scene only download once we know this device should run them.
const HeroCanvas = lazy(() => import("./HeroCanvas.jsx"));

// Checked once per page load. The island renders client-side only, so this
// never runs on the server.
// Skip the scene when the visitor asked to save data, on low-memory devices,
// and where WebGL is unavailable. The static poster stays in place instead.
const canRender3D = () => {
  if (navigator.connection?.saveData) return false;
  if ((navigator.deviceMemory ?? 8) < 4) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

const HeroScene = () => {
  if (!canRender3D()) return null;
  return (
    <Suspense fallback={null}>
      <HeroCanvas />
    </Suspense>
  );
};

export default HeroScene;
