import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Cookies from 'js-cookie';

const GradientLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`& .MuiLinearProgress-bar`]: {
    background: `linear-gradient(to right,rgb(255, 7, 7),rgb(255, 74, 210), rgb(251, 255, 12) )`,
    borderRadius: 5,
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <GradientLinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'white' }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function Progressbar() {
  const [progress, setProgress] = useState(0);
  const [taskid, setTaskID] = useState(Cookies.get('task_id'))
  const [status, setStatus] = useState("Not Started");

  
  React.useEffect(() => {
    const timer = setInterval(async () => {
     try{
      const response = await axios.get(`http://127.0.0.1:8000/api/task-status/${taskid}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${token}`,
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM2MDIyMDgzLCJpYXQiOjE3MzYwMjA4ODMsImp0aSI6IjBjZmRlZGI2OGUzZjQ5NTliNTU4NmViODIxYzgxZDVhIiwidXNlcl9pZCI6ImJmMWQ0MzViLTIyNWUtNGE1Yi1iMGQxLTA4NjQyNGNiNGYxZCJ9.G_WBzPOTqjq39YFh8ovEmgx-6f7Uc4Q7qt_WlPdUQig`
        }
      });
      const data = response.data.msg;
      console.log(data)
      setProgress(data.progress)

      if(data.state == "SUCCESS"){
        setProgress(100);
        setStatus("Completed");
        clearInterval(timer);
      }

      else if(data.state == "FAILURE"){
        setProgress(0);
        setStatus("Failed");
        clearInterval(timer);
      }

     }catch(error){
      setStatus("Failed", error);
      clearInterval(timer);
     }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [taskid]);
  
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}
