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
import { Chart } from "react-google-charts";
import {getSatelliteById} from "../services/getSatelliteById";

const Home = () => {
    const [search, setSearch] = useState('');
    const [satellites, setSatellites] = useState([]); // [{name, id}]
    const [page, setPage] = useState(0);
    const [checked, setChecked] = useState([]); // [{id}]
    const [currentSatelliteIndex, setCurrentSatelliteIndex] = useState(0); // stallite info index
    const [currentSatellite, setCurrentSatellite] = useState(null); // satellite info
    const [selectedSatellites, setSelectedSatellites] = useState([]);
    const count = 10;
    const maxCheckedSatellites = 3;


    const options = {
        chartArea: {
            width: "50%",
            backgroundColor: "transparent",
        },
        hAxis: {
            title: "Probability (%)",
            minValue: 0,
            textStyle: { color: "#9a999a" },
            gridlines: {
                color: "#9a999a",
                count: 5
            },
            minorGridlines: {
                color: "#9a999a",
                count: 10
            },
            baselineColor: "#9a999a",
            format: "#"
        },
        vAxis: {
            title: "Satellite",
            textStyle: { color: "#9a999a" },
            gridlines: {
                color: "#9a999a",
                count: -1
            },
        },
        backgroundColor: "transparent",
        legend: { textStyle: { color: "#9a999a" } },
    };

    // checkbox list satellites
    const fetchData = async () => {
        try {
            const data = await getSatelliteByIdPagination(search, page, count);
            setSatellites(data);
            if(checked.length === 0) {
                setChecked([...checked, data[0].id]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                if(currentSatellite != null && checked[currentSatelliteIndex] !== currentSatellite.id) {
                    if(checked.length === 0) {
                        setCurrentSatellite(null);
                    } else {
                        const tmp = (currentSatelliteIndex + checked.length) % checked.length;
                        setCurrentSatelliteIndex(tmp);
                        const data = await getSatelliteById(checked[tmp]);
                        setCurrentSatellite(data);
                    }
                } else if(checked.length > 0) {
                    const data = await getSatelliteById(checked[currentSatelliteIndex]);
                    setCurrentSatellite(data);
                }
            } catch (e) {
                console.log(e);
            }
        }
        fetch();
    }, [currentSatelliteIndex, checked]);

    useEffect(() => {
        fetchData();
    }, []);

    const goBack = () => {
        if(currentSatelliteIndex === 0) {
            setCurrentSatelliteIndex(checked.length < maxCheckedSatellites ? checked.length - 1 : maxCheckedSatellites - 1);
        } else {
            setCurrentSatelliteIndex((prev) => prev - 1);
        }
    }

    const goForward = () => {
        if(currentSatelliteIndex + 1 === checked.length || currentSatelliteIndex + 1 === maxCheckedSatellites) {
            setCurrentSatelliteIndex(0);
        } else {
            setCurrentSatelliteIndex((prev) => prev + 1);
        }
    }

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
                <h2 className='collision-heading'>Collision Probabiility</h2>
                <Chart
                // Bar is the equivalent chart type for the material design version.
                chartType="BarChart"
                width="100%"
                height="400px"
                data={[["Satellite", "Probability"], ["ISS", 31], ["Copernicus", 14], ["Balkan 1", 1.2]]}
                options={options}
                />

            </Paper>
            { checked.length > 0 && currentSatellite !== null &&
                <Paper
                    elevation={3}
                    className='satellite-info-container'
                >
                    <h2 className='collision-heading'>{currentSatellite.name}</h2>
                    <p className='satellite-description'>{currentSatellite.satelliteDescription}</p>
                    <Button variant="outlined" endIcon={<DoubleArrowIcon />}>
                        Learn more
                    </Button>
                    <IconButton aria-label="arrow-back" className='arrow-back' onClick={goBack}>
                        <ArrowBackIosIcon sx={{fontSize: '40px'}} />
                    </IconButton>
                    <IconButton aria-label="arrow-forward" className='arrow-forward' onClick={goForward}>
                        <ArrowForwardIosIcon sx={{fontSize: '40px'}} />
                    </IconButton>
                </Paper>
            }
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