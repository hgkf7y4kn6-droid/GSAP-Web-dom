import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useMaskReveal } from "../hooks/useMaskReveal";

// Three.js only downloads once the Lab nears the viewport.
const LabScene = lazy(() => import("./lab-scene.jsx"));

// A failed 3D scene should never take the rest of the page down with it.
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="fallback">The 3D preview couldn&apos;t load.</p>
    ) : (
      this.props.children
    );
  }
}

const hasWebGL = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};

const Lab = () => {
  const ref = useRef();
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cameraType, setCameraType] = useState("perspective");
  const [fov, setFov] = useState(50);
  const [zoom, setZoom] = useState(110);
  const [dollyRuns, setDollyRuns] = useState(0);
  const [dollying, setDollying] = useState(false);
  const [webgl] = useState(hasWebGL);
  const reduced = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });

  useMaskReveal(ref, "#lab h2");

  useEffect(() => {
    const el = ref.current;
    const preload = new IntersectionObserver(
      ([e]) => e.isIntersecting && setNear(true),
      { rootMargin: "600px 0px" },
    );
    const live = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    preload.observe(el);
    live.observe(el);
    return () => {
      preload.disconnect();
      live.disconnect();
    };
  }, []);

  const perspective = cameraType === "perspective";

  return (
    <section id="lab" ref={ref} aria-labelledby="lab-heading">
      <div className="container mx-auto px-5">
        <p className="eyebrow">Camera lab</p>
        <h2 id="lab-heading">Inside the circuit core</h2>
        <p className="lead">
          The circuit core film, mapped into a live React Three Fiber scene.
          Switch between a perspective camera, which mimics human vision, and
          an orthographic one that keeps depth flat, then try the dolly zoom.
        </p>

        <div className="stage">
          {webgl ? (
            <SceneBoundary>
            <Suspense fallback={null}>
              {near && (
                <LabScene
                  cameraType={cameraType}
                  fov={fov}
                  zoom={zoom}
                  visible={visible}
                  animate={!reduced}
                  dollyRuns={dollyRuns}
                  onFov={setFov}
                  onDollyDone={() => setDollying(false)}
                />
              )}
            </Suspense>
            </SceneBoundary>
          ) : (
            <p className="fallback">
              3D preview needs WebGL, which isn&apos;t available in this
              browser.
            </p>
          )}

          <div className="hud">
            <div role="group" aria-label="Camera type" className="toggle">
              {["perspective", "orthographic"].map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={cameraType === type}
                  onClick={() => setCameraType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <label>
              <span>{perspective ? "Field of view" : "Zoom"}</span>
              <input
                type="range"
                min={perspective ? 20 : 40}
                max={perspective ? 110 : 200}
                value={perspective ? fov : zoom}
                disabled={dollying}
                onChange={(e) =>
                  (perspective ? setFov : setZoom)(Number(e.target.value))
                }
              />
              <output>{perspective ? `${fov}°` : `${zoom}×`}</output>
            </label>

            <button
              type="button"
              className="dolly"
              disabled={!perspective || dollying || reduced}
              onClick={() => {
                setDollying(true);
                setDollyRuns((n) => n + 1);
              }}
            >
              Dolly zoom
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lab;
