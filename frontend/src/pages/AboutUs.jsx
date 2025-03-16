import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import Saturn from '../components/Saturn';
import Pluto from '../components/Pluto';
import '../styles/AboutUs.css';
import MyButton from '../components/Button';

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
      <div className="overlay" />
      <h1 style={{ marginTop: '150px' }}>About Us</h1>
      <p className='coders-text'>Made by your happy coders :) <span>fmi-codes 16.03.2025</span></p>
      <MyButton />
      <Canvas>
        <ambientLight intensity={0.1} />

        <Suspense fallback={null}>
          <Planet position={[-6, -3, 0]}>
            <Saturn scale={3} />
          </Planet>
          <Planet position={[11, -4, -10]}>
            <Pluto scale={3} />
          </Planet>
        </Suspense>
        <Text position={[0, 1.5, -5]} fontSize={0.6} color="white" maxWidth={20}>
          ScrapSAT is like space's helpful buddy! We use awesome math to track old space junk, like broken satellites,
          so scientists can explore the universe safely. We're keeping space tidy for everyone!
        </Text>

        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default AboutUs;
