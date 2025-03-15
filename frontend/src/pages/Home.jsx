import {useState, Suspense, useEffect} from 'react';
import { Canvas } from '@react-three/fiber';
import {Environment, OrbitControls} from '@react-three/drei';
import Earth from '../components/Earth';
import '../styles/Home.css';
import {Divider, Paper, InputBase, IconButton, Button} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CheckboxList from "../components/CheckboxList";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import Satellite from '../components/Satellite';
import Debris from '../components/Debris';
import DownloadButton from '../components/DownloadButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {getSatelliteByIdPagination} from "../services/getSatelliteByIdPagination";

const Home = () => {
    const [search, setSearch] = useState('');
    const [satellites, setSatellites] = useState([]);
    const [page, setPage] = useState(0);
    const [checked, setChecked] = useState([]);
    const count = 10;

    const fetchData = async () => {
        try {
            const data = await getSatelliteByIdPagination(search, page, count);
            setSatellites(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

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
                        onChange={(e) => {setSearch(e.target.value)}}
                    />
                    <IconButton type="button" sx={{ p: '10px', marginRight: '20px' }} aria-label="search" onClick={fetchData}>
                        <SearchIcon sx={{color: 'rgba(240, 240, 240, 0.7)'}} />
                    </IconButton>
                </Paper>
                <Divider className='divider' orientation="horizontal" />
                <CheckboxList satellites={satellites} checked={checked} setChecked={setChecked} />
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
                <IconButton aria-label="arrow-back" className='arrow-back'>
                    <ArrowBackIosIcon sx={{fontSize: '40px'}} />
                </IconButton>
                <h2 className='collision-heading'>Satellite 1 info</h2>
                <p className='satellite-description'>This is some basic info about the satellite. It was launched in 2015 by Bulgaria. It is the first to make the big discovery.</p>
                <Button variant="outlined" endIcon={<DoubleArrowIcon />}>
                    Learn more
                </Button>
                <IconButton aria-label="arrow-forward" className='arrow-forward'>
                    <ArrowForwardIosIcon sx={{fontSize: '40px'}} />
                </IconButton>
            </Paper>
            <Canvas>
                <ambientLight intensity={0.1}/>
                <OrbitControls enableZoom={false}/>
                <Suspense fallback={null}>
                    <Earth/>
                    <Satellite tleData={{
                        Inclination: 51.6445,
                        RightAscensionOfAscendingNode: 100.3765,
                        Eccentricity: 0,
                        ArgumentOfPerigee: 5.33,
                        MeanAnomaly: 73.9288,
                        MeanMotion: 15.50204603,
                    }} />
                    <Debris />
                </Suspense>
                <Environment preset='sunset'/>
            </Canvas>
            <DownloadButton/>
        </div>
    );
}

export default Home;