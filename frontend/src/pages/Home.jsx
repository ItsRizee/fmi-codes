import { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import Earth from '../components/Earth';
import '../styles/Home.css';
import { Divider, Paper, InputBase, IconButton, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CheckboxList from "../components/CheckboxList";
import ExplosionEffectRender from "../components/ExplosionEffect"
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import Satellite from '../components/Satellite';
import Debris from '../components/Debris';
import DownloadButton from '../components/DownloadButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { getSatelliteByIdPagination } from "../services/getSatelliteByIdPagination";
import { Chart } from "react-google-charts";
import { getSatelliteById } from "../services/getSatelliteById";

const Home = () => {
    const [search, setSearch] = useState('');
    const [satellites, setSatellites] = useState([]); // [{name, id}]
    const [page, setPage] = useState(0);
    const [checked, setChecked] = useState([]); // [{id}]
    const [checkedSatellites, setCheckedSatellites] = useState([]);
    const [currentSatelliteIndex, setCurrentSatelliteIndex] = useState(0); // satellite info index
    const [currentSatellite, setCurrentSatellite] = useState(null); // satellite info
    const [selectedSatellites, setSelectedSatellites] = useState([]);
    const count = 10;
    const maxCheckedSatellites = 3;
    const satelliteRef1 = useRef();
    const satelliteRef2 = useRef();
    const [collisionDetected, setCollisionDetected] = useState(false);
    const [explosion, setExplosion] = useState(false);
    const [explosionTriggered, setExplosionTriggered] = useState(false); // Add a state to track explosion status
    const explosionRef = useRef();
    const [satellite1Visible, setSatellite1Visible] = useState(true);
    const [satellite2Visible, setSatellite2Visible] = useState(true);
    const [explosionPosition, setExplosionPosition] = useState(null); // New state to store the explosion position
    const [p, setP] = useState(0);

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

    const fetchData = async () => {
        try {
            const data = await getSatelliteByIdPagination(search, page, count);
            setSatellites(data);
            if (checked.length === 0) {
                setChecked([...checked, data[0].id]);
            }
        } catch (error) {
            console.log(error);
        }
    };

     useEffect(() => {
        const fetch = async () => {
            try {
                if (currentSatellite != null && checked[currentSatelliteIndex] !== currentSatellite.id) {
                    if (checked.length === 0) {
                        setCurrentSatellite(null);
                    } else {
                        const tmp = (currentSatelliteIndex + checked.length) % checked.length;
                        setCurrentSatelliteIndex(tmp);
                        const data = await getSatelliteById(checked[tmp]);
                        setCurrentSatellite(data);
                    }
                } else if (checked.length > 0) {
                    const data = await getSatelliteById(checked[currentSatelliteIndex]);
                    setCurrentSatellite(data);
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetch();
    }, [currentSatelliteIndex, checked]);

    useEffect(() => {
        fetchData();
    }, []);

    const goBack = () => {
        if (currentSatelliteIndex === 0) {
            setCurrentSatelliteIndex(checked.length < maxCheckedSatellites ? checked.length - 1 : maxCheckedSatellites - 1);
        } else {
            setCurrentSatelliteIndex((prev) => prev - 1);
        }
    };

    const goForward = () => {
        if (currentSatelliteIndex + 1 === checked.length || currentSatelliteIndex + 1 === maxCheckedSatellites) {
            setCurrentSatelliteIndex(0);
        } else {
            setCurrentSatelliteIndex((prev) => prev + 1);
        }
    };

    const checkCollision = () => {
        // Don't check for collision if either satellite is not visible


        if (!satellite1Visible || !satellite2Visible) {
            return;
        }

        if (!satelliteRef1.current || !satelliteRef2.current) return;

        const pos1 = satelliteRef1.current.position;
        const pos2 = satelliteRef2.current.position;

        if (!pos1 || !pos2) return;

        const distance = pos1.distanceTo(pos2);
        const collisionThreshold = 0.5;

        if (distance < collisionThreshold && !collisionDetected && p > 3) {
            setExplosionPosition(pos1); // Set the explosion position to the satellite's position
            console.log("Collision detected at position:", pos1);
            // Hide satellites on collision
            setSatellite1Visible(false);
            setCollisionDetected(true);
            setExplosion(true);
            setSatellite2Visible(false);

            // Reset explosion effect and collision after 2 seconds
            setTimeout(() => {
                setCollisionDetected(false);
            }, 5000);
        }
        else
        {
            setP(p + 1);
        }
    };

    // Explosion Effect with particles
    const ExplosionEffect = () => {
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.002,
                (Math.random() - 0.5) * 0.002,
                (Math.random() - 0.5) * 0.002
            ));
        }

        useFrame(() => {
            if (explosionRef.current) {
                explosionRef.current.geometry.setFromPoints(particles.map(p => {
                    p.addScaledVector(p, 1.01); // Expand outward
                    return p;
                }));
            }
        });

        return (
            <Points ref={explosionRef} positions={particles}>
                <PointMaterial size={0.005} color="orange" />
            </Points>
        );
    };

    const CollisionChecker = () => {
        useFrame(() => {
            checkCollision();
        });
        return null;
    };

    const[diagramData, setDiagramData] = useState([]);
    useEffect(() => {
        let tmp_diagramData =
        checkedSatellites.map((d) => {
            return [d.name, Number(d.collisionRes[0].pc)]
        })
        setDiagramData(tmp_diagramData);
    }, [checkedSatellites]);

    return (
        <div className="main-container">
            <div className="overlay" />
            <h1>Welcome to <span className='team-color'>ScrapSAT</span></h1>
            <Paper elevation={3} className='satellites-container'>
                <Paper component="form" elevation={0} className='search-input'>
                    <InputBase
                        className='input-base'
                        placeholder="Search Satellites"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        onChange={(e) => { setSearch(e.target.value) }}
                    />
                    <IconButton type="button" sx={{ p: '10px', marginRight: '20px' }} aria-label="search" onClick={fetchData}>
                        <SearchIcon sx={{ color: 'rgba(240, 240, 240, 0.7)' }} />
                    </IconButton>

                    
                </Paper>
                <Divider className='divider' orientation="horizontal" />
                <CheckboxList satellites={satellites} checked={checked} setChecked={setChecked} setCheckedSatellites={setCheckedSatellites} checkedSatellites={checkedSatellites}/>
            </Paper>

            <Paper elevation={3} className='collision-container'>
                <h2 className='collision-heading'>Collision Probability</h2>
                <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    //data={[["Satellite", "Probability"], ["ISS", 31], ["Copernicus", 14], ["Balkan 1", 1.2]]}
                    data={[["Satellite", "Probability"],...diagramData]}
                    options={options}
                />
            </Paper>

            {checked.length > 0 && currentSatellite !== null &&
                <Paper elevation={3} className='satellite-info-container'>
                    <h2 className='collision-heading'>{currentSatellite.name}</h2>
                    <p className='satellite-description'>{currentSatellite.satelliteDescription}</p>
                    <Button variant="outlined" endIcon={<DoubleArrowIcon />}>Learn more</Button>
                    <IconButton aria-label="arrow-back" className='arrow-back' onClick={goBack}>
                        <ArrowBackIosIcon sx={{ fontSize: '40px' }} />
                    </IconButton>
                    <IconButton aria-label="arrow-forward" className='arrow-forward' onClick={goForward}>
                        <ArrowForwardIosIcon sx={{ fontSize: '40px' }} />
                    </IconButton>
                </Paper>
            }

            <Canvas>
                <ambientLight intensity={0.1} />
                <OrbitControls enableZoom={false} />
                <Suspense fallback={null}>
                        <Earth />
                    {/*/!* Only render the satellites if no collision has happened *!/*/}
                    {/*{!collisionDetected && (*/}
                    {/*    <>*/}
                    {/*        {!collisionDetected && satellite1Visible && (*/}
                    {/*            <Satellite ref={satelliteRef1} tleData={{*/}
                    {/*                Inclination: 51.6445,*/}
                    {/*                RightAscensionOfAscendingNode: 100.3765,*/}
                    {/*                Eccentricity: 0,*/}
                    {/*                ArgumentOfPerigee: 5.33,*/}
                    {/*                MeanAnomaly: 73.9288,*/}
                    {/*                MeanMotion: 15.50204603,*/}
                    {/*            }} />)}*/}
                    {/*        {!collisionDetected && satellite2Visible && (*/}
                    {/*            <Satellite ref={satelliteRef2} tleData={{*/}
                    {/*                Inclination: 90.6445,*/}
                    {/*                RightAscensionOfAscendingNode: 100.3765,*/}
                    {/*                Eccentricity: 0,*/}
                    {/*                ArgumentOfPerigee: 5.33,*/}
                    {/*                MeanAnomaly: 73.9288,*/}
                    {/*                MeanMotion: 15.50204603,*/}
                    {/*            }} />)}*/}
                    {/*    </>*/}
                    {/*)}*/}
                    {checkedSatellites.map((sat, index) => (

                        <Satellite
                            key={sat.id} // Unique key for React
                            ref={index === 0 ? satelliteRef1 : satelliteRef2} // Assign refs to first two for collision check
                            tleData={{
                                Inclination: sat.inclination,
                                RightAscensionOfAscendingNode: sat.rightAscensionOfAscendingNode,
                                Eccentricity: sat.eccentricity,
                                ArgumentOfPerigee: sat.argumentOfPerigee,
                                MeanAnomaly: sat.meanAnomaly,
                                MeanMotion: sat.meanMotion,
                            }}
                        />
                    ))}
                    <Debris />
                    {/* Render explosion at the position of the collision */}
                    {collisionDetected && explosionPosition && (
                        <ExplosionEffectRender explosionPosition={explosionPosition} />
                    )}
                    <CollisionChecker />
                </Suspense>
                <Environment preset='sunset' />
            </Canvas>

            <DownloadButton />
        </div>
    );
};

export default Home;
