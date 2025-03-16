import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MyButton = () => {
    let navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Button variant="contained" onClick={handleClick} size='large' sx={{position: 'absolute', top: '52%', left: '46%', zIndex: '2'}}>To main page</Button>
  );
}

export default MyButton;