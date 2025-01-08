import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {
    generatePath,
    useNavigate,
  } from "react-router-dom";


const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

export default function CategoriesCard() {
    const [categories, setCategories] = useState([])
    const navigate = useNavigate();
    const fetchCategory = async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/categories/', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM2MDI1MzY0LCJpYXQiOjE3MzYwMjQxNjQsImp0aSI6IjA3ODQ1YmMzNGY1ZDRlNDhhYzU3ZGViYjUzNmFhODZjIiwidXNlcl9pZCI6ImJmMWQ0MzViLTIyNWUtNGE1Yi1iMGQxLTA4NjQyNGNiNGYxZCJ9.57tFZENWK5SDjvSmuXFri25ca7BGBqbx2iHgS7mN4xY`
            }
        });
        setCategories(response.data.msg.data)
    }

    useEffect(() => {
        fetchCategory();
    }, [])

    const handleProceed = (id) => {
        id && navigate(generatePath("/category-data-result/:id/", { id }));
      };
    return (
        <div className='cards-category-grid'>
            {categories.map((val, index)=>(
            <Card sx={{ minWidth: 100 }} key={index} className='cards-category' onClick={()=>handleProceed(val.id)}>
                <CardContent>
                    <Typography variant="h7" component="div" className='category-cate'>
                        Category Name
                    </Typography>
                    <br/>
                    <Typography variant="h5" className='category-title'>
                        {val.category_name}
                    </Typography>
                </CardContent>
            </Card>
            ))}
        </div>

    );
}
