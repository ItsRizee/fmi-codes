import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {Environment, OrbitControls, PerspectiveCamera} from '@react-three/drei';
import Earth from '../components/Earth';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import {Divider, Paper, InputBase, IconButton, Button} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CheckboxList from "../components/CheckboxList";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import Satellite from '../components/Satellite';
import Debris from '../components/Debris';



const Home = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="main-container">
            <div className="overlay"/>
            <h1>Welcome to <span className='team-color'>ScrapSAT</span></h1>
            <Paper
                elevation={3}
                className='satellites-container'
            >
                <Paper
                    component="form"
                    elevation={0}
                    className='search-input'
                >
                    <InputBase
                        className='input-base'
                        placeholder="Search Satellites"
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton type="button" sx={{ p: '10px', marginRight: '20px' }} aria-label="search">
                        <SearchIcon sx={{color: 'rgba(240, 240, 240, 0.7)'}} />
                    </IconButton>
                </Paper>
                <Divider className='divider' orientation="horizontal" />
                <CheckboxList />
            </Paper>
            <Paper
                elevation={3}
                className='collision-container'
            >
                <h2 className='collision-heading'>Collision chance</h2>
                <p className='collision-chance' style={{color: '#1976d2'}}>50%</p>
                <p className='collision-date'>24.03.2025</p>
            </Paper>
            <Paper
                elevation={3}
                className='satellite-info-container'
            >
                <h2 className='collision-heading'>Satellite 1 info</h2>
                <p className='satellite-description'>This is some basic info about the satellite. It was launched in 2015 by Bulgaria. It is the first to make the big discovery.</p>
                <Button variant="outlined" endIcon={<DoubleArrowIcon />}>
                    Learn more
                </Button>
            </Paper>
            <Canvas>
                <ambientLight intensity={0.1}/>
                <OrbitControls enableZoom={false}/>
                <Suspense fallback={null}>
                    <Earth/>
                    <Satellite tleData={{
                        Inclination: 51.6445,
                        RightAscensionOfAscendingNode: 100.3765,
                        Eccentricity: 0.002311,
                        ArgumentOfPerigee: 20.6034,
                        MeanAnomaly: 73.9288,
                        MeanMotion: 15.50204603,
                    }} />
                    <Satellite tleData={{
                        Inclination: 90,
                        RightAscensionOfAscendingNode: 0,
                        Eccentricity: 0.3,
                        ArgumentOfPerigee: 0,
                        MeanAnomaly: 0,
                        MeanMotion: 15.50204603,
                    }} />
                    <Debris />
                </Suspense>
                <Environment preset='sunset'/>
            </Canvas>
        </div>
    );
}

export default Home;