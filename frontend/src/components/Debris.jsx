import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { TLEtoXYZ } from '../TLEtoXYZ';

const createRandomFlightPath = () => {
    return {
        Inclination: Math.random() * 180,
        RightAscensionOfAscendingNode: Math.random() * 360,
        Eccentricity: Math.random() * 0.2,
        ArgumentOfPerigee: Math.random() * 360,
        MeanAnomaly: Math.random() * 360,
        MeanMotion: Math.random() * 10 + 5,
    };
};

export default function SpaceJunkScene() {
    const { nodes, materials } = useGLTF('/debris.gltf');
    const numberOfJunkPieces = 5;
    const junkPieceRefs = useRef([]);
    const junkPieceFlightPaths = useRef([]);
    const spaceScaleFactor = 1800000;
    const junkSpeed = 2;
    const [flightPathLines, setFlightPathLines] = useState([]);

    useEffect(() => {
        const flightPaths = [];
        for (let i = 0; i < numberOfJunkPieces; i++) {
            flightPaths.push(createRandomFlightPath());
        }
        junkPieceFlightPaths.current = flightPaths;

        const lines = [];
        for (let i = 0; i < numberOfJunkPieces; i++) {
            const pathPoints = [];
            const pathData = flightPaths[i];

            for (let j = 0; j <= 100; j++) {
                let progress = j / 100;
                let junkPositionOnPath = progress * 2 * Math.PI;

                let tempPathData = { ...pathData, MeanAnomaly: junkPositionOnPath * (180 / Math.PI) };

                let coordinates = TLEtoXYZ(tempPathData);
                let x = coordinates[0];
                let y = coordinates[1];
                let z = coordinates[2];

                pathPoints.push([x / spaceScaleFactor, y / spaceScaleFactor, z / spaceScaleFactor]);
            }

            lines.push(<Line key={i} points={pathPoints} color="gray" lineWidth={1} />);
        }
        setFlightPathLines(lines);
    }, [numberOfJunkPieces]);

    useFrame(({ clock }) => {
        const time = clock.elapsedTime;

        for (let i = 0; i < numberOfJunkPieces; i++) {
            if (junkPieceRefs.current[i] && junkPieceFlightPaths.current[i]) {
                let pathData = junkPieceFlightPaths.current[i];
                let currentPosition = (pathData.MeanAnomaly + pathData.MeanMotion * time) * junkSpeed;
                let currentPathData = { ...pathData, MeanAnomaly: currentPosition };

                let coordinates = TLEtoXYZ(currentPathData);
                let x = coordinates[0];
                let y = coordinates[1];
                let z = coordinates[2];

                junkPieceRefs.current[i].position.set(x / spaceScaleFactor, y / spaceScaleFactor, z / spaceScaleFactor);
                junkPieceRefs.current[i].lookAt(0, 0, 0);
            }
        }
    });

    return (
        <>
            {Array(numberOfJunkPieces)
                .fill()
                .map((_, index) => (
                    <group key={index} ref={(ref) => (junkPieceRefs.current[index] = ref)} dispose={null}>
                        <mesh
                            geometry={nodes.defaultMaterial.geometry}
                            material={materials.scrap}
                            scale={0.1}
                        />
                    </group>
                ))}
            {flightPathLines}
        </>
    );
}

useGLTF.preload('/debris.gltf');