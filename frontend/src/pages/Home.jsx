import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Earth from '../components/Earth';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import {Divider, Paper, InputBase, IconButton, Button} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CheckboxList from "../components/CheckboxList";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import Satellite from '../components/Satellite';
import Debris from '../components/Debris';
import DownloadButton from '../components/DownloadButton';

const Home = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="main-container">
            <div className="overlay"/>
            <h1>Welcome to <Link to="/about-us">SpaceX</Link></h1>
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
                        placeholder="Search Satelites"
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
                <p className='collision-chance' style={{color: 'darkorange'}}>50%</p>
                <p className='collision-date'>24.03.2025</p>
            </Paper>
            <Paper
                elevation={3}
                className='satellite-info-container'
            >
                <h2 className='collision-heading'>Satelite 1 info</h2>
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
                    <Satellite radius={3} speed={2} />
                    <Debris />
                </Suspense>
                <Environment preset='sunset'/>
            </Canvas>
            <DownloadButton/>
        </div>
    );
}

export default Home;