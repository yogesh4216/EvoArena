"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ── Inner Glowing Core — Golden Torus Knot ──────────────── */
function GoldenOrb() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.12;
            meshRef.current.rotation.y = t * 0.18;
            meshRef.current.rotation.z = t * 0.05;
        }
    });

    return (
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
            <mesh ref={meshRef}>
                <torusKnotGeometry args={[0.9, 0.35, 200, 32, 2, 3]} />
                <MeshDistortMaterial
                    color="#F0B90B"
                    emissive="#C4960A"
                    emissiveIntensity={0.5}
                    roughness={0.15}
                    metalness={0.95}
                    distort={0.15}
                    speed={1.5}
                />
            </mesh>
        </Float>
    );
}

/* ── Orbit Rings (using Torus geometry for R3F compat) ──── */
function OrbitRing({
    radius,
    color,
    opacity,
    speed,
    tilt,
}: {
    radius: number;
    color: string;
    opacity: number;
    speed: number;
    tilt: [number, number, number];
}) {
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += speed * 0.005;
        }
    });

    return (
        <mesh ref={ringRef} rotation={tilt}>
            <torusGeometry args={[radius, 0.005, 8, 120]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
    );
}

/* ── Sparkle Particles ───────────────────────────────────── */
function StarParticles() {
    const count = 120;
    const meshRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 2.5 + Math.random() * 4;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.035}
                color="#F0B90B"
                transparent
                opacity={0.5}
                sizeAttenuation
            />
        </points>
    );
}

/* ── Glow Sphere (bloom substitute) ──────────────────────── */
function GlowSphere() {
    return (
        <mesh>
            <sphereGeometry args={[1.6, 32, 32]} />
            <meshBasicMaterial color="#F0B90B" transparent opacity={0.03} />
        </mesh>
    );
}

/* ── Main Scene Export ───────────────────────────────────── */
export default function ArenaScene() {
    return (
        <div className="w-full h-full absolute inset-0">
            <Canvas
                camera={{ position: [0, 0, 5.5], fov: 40 }}
                dpr={[1, 2]}
                style={{ background: "transparent" }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.2} />
                <pointLight position={[4, 4, 5]} intensity={1.2} color="#F0B90B" />
                <pointLight position={[-3, -2, 4]} intensity={0.5} color="#00AAFF" />
                <pointLight position={[2, -3, -3]} intensity={0.3} color="#F0B90B" />
                <directionalLight
                    position={[0, 5, 5]}
                    intensity={0.4}
                    color="#FFFFFF"
                />

                {/* Golden Torus Knot */}
                <GoldenOrb />

                {/* Orbit Rings — using torus mesh for compatibility */}
                <OrbitRing
                    radius={1.8}
                    color="#00D4FF"
                    opacity={0.3}
                    speed={0.15}
                    tilt={[0.8, 0.3, 0]}
                />
                <OrbitRing
                    radius={2.1}
                    color="#F0B90B"
                    opacity={0.18}
                    speed={-0.1}
                    tilt={[1.2, -0.2, 0.4]}
                />
                <OrbitRing
                    radius={1.5}
                    color="#00D4FF"
                    opacity={0.15}
                    speed={0.2}
                    tilt={[0.4, 0.8, -0.3]}
                />

                {/* Outer glow */}
                <GlowSphere />

                {/* Star particles */}
                <StarParticles />
            </Canvas>
        </div>
    );
}
