import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Text } from '@react-three/drei';
import Saturn from '../components/Saturn';
import Pluto from '../components/Pluto';
import Satellite from '../components/Satellite';
import '../styles/AboutUs.css';

const AboutUs = () => {
  // Component for spinning planets
  const Planet = (props) => {
    const mesh = useRef();
    useFrame(() => (mesh.current.rotation.y += 0.005)); // Slow, gentle rotation
    return (
      <mesh {...props} ref={mesh}>
        {props.children}
      </mesh>
    );
  };

  return (
    <div className="main-container">
      <div className="overlay" /> {/* For visual effects, like a dark overlay */}
      <h1 style={{ marginTop: '150px' }}>Welcome to About Us</h1>
      
      {/* Use Text component from @react-three/drei to display ScrapSAT info */}
      <Canvas>
        <ambientLight intensity={0.1} /> {/* Soft, general lighting */}

        {/* Planets with different positions and scales */}
        <Planet position={[-6, -3, 0]}>
          <Saturn scale={3} />
        </Planet>
        <Planet position={[11, -3, -10]}>
          <Pluto scale={3} />
        </Planet>

        {/* Centered text block for ScrapSAT description */}
        <Text position={[0, 1, -5]} fontSize={0.6} color="white" maxWidth={20}>
          ScrapSAT is like space's helpful buddy! We use awesome math to track old space junk, like broken satellites, 
          so scientists can explore the universe safely. We're keeping space tidy for everyone!
        </Text>

        {/* Setting the environment (background) */}
        <Environment preset="sunset" />

        {/* Allowing users to move around the scene */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default AboutUs;
