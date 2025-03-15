import {useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const CheckboxList = ({satellites}) => {
    const [checked, setChecked] = useState([]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
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