import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function InputBar() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Input Value:', inputValue);
  };
  return (

    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
    >
      <Box sx={{ '& > :not(style)': { m: 2, width: '35ch' } }}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          value={inputValue}
          onChange={handleInputChange}
        />
      </Box>
      <Button
        className='button-grid'
        type="submit"
        variant="outlined"
        sx={{ mt: 2 }}
      >
        Generate AI Image
      </Button>
    </Box>


  );
}
