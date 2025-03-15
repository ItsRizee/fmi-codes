import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const CheckboxList = () => {
    const [checked, setChecked] = React.useState([0]);

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
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
                return (
                    <ListItem
                        key={value}
                        disablePadding
                    >
                        <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked.includes(value)}
                                    tabIndex={-1}
                                    disableRipple
                                    sx={{color: 'rgba(240, 240, 240, 0.7)'}}
                                />
                            </ListItemIcon>
                            <ListItemText id={`checkbox-list-label-${value}`} primary={`Satelite ${value + 1}`} sx={{color: 'rgba(240, 240, 240, 0.7)'}}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default CheckboxList;