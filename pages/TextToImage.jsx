import React from 'react'
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Cookies from 'js-cookie';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useTheme, useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import {Grid2} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const TextToImage = () => {
  const [progress, setProgress] = useState(0);
  const [taskid, setTaskID] = useState(Cookies.get('task_id_text2'));
  const [status, setStatus] = useState("Waiting for text..");
  const [inputValue, setInputValue] = useState('');
  const [imageData, setImageData] = useState([]);
  const [deletedImage, setDeletedImage] = useState(false);
  const [backdrop, setBackDrop] = useState(false);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM2NTk3NDk4LCJpYXQiOjE3MzY1OTYyOTgsImp0aSI6IjQ4OGE0NTEzZTlkYzQ2MzE4MjA5YjRkNmMzYTY2ZjZlIiwidXNlcl9pZCI6ImJmMWQ0MzViLTIyNWUtNGE1Yi1iMGQxLTA4NjQyNGNiNGYxZCJ9.vQ8xL_RYF9SDw-VaAqq-6aRMsXTFVqIoesfXCwI9oAY"

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

  useEffect(()=>{
    const checkBackdropSession = sessionStorage.getItem('BackdropSession');
    if(!checkBackdropSession){
      setBackDrop(true);
      sessionStorage.setItem('BackdropSession', "true");
      setTimeout(()=>{
        setBackDrop(false);
      }, 2500)
    }
    sessionStorage.removeItem('BackdropSession')
  },[])

  useEffect(() => {
    if (taskid != null && taskid != undefined && taskid != 0) {
      const timer = setInterval(async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/task-status-image/${taskid}/`, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data = response.data.msg;
          console.log(data)
          setProgress(data.progress)
          if (data.state == "PENDING") {
            setStatus("Found a text, Please wait for model to load, It will take awhile, Be patient..");
          }
          else if (data.state == "RUNNING") {
            setStatus("Model is loaded, Generating image, Please wait..");
          }

          else if (data.state == "SUCCESS") {
            setProgress(100);
            setStatus("Completed");
            clearInterval(timer);
          }

          else if (data.state == "FAILURE") {
            setProgress(0);
            setStatus("Failed");
            clearInterval(timer);
          }

        } catch (error) {
          setStatus("Failed", error);
          clearInterval(timer);
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [taskid, progress]);


  useEffect(()=>{
    const fetchImages = setInterval( async () =>{
      try{
        const response = await axios.get("http://127.0.0.1:8000/api/images/", {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
    
        })
        setImageData(response.data.msg.data)
        clearInterval(fetchImages);
      } catch(error){
        console.log(error)
        clearInterval(fetchImages);
      }
    }, 1000);
    return () => {
      clearInterval(fetchImages);
    };
  },[progress, deletedImage])


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post("http://127.0.0.1:8000/api/generate_image/", {
        "text": inputValue,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
  
      })
      setTaskID(response.data.msg.result_id)
      Cookies.set('task_id_text2', response.data.msg.result_id)
      console.log('Input Value:', inputValue);
    } catch(error){
      console.log(error)
    }
  };


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Determine the number of columns based on screen size
  const getColumns = () => {
    if (isSmallScreen) return 1;
    if (isMediumScreen) return 2;
    return 3;
  };

  // Handle click on an image to view it in a new tab
  const handleImageClick = (imageData, mimeType) => {
    const newTab = window.open();
    if (newTab) {
      const htmlContent = `
        <html>
          <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background-color:#000;">
            <img src="data:${mimeType};base64,${imageData}" style="max-width:100%;max-height:100%;" />
          </body>
        </html>`;
      newTab.document.write(htmlContent);
      newTab.document.close();
    }
  };

  const handleDeleteImage = async (e, id) =>{
    e.stopPropagation();
    try{
      await axios.delete(`http://127.0.0.1:8000/api/delete_image/${id}/`,{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      setDeletedImage(true)
    }catch(error){
      console.log(error)
    }
  }


  return (
    <>
      <div className='text-to-image-container'>
      <Backdrop
        sx={(theme) => ({color: '#a3fff9', zIndex: theme.zIndex.drawer + 1 })}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      { backdrop ? "" :
        <main className='grid-container-text'>
          <div className="text2image-loading">
            <Box sx={{ width: '100%' }}>
              <LinearProgressWithLabel value={progress} />
            </Box>
          </div>
          <p className='text-bar'>{status?  status : ''}</p>
          <div className="text2image-inputbar">
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
          </div>
          <div className="text2image-images">
            <Box
              sx={{
                width: '100%',
                maxWidth: 800,
                height: 1200,
                overflowY: 'scroll',
                margin: 'auto',
                border: '1px solid #ddd',
                borderRadius: 2,
                padding: 1,
              }}
            >
              <ImageList variant="masonry" cols={getColumns()} gap={8}>
                { imageData ? imageData.map((item) => (
                  <ImageListItem
                    key={item.id}
                    onClick={() => handleImageClick(item.image_data, item.mime_type)}
                    style={{ cursor: 'pointer' }} // Makes the images clickable
                  >
                    <img
                      src={`data:${item.mime_type};base64,${item.image_data}`}
                      alt={item.image_name}
                      loading="lazy"
                      className='image-list'
                    />
                    <Grid2>
                    <ImageListItemBar className='text-title-image' position="below" title={item.image_name.toUpperCase()} />
                    <DeleteIcon className='delete-btn' onClick={(e)=> handleDeleteImage(e, item.id)}/>
                    </Grid2>
                  </ImageListItem>
                )) : ""}
              </ImageList> 
            </Box>
          </div>
        </main>
      }
      </div>
    </>
  )
}

export default TextToImage
