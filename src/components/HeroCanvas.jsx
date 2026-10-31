import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Instance,
  Instances,
  Line,
  PerformanceMonitor,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const CYAN = "#3fd8ff";
const AMBER = "#f5b25c";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(pointer: fine)").matches;
const isSmallScreen = () => window.matchMedia("(max-width: 767px)").matches;

// Board coordinates: the chip lies in the XZ plane, traces sit on its top face.
const BOARD = 1.6;
const DIE = 0.65;
const TOP = 0.096;

// Traces run out from each side of the die, bend 45 degrees, then reach the
// board edge. The same layout is rotated to all four sides.
const buildTraces = () => {
  const offsets = [-0.45, -0.15, 0.15, 0.45];
  const sides = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const traces = [];
  sides.forEach((angle, s) => {
    const rot = new THREE.Matrix4().makeRotationY(angle);
    offsets.forEach((o, i) => {
      const bend = (i % 2 === 0 ? 1 : -1) * 0.22;
      const points = [
        [o, TOP, DIE],
        [o, TOP, DIE + 0.25],
        [o + bend, TOP, DIE + 0.25 + Math.abs(bend)],
        [o + bend, TOP, BOARD - 0.08],
      ].map((p) => new THREE.Vector3(...p).applyMatrix4(rot));
      traces.push({ points, amber: (s + i) % 5 === 0 });
    });
  });
  return traces;
};

// Gold pins along all four edges of the board.
const buildPins = () => {
  const pins = [];
  const count = 12;
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < count; i++) {
      const t = -BOARD + 0.2 + (i * (BOARD * 2 - 0.4)) / (count - 1);
      const along = side % 2 === 0;
      const sign = side < 2 ? 1 : -1;
      pins.push({
        position: along ? [t, 0, sign * (BOARD + 0.1)] : [sign * (BOARD + 0.1), 0, t],
        rotation: [0, along ? 0 : Math.PI / 2, 0],
      });
    }
  }
  return pins;
};

// A rounded square outline, echoing the glowing depth frames used across the site.
const framePoints = (size, radius = 0.25, steps = 6) => {
  const pts = [];
  const corners = [
    [size - radius, size - radius, 0],
    [-(size - radius), size - radius, Math.PI / 2],
    [-(size - radius), -(size - radius), Math.PI],
    [size - radius, -(size - radius), (3 * Math.PI) / 2],
  ];
  corners.forEach(([cx, cz, start]) => {
    for (let i = 0; i <= steps; i++) {
      const a = start + (i / steps) * (Math.PI / 2);
      pts.push(new THREE.Vector3(cx + Math.cos(a) * radius, 0, cz + Math.sin(a) * radius));
    }
  });
  pts.push(pts[0].clone());
  return pts;
};

// Soft studio reflections for the metal surfaces, generated on the GPU so no
// HDR file or loader has to download.
const StudioEnvironment = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = pmrem.fromScene(room, 0.04).texture;
    // three.js scenes are mutable objects; R3F expects them to be set directly.
    // oxlint-disable-next-line react/immutability
    scene.environment = texture;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      texture.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

// A point of light that travels along a trace, like data moving through the chip.
const Pulse = ({ points, color, speed, offset }) => {
  const ref = useRef();
  const curve = useMemo(() => {
    const path = new THREE.CurvePath();
    for (let i = 0; i < points.length - 1; i++) {
      path.add(new THREE.LineCurve3(points[i], points[i + 1]));
    }
    return path;
  }, [points]);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * speed + offset) % 1;
    ref.current.position.copy(curve.getPointAt(t));
    ref.current.scale.setScalar(Math.sin(t * Math.PI) * 0.035 + 0.005);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

const Core = ({ animate }) => {
  const core = useRef();
  useFrame(({ clock }) => {
    if (!animate) return;
    core.current.emissiveIntensity = 0.9 + Math.sin(clock.elapsedTime * 1.6) * 0.35;
  });

  return (
    <mesh position={[0, 0.235, 0]}>
      <boxGeometry args={[0.62, 0.02, 0.62]} />
      <meshStandardMaterial
        ref={core}
        color="#2a1a06"
        emissive={AMBER}
        emissiveIntensity={0.9}
        toneMapped={false}
      />
    </mesh>
  );
};

const Chip = ({ animate, pulses }) => {
  const traces = useMemo(() => buildTraces(), []);
  const pins = useMemo(() => buildPins(), []);
  const frames = useMemo(() => [framePoints(BOARD + 0.55), framePoints(BOARD + 1.05)], []);

  return (
    <group>
      {/* Substrate and die */}
      <RoundedBox args={[BOARD * 2, 0.18, BOARD * 2]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color="#0c1424" metalness={0.6} roughness={0.38} />
      </RoundedBox>
      <RoundedBox args={[DIE * 2, 0.14, DIE * 2]} radius={0.04} smoothness={3} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#121c33" metalness={0.85} roughness={0.22} />
      </RoundedBox>
      <Core animate={animate} />

      <Instances limit={pins.length}>
        <boxGeometry args={[0.07, 0.04, 0.2]} />
        <meshStandardMaterial color="#c9b37e" metalness={1} roughness={0.3} />
        {pins.map((pin, i) => (
          <Instance key={i} position={pin.position} rotation={pin.rotation} />
        ))}
      </Instances>

      {traces.map(({ points, amber }, i) => (
        <Line
          key={i}
          points={points}
          color={amber ? AMBER : CYAN}
          lineWidth={1.4}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
      ))}

      {animate &&
        traces
          .filter((_, i) => i % Math.ceil(traces.length / pulses) === 0)
          .map(({ points, amber }, i) => (
            <Pulse
              key={i}
              points={points}
              color={amber ? AMBER : CYAN}
              speed={0.22 + (i % 3) * 0.07}
              offset={i * 0.37}
            />
          ))}

      {/* Depth frames beneath the board */}
      <Line points={frames[0]} position={[0, -0.35, 0]} color={CYAN} lineWidth={1} transparent opacity={0.35} toneMapped={false} />
      <Line points={frames[1]} position={[0, -0.7, 0]} color={CYAN} lineWidth={1} transparent opacity={0.16} toneMapped={false} />
    </group>
  );
};

// Tilts the chip toward the pointer and away as the hero scrolls off.
const Rig = ({ children, animate, interactive }) => {
  const ref = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  const scale = Math.min(0.62, viewport.width / 8.5);

  useEffect(() => {
    if (!interactive) return;
    const move = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [interactive]);

  useFrame((state, delta) => {
    if (!animate) return;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    const g = ref.current;
    const t = state.clock.elapsedTime;
    const targetX = 0.95 + pointer.current.y * 0.12 + scroll * 0.35;
    const targetY = -0.5 + pointer.current.x * 0.25 + (interactive ? 0 : Math.sin(t * 0.25) * 0.15);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
  });

  return (
    <group ref={ref} rotation={[0.95, -0.5, 0]} position={[0, -0.2, 0]} scale={scale}>
      {children}
    </group>
  );
};

const HeroCanvas = () => {
  const container = useRef();
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const settings = useMemo(() => {
    const animate = !reducedMotion();
    const small = isSmallScreen();
    return {
      animate,
      interactive: animate && finePointer(),
      sparkles: small ? 28 : 70,
      pulses: small ? 5 : 9,
    };
  }, []);

  // Stop rendering while the hero is scrolled out of view.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(container.current);
    return () => io.disconnect();
  }, []);

  const frameloop = !visible ? "never" : settings.animate ? "always" : "demand";

  return (
    <div ref={container} className="hero-canvas">
      <Canvas
        frameloop={frameloop}
        dpr={dpr}
        camera={{ position: [0, 0, 7], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => {
          // Swap the static poster for the live scene once it has drawn.
          requestAnimationFrame(() => {
            document.getElementById("hero")?.setAttribute("data-scene", "ready");
          });
        }}
      >
        <PerformanceMonitor
          bounds={() => [50, 90]}
          onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.75))}
          onDecline={() => setDpr(1)}
          flipflops={3}
          onFallback={() => setDpr(1)}
        />
        <ambientLight intensity={0.25} />
        <pointLight position={[-3, 2.5, 2]} intensity={28} color={CYAN} />
        <pointLight position={[3, 1.5, -1]} intensity={18} color={AMBER} />
        <StudioEnvironment />

        <Rig animate={settings.animate} interactive={settings.interactive}>
          <Float
            enabled={settings.animate}
            speed={1.2}
            rotationIntensity={0.15}
            floatIntensity={0.4}
          >
            <Chip animate={settings.animate} pulses={settings.pulses} />
          </Float>
        </Rig>

        <Sparkles
          count={settings.sparkles}
          scale={[9, 5, 4]}
          size={2.2}
          speed={settings.animate ? 0.3 : 0}
          opacity={0.6}
          color={CYAN}
        />
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
