import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Earth from '../components/Earth';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="main-container">
            <div className="overlay"/>
            <h1>Welcome to <Link to="/about-us">SpaceX</Link></h1>
            <Canvas>
                <ambientLight intensity={0.1}/>
                <OrbitControls enableZoom={false}/>
                <Suspense fallback={null}>
                    <Earth/>
                </Suspense>
                <Environment preset='sunset'/>
            </Canvas>
        </div>
    );
}

export default Home;