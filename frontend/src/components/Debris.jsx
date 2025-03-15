import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { TLEtoXYZ } from '../TLEtoXYZ';

const generateRandomOrbit = () => {
    return {
        Inclination: Math.random() * 180,
        RightAscensionOfAscendingNode: Math.random() * 360,
        Eccentricity: Math.random() * 0.2,
        ArgumentOfPerigee: Math.random() * 360,
        MeanAnomaly: Math.random() * 360,
        MeanMotion: Math.random() * 10 + 5,
    };
};

export default function Debris() {
    const { nodes, materials } = useGLTF('/debris.gltf');
    const debrisCount = 50;
    const debrisRefs = useRef([]);
    const debrisOrbits = useRef([]);
    const scaleFactor = 1800000;
    const speed = 2;

    useEffect(() => {
        const orbits = [];
        for (let i = 0; i < debrisCount; i++) {
            orbits.push(generateRandomOrbit());
        }
        debrisOrbits.current = orbits;
    }, [debrisCount]);

    useFrame(({ clock }) => {
        const time = clock.elapsedTime;

        for (let i = 0; i < debrisCount; i++) {
            if (debrisRefs.current[i] && debrisOrbits.current[i]) { // Check if debrisOrbits[i] exists
                let orbitData = debrisOrbits.current[i];
                let M = (orbitData.MeanAnomaly + orbitData.MeanMotion * time) * speed;
                let tleData = { ...orbitData, MeanAnomaly: M };

                let coords = TLEtoXYZ(tleData);
                let x = coords[0];
                let y = coords[1];
                let z = coords[2];

                debrisRefs.current[i].position.set(x / scaleFactor, y / scaleFactor, z / scaleFactor);
                debrisRefs.current[i].lookAt(0, 0, 0);
            }
        }
    });

    return (
        <>
            {Array(debrisCount)
                .fill()
                .map((_, index) => (
                    <group key={index} ref={(ref) => (debrisRefs.current[index] = ref)} dispose={null}>
                        <mesh
                            geometry={nodes.defaultMaterial.geometry}
                            material={materials.scrap}
                            scale={0.1}
                        />
                    </group>
                ))}
        </>
    );
}

useGLTF.preload('/debris.gltf');