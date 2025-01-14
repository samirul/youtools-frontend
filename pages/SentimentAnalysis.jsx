import React from 'react'
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Cookies from 'js-cookie';
import TextField from '@mui/material/TextField';
import {Unstable_NumberInput as BaseNumberInput,numberInputClasses,} from '@mui/base/Unstable_NumberInput';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {generatePath,useNavigate} from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';



const SentimentAnalysis = () => {
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

    const [progress, setProgress] = useState(0);
    const [taskid, setTaskID] = useState(Cookies.get('task_id_sentiment'))
    const [status, setStatus] = useState("Waiting for an url..");
    const [inputValueURL, setInputValueURL] = useState('');
    const [inputValueAmount, setInputValueAmount] = useState(1);
    const [backdrop, setBackDrop] = useState(false);
    const [categories, setCategories] = useState([])
    const [deleteCategory, setDeletedCategory] = useState(false);

    useEffect(() => {
        const checkBackdropSession = sessionStorage.getItem('BackdropSession');
        if (!checkBackdropSession) {
            setBackDrop(true);
            sessionStorage.setItem('BackdropSession', "true");
            setTimeout(() => {
                setBackDrop(false);
            }, 2500)
        }
        sessionStorage.removeItem('BackdropSession')
    }, [])


    useEffect(() => {
        if (taskid != null && taskid != undefined && taskid != 0) {
            const timer = setInterval(async () => {
                try {
                    if (taskid) {
                        
                        const response = await axios.get(`http://localhost:8000/api/task-status/${taskid}/`, { withCredentials: true }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            }
                        });
                        const data = response.data.msg;
                        console.log(data)
                        setProgress(data.progress)
                        if (data.state == "PENDING") {
                            setStatus("Found an url, Please wait..");
                        }
                        else if (data.state == "RUNNING") {
                            setStatus("Running, Please wait..");
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



    const handleInputChangeURL = (e) => {
        setInputValueURL(e.target.value);
    };
    const handleInputChangeAmount = (event, newValue) => {
        try {
            if (newValue == null) throw "value shouldn't be null";
            if (newValue !== null && !isNaN(newValue) && newValue !== undefined) {
                setInputValueAmount(newValue);
            }
        } catch (err) {
            setInputValueAmount(1)
        }

    };

    const handleInputChangeAmount2 = (e) => {
        try {
            if (e.target.value == null) throw "value shouldn't be null";
            if (e.target.value !== null && !isNaN(e.target.value) && e.target.value !== undefined) {
                setInputValueAmount(Number(e.target.value));
            }
        } catch (err) {
            setInputValueAmount(1)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8000/api/fetch_and_analysis/",{
            "url": inputValueURL,
            "max_len": inputValueAmount,
        }, { withCredentials: true }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },

        })
        setTaskID(response.data.msg.result_id)
        Cookies.set('task_id_sentiment', response.data.msg.result_id)
    };

    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );

    const navigate = useNavigate();
   

    useEffect(() => {
        const fetchCategory = setInterval(async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/', { withCredentials: true }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                setCategories(response.data.msg.data)
                clearInterval(fetchCategory);
            } catch(error) {
                console.log(error)
                clearInterval(fetchCategory);
            }
        }, 1000);
        return () => {
            clearInterval(fetchCategory);
        };
    }, [progress, deleteCategory])

    const handleDeleteCategories = async (e, id) =>{
        e.stopPropagation();
        try{
          await axios.delete(`http://localhost:8000/api/delete_category/${id}/`, { withCredentials: true },{
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          })
          setDeletedCategory(true)
        }catch(error){
          console.log(error)
        }
      }

    const handleProceed = (id) => {
        id && navigate(generatePath("/category-data-result/:id/", { id }));
    };
    return (
        <>
            <div className='sentiment-analysis-container'>
                <Backdrop
                    sx={(theme) => ({ color: '#a3fff9', zIndex: theme.zIndex.drawer + 1 })}
                    open={backdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                {backdrop ? "" :
                    <main className='grid-container-analysis'>
                        <div className="sentiment-analysis-loading">
                            <Box>
                                <LinearProgressWithLabel value={progress} />
                            </Box>
                        </div>
                        <p className='text-bar'>{status ? status : ''}</p>
                        <div className="sentiment-analysis-Searchbar">
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                autoComplete="off"
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                            >
                                <Box sx={{ width: '35ch' }}>
                                    <TextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        value={inputValueURL}
                                        onChange={handleInputChangeURL}
                                        placeholder="Enter your YouTube link"
                                        fullWidth
                                    />
                                </Box>
                                <Box sx={{ width: '35ch' }}>
                                    <NumberInput
                                        aria-label="Demo number input"
                                        min={1}
                                        value={inputValueAmount}
                                        onInputChange={handleInputChangeAmount2}
                                        onChange={handleInputChangeAmount}
                                        placeholder="Type a number…"
                                        fullWidth
                                    />
                                </Box>
                                <Button
                                    disabled={inputValueAmount === 0 || inputValueURL === ''}
                                    className="button-grid"
                                    type="submit"
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                >
                                    Analyze YouTube Comments
                                </Button>
                            </Box>
                        </div>

                        <div className="sentiment-analysis-Categories">
                            <div className='cards-category-grid'>
                                {categories.map((val, index) => (
                                    <Card sx={{ minWidth: 100 }} key={index} className='cards-category' onClick={() => handleProceed(val.id)}>
                                        <CardContent>
                                            <Typography variant="h7" component="div" className='category-cate'>
                                                Category Name
                                            </Typography>
                                            <br />
                                            <Typography variant="h5" className='category-title'>
                                                {val.category_name}
                                            </Typography>
                                            <DeleteIcon className='delete-btn' onClick={(e)=> handleDeleteCategories(e, val.id)}/>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </main>
                }
            </div>
        </>

    );

};

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
    box-shadow: 0 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
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

export default SentimentAnalysis



