import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Line } from "@react-three/drei";
import { TLEtoXYZ } from "../TLEtoXYZ";
import { forwardRef } from "react";

const Satellite = forwardRef(({ tleData }, satelliteRef) => {
    const { nodes, materials } = useGLTF('/satellite.gltf');

    const scaleFactor = 1800000;
    let speed = 2;

    let MeanAnomaly = tleData.MeanAnomaly
    let MeanMotion = tleData.MeanMotion


    useFrame(({ clock }) => {
        if (satelliteRef.current) {
            const t = clock.elapsedTime;
            let M = (MeanAnomaly + MeanMotion * t) * speed; // Update mean anomaly
            tleData = { ...tleData, MeanAnomaly: M}; // Convert to degrees
    
            let coords = TLEtoXYZ(tleData)
            let x = coords[0]
            let y=coords[1]
            let z=coords[2]

            satelliteRef.current.position.set(x / scaleFactor, y / scaleFactor, z / scaleFactor);
            satelliteRef.current.lookAt(0, 0, 0);
        }
    });

    // Generate orbit path visualization
    const orbitPoints = [];
    for (let i = 0; i <= 100; i++) {
        let fraction = i / 100; // Progress through the orbit (0 to 1)
        let meanAnomaly = fraction * 2 * Math.PI; // Rotate from 0 to 2π
    
        // Create a copy of tleData and override Mean Anomaly for this iteration
        let tempTLE = { ...tleData, MeanAnomaly: meanAnomaly * (180 / Math.PI) }; // Convert to degrees
    
        let coords = TLEtoXYZ(tempTLE)
        let x = coords[0]
        let y=coords[1]
        let z=coords[2]

        orbitPoints.push([x / scaleFactor, y / scaleFactor, z / scaleFactor]);
    }

    return (
        <>
            {/* Satellite Mesh */}
            <group ref={satelliteRef} dispose={null}>
                <mesh
                    geometry={nodes.Cube001__0.geometry}
                    material={materials['Scene_-_Root']}
                    scale={0.4}
                />
            </group>

            {/* Visible Orbit Path */}
            <Line
                points={orbitPoints}
                color="white"
                lineWidth={2}
            />
        </>
    );
});
export default Satellite;

