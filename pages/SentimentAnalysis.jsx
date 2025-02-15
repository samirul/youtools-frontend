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
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { generatePath, useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';



const SentimentAnalysis = () => {
    const GradientLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        width: 1000,
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
    const item = localStorage.getItem('_id_task_id_')
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Waiting for an url..");
    const [inputValueURL, setInputValueURL] = useState('');
    const [inputValueAmount, setInputValueAmount] = useState(1);
    const [categories, setCategories] = useState([])
    const [deleteCategory, setDeletedCategory] = useState(false);
    const [taskid, setTaskID] = useState(Cookies.get(`task_id_sentiment_${item}`))


    useEffect(() => {
        if (taskid != null && taskid != undefined && taskid != 0) {
            const timer = setInterval(async () => {
                try {
                    if (taskid) {
                        const response = await axios.get(`http://localhost:80/api/task-status/${taskid}/`, { withCredentials: true }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            }
                        });
                        const data = response.data.msg;
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
                    if (error.status == 401) {
                        window.location.replace("/login")
                    }
                }
            }, 1000);
            return () => {
                clearInterval(timer);
            };
        }
    }, [taskid, progress]);

    const handleInputChangeURL = (e) => {
        setInputValueURL(e.target.value);
    };


    const handleInputChangeAmount = (e) => {
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
        try {
            const res = await axios.get("http://localhost/accounts/user/", { withCredentials: true }, {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                }
              })
              localStorage.setItem("_id_task_id_", res.data.user.id)
            const response = await axios.post("http://localhost:80/api/fetch_and_analysis/", {
                "url": inputValueURL,
                "max_len": inputValueAmount,
            }, { withCredentials: true }, {
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },

            })
            setTaskID(response.data.msg.result_id)
            const item = localStorage.getItem('_id_task_id_')
            Cookies.set(`task_id_sentiment_${item}`, response.data.msg.result_id)
        } catch (error) {
            if (error.status == 401) {
                window.location.replace("/login")
            }
        }

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
                const response = await axios.get('http://localhost:80/api/categories/', { withCredentials: true }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                setCategories(response.data.msg.data)
                clearInterval(fetchCategory);
            } catch (error) {
                clearInterval(fetchCategory);
                if (error.status == 401) {
                    window.location.replace("/login")
                }
            }
        }, 1000);
        return () => {
            clearInterval(fetchCategory);
        };
    }, [progress, deleteCategory])

    const handleDeleteCategories = async (e, id) => {
        e.stopPropagation();
        try {
            await axios.delete(`http://localhost:80/api/delete_category/${id}/`, { withCredentials: true }, {
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
            setDeletedCategory(true)
            const response = await axios.get('http://localhost:80/api/categories/', { withCredentials: true }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            setCategories(response.data.msg.data)
        } catch (error) {
            if (error.status == 401) {
                window.location.replace("/login")
            }
        }
    }

    const handleProceed = (id) => {
        id && navigate(generatePath("/category-data-result/:id/", { id }));
    };
    return (
        <>
            <div className='sentiment-analysis-container'>
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
                                <input
                                    className='number-field'
                                    type='tel'
                                    value={inputValueAmount}
                                    onChange={handleInputChangeAmount}
                                    pattern="^-?[0-9]\d*\.?\d*$"
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
                            {categories ? categories.map((val, index) => (
                                <Card sx={{ minWidth: 100 }} key={index} className='cards-category' onClick={() => handleProceed(val.id)}>
                                    <CardContent>
                                        <Typography variant="h7" component="div" className='category-cate'>
                                            Category Name
                                        </Typography>
                                        <br />
                                        <Typography variant="h5" className='category-title'>
                                            {val.category_name}
                                        </Typography>
                                        <DeleteIcon className='delete-btn' onClick={(e) => handleDeleteCategories(e, val.id)} />
                                    </CardContent>
                                </Card>
                            )): ""}
                        </div>
                    </div>
                </main>
            </div>
        </>

    );

};


export default SentimentAnalysis



