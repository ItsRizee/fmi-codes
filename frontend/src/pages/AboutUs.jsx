import { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Text } from '@react-three/drei';
import Earth from '../components/Earth'; // Assuming you have an Earth component
import Saturn from '../components/Saturn'; // Assuming you have a Saturn component
import Pluto from '../components/Pluto'; // Assuming you have a Pluto component
import Satellite from '../components/Satellite'; // Assuming you have a Pluto component
import '../styles/AboutUs.css';

// Component for the spinning planet
function Planet(props) {
    const mesh = useRef();
    useFrame(() => (mesh.current.rotation.y += 0.005)); // Slowed down rotation
    return (
        <mesh {...props} ref={mesh}>
            {props.children}
        </mesh>
    );
}

const AboutUs = () => {
    const [randomText, setRandomText] = useState("Exploring the vastness of space...");
    const [factIndex, setFactIndex] = useState(0);

    const spaceFacts = [
        "Saturn's rings are mostly made of ice particles.",
        "Pluto is so small, it's smaller than Earth's moon.",
        "A day on Mars is slightly longer than a day on Earth.",
        "Jupiter's Great Red Spot is a storm bigger than Earth.",
        "The Sun makes up 99.86% of the solar system's mass."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setFactIndex((prevIndex) => (prevIndex + 1) % spaceFacts.length);
            setRandomText(spaceFacts[(factIndex + 1) % spaceFacts.length]);
        }, 5000); // Change text every 5 seconds

        return () => clearInterval(interval); // Clean up the interval
    }, [factIndex, spaceFacts]);

    return (
        <div className="main-container">
            <div className="overlay" />
            <h1>Welcome to About Us</h1>
            <Canvas>
                <ambientLight intensity={0.1} />
                <Planet position={[3, 2, -5]}>
                    <Earth scale={1} />
                </Planet>
                <Planet position={[-4, 1, -6]}>
                    <Saturn scale={0.8} />
                </Planet>
                <Planet position={[5, -2, -8]}>
                    <Pluto scale={0.3} />
                </Planet>
                <Text position={[0, -3, -5]} fontSize={0.5} color="white">{randomText}</Text>
                <Environment preset="sunset" />
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default AboutUs;