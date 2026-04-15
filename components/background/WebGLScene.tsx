"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { THEMES, useSettings } from "@/lib/settings";

function Grid() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();
  const { theme, intensity } = useSettings();
  const palette = THEMES[theme].webgl;

  // update shader colors when theme changes
  useEffect(() => {
    if (!mat.current) return;
    (mat.current.uniforms.uColorA.value as THREE.Color).set(palette.a);
    (mat.current.uniforms.uColorB.value as THREE.Color).set(palette.b);
    (mat.current.uniforms.uColorC.value as THREE.Color).set(palette.c);
  }, [palette.a, palette.b, palette.c]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
      uColorA: { value: new THREE.Color(palette.a) },
      uColorB: { value: new THREE.Color(palette.b) },
      uColorC: { value: new THREE.Color(palette.c) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    if (!mat.current) return;
    // Freeze time in light mode for a calm, static-but-visible grid
    mat.current.uniforms.uTime.value =
      intensity === "light" ? 1.5 : state.clock.getElapsedTime();
    const u = mat.current.uniforms.uMouse.value as THREE.Vector2;
    if (intensity === "light") {
      u.x += (0 - u.x) * 0.1;
      u.y += (0 - u.y) * 0.1;
    } else {
      u.x += (mouse.current.x - u.x) * 0.05;
      u.y += (mouse.current.y - u.y) * 0.05;
    }
    const r = mat.current.uniforms.uRes.value as THREE.Vector2;
    r.set(state.size.width, state.size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uMouse;
          uniform vec2 uRes;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;

          // 2D hash + noise
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p){
            vec2 i = floor(p); vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          void main() {
            vec2 uv = vUv;
            float aspect = uRes.x / uRes.y;
            vec2 p = uv - 0.5;
            p.x *= aspect;

            // Perspective grid (Tron floor) - project y onto horizon
            vec2 m = uMouse * 0.2;
            vec2 gp = p - m * 0.15;

            // Flip bottom half into perspective floor
            float floorY = gp.y + 0.4;
            float perspective = 1.0 / max(floorY, 0.02);

            // Tron floor: vertical perspective lines + horizontal lines that scroll toward viewer
            vec2 grid = vec2(gp.x * perspective, perspective + uTime * 0.25);
            grid *= 6.0;

            // Proper antialiased grid lines via fwidth — kills the flicker
            vec2 gf = abs(fract(grid) - 0.5);
            vec2 gw = fwidth(grid) * 1.5;
            vec2 gLine = smoothstep(gw, vec2(0.0), gf);
            float lineMask = max(gLine.x, gLine.y);

            // Fade with distance + mask to floor region only
            lineMask *= smoothstep(1.2, 0.0, floorY);
            lineMask *= (gp.y > -0.4 && gp.y < 0.5 ? 1.0 : 0.0);

            // Top half: nebula-like colored noise
            float n = noise(p * 3.0 + uTime * 0.05);
            n += 0.5 * noise(p * 6.0 - uTime * 0.08);
            n *= 0.5;
            float topMask = smoothstep(-0.05, 0.5, -gp.y);

            vec3 nebula = mix(uColorB, uColorC, n);
            vec3 color = vec3(0.0);
            color += lineMask * mix(uColorA, uColorC, smoothstep(0.0, 1.0, floorY * 1.5)) * 1.2;
            color += topMask * nebula * (0.15 + n * 0.35);

            // Horizon glow line
            float horizon = smoothstep(0.02, 0.0, abs(gp.y + 0.4));
            color += horizon * uColorA * 0.8;

            // Vignette
            float vig = smoothstep(1.2, 0.2, length(p));
            color *= vig;

            // Slight star field (tiny)
            float stars = step(0.998, hash(floor(p * 800.0)));
            color += vec3(stars) * 0.6;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export function WebGLScene() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const { intensity, theme } = useSettings();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(reduced.matches);
    update();
    reduced.addEventListener?.("change", update);
    return () => reduced.removeEventListener?.("change", update);
  }, []);

  const enabled =
    !reducedMotion && intensity !== "off" && theme !== "minimal";

  if (!enabled) {
    return (
      <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.25),transparent),radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.2),transparent)]" />
    );
  }

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 1] }}
    >
      <Grid />
    </Canvas>
  );
}
