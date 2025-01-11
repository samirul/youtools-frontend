import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';

export default function ProductCards() {
    const [products, setProducts] = useState([])
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM2NjE5NTY2LCJpYXQiOjE3MzY2MTgzNjYsImp0aSI6ImE0NWIzYjlmNjFmZTQ2OGM5OGY3NjRiNmYyZGM4ZjI5IiwidXNlcl9pZCI6ImJmMWQ0MzViLTIyNWUtNGE1Yi1iMGQxLTA4NjQyNGNiNGYxZCJ9.f2PzAd0U5SsLQfZh342AGhiv8g6aFnY4pvssYXypbL4"
    const fetchData = async () =>{
        const response = await axios.get("http://127.0.0.1:8000/api/products/product-items/",{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
        })
        const data = response.data;
        setProducts(data.data)
    }

    console.log(products)

    useEffect(()=>{
        fetchData();
    },[])
    return (
        <div className="cards-grid-products">
            { products ? products.map((item)=>(
            <Card key={item.id} sx={{ maxWidth: 345 }} className='card-items' onClick={() => window.location.href = `/${item.product_url}`}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="180"
                        image={`http://127.0.0.1:8000/${item.product_image}`}
                        alt={`product_images_${item.product_name}`}
                    />
                    <CardContent className="card-background">
                        <Typography gutterBottom variant="h5" component="div" className="title-name title-color">
                            {item.product_name}
                        </Typography>
                        <Typography variant="body2" className="card-text">
                        {item.product_description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
             )) : ""}
        </div>

    );
}
