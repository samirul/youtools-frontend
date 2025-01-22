import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';

export default function ProductCards() {
    const [products, setProducts] = useState([])
    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/products/product-items/", { withCredentials: true }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })
            const data = response.data;
            setProducts(data.data)
        } catch (error) {
            if (error.status == 401) {
                window.location.replace("/login")
            }
        }
    }
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
                        image={`http://localhost:8000/${item.product_image}`}
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
