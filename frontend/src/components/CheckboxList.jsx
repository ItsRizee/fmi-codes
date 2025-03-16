import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import {getSatellitesCollision} from "../services/getSatellitesCollision";

const CheckboxList = ({satellites, checked, setChecked, setCheckedSatellites, checkedSatellites}) => {

    const handleToggle =  (value) => async () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            const data = await getSatellitesCollision(value);
            setCheckedSatellites([
                ...checkedSatellites,
                {
                    id: data.satelliteDto.id,
                    name: data.satelliteDto.name,
                    number: data.satelliteDto.number,
                    inclination: data.satelliteDto.inclination,
                    rightAscensionOfAscendingNode: data.satelliteDto.rightAscensionOfAscendingNode,
                    eccentricity: data.satelliteDto.eccentricity,
                    argumentOfPerigee: data.satelliteDto.argumentOfPerigee,
                    meanAnomaly: data.satelliteDto.meanAnomaly,
                    meanMotion: data.satelliteDto.meanMotion,
                    satelliteDescription: data.satelliteDto.satelliteDescription
                }
            ]);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <List sx={{ width: '100%', maxWidth: 360 }}>
            {satellites.map((satellite) => {
                return (
                    <ListItem
                        key={satellite.id}
                        disablePadding
                    >
                        <ListItemButton role={undefined} onClick={handleToggle(satellite.id)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked.includes(satellite.id)}
                                    tabIndex={-1}
                                    disableRipple
                                    sx={{color: 'rgba(240, 240, 240, 0.7)'}}
                                />
                            </ListItemIcon>
                            <ListItemText id={`checkbox-list-label-${satellite.id}`} primary={`Satellite ${satellite.name}`} sx={{color: 'rgba(240, 240, 240, 0.7)'}}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default CheckboxList;