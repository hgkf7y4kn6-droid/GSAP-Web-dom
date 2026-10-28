import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";

const START_DISTANCE = 6;

const Subjects = ({ spin }) => {
  const group = useRef();

  useFrame((_, delta) => {
    if (spin) group.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={group}>
      <mesh position={[-1.4, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[1.4, 0, 0]} rotation={[0.4, 0.6, 0]}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial color="#e7d3a8" metalness={0.4} roughness={0.35} />
      </mesh>
    </group>
  );
};

// Animates FOV and camera distance together so the subject keeps its size
// while the perspective stretches: the classic dolly zoom.
const DollyZoom = ({ runs, onFov, onDone }) => {
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    if (!runs || !camera.isPerspectiveCamera) return;
    const startFov = camera.fov;
    const startDistance = camera.position.length();
    const k = startDistance * Math.tan((startFov * Math.PI) / 360);
    const state = { fov: startFov };

    const tween = gsap.to(state, {
      fov: 110,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
      onUpdate: () => {
        camera.fov = state.fov;
        camera.position.setLength(k / Math.tan((state.fov * Math.PI) / 360));
        camera.updateProjectionMatrix();
        onFov(Math.round(state.fov));
      },
      onComplete: () => {
        camera.fov = startFov;
        camera.position.setLength(startDistance);
        camera.updateProjectionMatrix();
        onFov(startFov);
        onDone();
      },
    });
    return () => tween.kill();
  }, [runs]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

const LabScene = ({ cameraType, fov, zoom, visible, spin, dollyRuns, onFov, onDollyDone }) => (
  <Canvas
    dpr={[1, 1.5]}
    frameloop={visible ? "always" : "never"}
    aria-hidden="true"
  >
    {cameraType === "perspective" ? (
      <PerspectiveCamera makeDefault fov={fov} position={[0, 0, START_DISTANCE]} />
    ) : (
      <OrthographicCamera makeDefault zoom={zoom} position={[0, 0, START_DISTANCE]} />
    )}
    <ambientLight intensity={0.35} />
    <directionalLight position={[4, 5, 3]} intensity={1.6} />
    <pointLight position={[-4, -2, 3]} intensity={30} color="#2563eb" />
    <Environment resolution={64} environmentIntensity={0.6}>
      <Lightformer form="rect" intensity={4} position={[0, 4, -3]} scale={[8, 2, 1]} color="#93c5fd" />
      <Lightformer form="rect" intensity={2} position={[-5, 0, 2]} scale={[2, 6, 1]} color="#e7d3a8" />
    </Environment>
    <Subjects spin={spin} />
    <OrbitControls enablePan={false} enableZoom={false} />
    <DollyZoom runs={dollyRuns} onFov={onFov} onDone={onDollyDone} />
  </Canvas>
);

export default LabScene;
