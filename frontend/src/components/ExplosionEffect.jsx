import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const ExplosionEffectRender = ({ explosionPosition }) => {
    const explosionRef = useRef();
    const particles = useRef([]);
    const geometryRef = useRef();
    console.log(explosionPosition);

    // Create random particles for the explosion
    useEffect(() => {
        const particleArray = [];
        for (let i = 0; i < 200; i++) {  // Increased number of particles for a larger explosion
            const particle = new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,  // Smaller horizontal movement range
                (Math.random() - 0.5) * 0.1,   // Vertical movement (up and down)
                (Math.random() - 0.5) * 0.05   // Spread in z direction
            );
            // Offset each particle by the explosion position
            particle.add(explosionPosition);  // Add the collision position to the particle's position
            particleArray.push(particle);
        }
        particles.current = particleArray;
    }, [explosionPosition]);  // Re-run if position changes

    // Animate particles during each frame
    useFrame(() => {
        if (explosionRef.current) {
            explosionRef.current.geometry.setFromPoints(particles.current.map(p => {
                p.addScaledVector(p, 1.05);  // Slow down the expansion (slower growth)
                p.y += Math.random() * 0.03; // Add upward movement to simulate fire
                p.x += (Math.random() - 0.5) * 0.02; // Random horizontal spread
                p.z += (Math.random() - 0.5) * 0.02; // Random movement in Z
                return p;
            }));
        }
    });

    // Custom shape: Distorted Sphere (can be modified to any custom shape)
    const createCustomShape = () => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        // Create custom vertices for a distorted sphere
        for (let i = 0; i < 1000; i++) {
            const theta = Math.random() * Math.PI * 2;  // Random angle in the XY plane
            const phi = Math.random() * Math.PI;       // Random angle in the ZY plane

            const radius = Math.random() * 0.4 + 0.1;  // Reduced radius range for a smaller explosion
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            vertices.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return geometry;
    };

    return (
        <group dispose={null}>
            {/* Render the custom 3D shape for the explosion core */}
            <mesh
                position={[explosionPosition.x  , explosionPosition.y, explosionPosition.z]}  // Explosion position dynamically set
                scale={[0.5, 0.5, 0.5]}  // Smaller scale for a compact explosion core
            >
                {/* Custom geometry for the explosion core */}
                <bufferGeometry attach="geometry" {...createCustomShape()} />
                {/* Ensure the color is properly applied */}
                <meshStandardMaterial color="orange" emissive="yellow" emissiveIntensity={0.8} />
            </mesh>

            {/* Render explosion particles */}
            <Points ref={explosionRef} positions={particles.current}>
                <PointMaterial
                    size={0.01}  // Even smaller particle size
                    vertexColors={true}  // Allow vertex color for each particle
                />
            </Points>
        </group>
    );
};

export default ExplosionEffectRender;
