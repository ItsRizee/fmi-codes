import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavigateButton = () => {
    let navigate = useNavigate();

  const handleClick = () => {
    navigate('/about-us');
  };

  return (
    <Button variant="contained" onClick={handleClick} size='large' sx={{position: 'absolute', bottom: '2%', left: '44%', zIndex: '2'}}>To About Us Page</Button>
  );
}

export default NavigateButton;