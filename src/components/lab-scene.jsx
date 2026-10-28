import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

const START_DISTANCE = 6;
const WIDTH = 6.4;
const HEIGHT = 3.6;

// The circuit-core film, mapped onto a plane. Frames of glowing outline sit
// at different depths so the perspective / orthographic difference is obvious.
const CircuitCore = ({ visible, animate }) => {
  const group = useRef();
  const video = useMemo(() => {
    const el = document.createElement("video");
    el.muted = true;
    el.loop = true;
    el.playsInline = true;
    el.crossOrigin = "anonymous";
    el.preload = "auto";
    // Prefer WebM where supported, falling back to MP4 (iOS Safari).
    el.src = el.canPlayType("video/webm; codecs=vp9")
      ? "/videos/circuit-core.webm"
      : "/videos/circuit-core.mp4";
    el.poster = "/images/circuit-core-poster.jpg";
    return el;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(video);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [video]);

  const poster = useMemo(() => {
    const t = new THREE.TextureLoader().load("/images/circuit-core-poster.jpg");
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  const frame = useMemo(
    () => new THREE.EdgesGeometry(new THREE.PlaneGeometry(WIDTH, HEIGHT)),
    [],
  );

  useEffect(() => {
    if (visible && animate) video.play().catch(() => {});
    else video.pause();
  }, [visible, animate, video]);

  useEffect(
    () => () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
      poster.dispose();
      frame.dispose();
    },
    [video, texture, poster, frame],
  );

  useFrame(({ clock }) => {
    if (animate) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.18;
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial map={animate ? texture : poster} toneMapped={false} />
      </mesh>
      {[
        [-1.2, 1.12, 0.35],
        [0.9, 1.06, 0.22],
        [1.7, 1.2, 0.12],
      ].map(([z, s, o]) => (
        <lineSegments key={z} geometry={frame} position={[0, 0, z]} scale={[s, s, 1]}>
          <lineBasicMaterial color="#3fd8ff" transparent opacity={o} />
        </lineSegments>
      ))}
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

const LabScene = ({ cameraType, fov, zoom, visible, animate, dollyRuns, onFov, onDollyDone }) => (
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
    <CircuitCore visible={visible} animate={animate} />
    <OrbitControls enablePan={false} enableZoom={false} />
    <DollyZoom runs={dollyRuns} onFov={onFov} onDone={onDollyDone} />
  </Canvas>
);

export default LabScene;
