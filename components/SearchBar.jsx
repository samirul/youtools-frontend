import * as React from 'react';
import { useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const NumberInput = React.forwardRef(function NumberInput(props, ref) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '▴',
        },
        decrementButton: {
          children: '▾',
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

export default function SearchBar() {
  const [inputValueURL, setInputValueURL] = useState('');
  const [inputValueAmount, setInputValueAmount] = useState(1);

  const handleInputChangeURL = (e) => {
    setInputValueURL(e.target.value);
  };
  const handleInputChangeAmount = (event, newValue) => {
    try{
      if(newValue == null) throw "value shouldn't be null";
      if (newValue !== null && isNaN(newValue) || newValue !== undefined) {
        setInputValueAmount(newValue);
        }
    }catch(err) {
      setInputValueAmount(1)
    }
    
  };

  const handleInputChangeAmount2 = (e) => {
    try{
      if(e.target.value == null) throw "value shouldn't be null";
      if (e.target.value !== null && isNaN(e.target.value) || e.target.value !== undefined) {
        setInputValueAmount(Number(e.target.value));
      }
    }catch(err) {
      setInputValueAmount(1)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Input Value:', inputValueURL);
    console.log('Input Value int:', inputValueAmount);
    const response = await axios.post("http://127.0.0.1:8000/api/fetch_and_analysis/", {
      "url": inputValueURL,
      "max_len": inputValueAmount,
    },{
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Authorization': `Bearer ${token}`,
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM2MDIyMDgzLCJpYXQiOjE3MzYwMjA4ODMsImp0aSI6IjBjZmRlZGI2OGUzZjQ5NTliNTU4NmViODIxYzgxZDVhIiwidXNlcl9pZCI6ImJmMWQ0MzViLTIyNWUtNGE1Yi1iMGQxLTA4NjQyNGNiNGYxZCJ9.G_WBzPOTqjq39YFh8ovEmgx-6f7Uc4Q7qt_WlPdUQig`
      },
      
    })
    console.log(response.data.msg)
    Cookies.set('task_id', response.data.msg.result_id)
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
          value={inputValueURL}
          onChange={handleInputChangeURL}
          placeholder='Enter your youtube link'
        />
      </Box>
      <Box sx={{ '& > :not(style)': { m: 2, width: '30ch' } }}>
        <NumberInput
          aria-label="Demo number input"
          min={1}
          value={inputValueAmount}
          onInputChange={handleInputChangeAmount2}
          onChange={handleInputChangeAmount}
          placeholder="Type a number…" />
      </Box>
      <Button
        disabled={inputValueAmount === 0 || inputValueURL ===''}
        className='button-grid'
        type="submit"
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Analysis Youtube Comments
      </Button>
    </Box>


  );
}

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'Poppins', 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  /* firefox */
  &:focus-visible {
    outline: 0;
  }
`,
);

const StyledInputElement = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`,
);

const StyledButton = styled('buttons')(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 0;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
    color: #FFF;
    background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
    border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};

    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
    }
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }

  & .arrow {
    transform: translateY(-1px);
  }
`,
);
