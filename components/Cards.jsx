import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';

const Cards = () => {
    const [card, setCards] = useState([])
    const fetchCards = async () => {
        const response = await axios.get("http://localhost:80/api/products/product-items/front/", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        setCards(response.data.data)
    }
    useEffect(() => {
        fetchCards();
    }, [])
    return (
        <>
            <div className='cards-grid'>
                {card.map((data) => (
                    <Card sx={{ maxWidth: 340 }} className='card-items' key={data.id}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="180"
                                image={"http://localhost:80/" + data.product_image}
                                alt="card_Front_imges"
                            />
                            <CardContent className="card-background">
                                <Typography gutterBottom variant="h5" component="div" className="title-color">
                                    {data.product_name}
                                </Typography>
                                <Typography variant="body2" className="card-text">
                                    {data.product_description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </div>

        </>
    )
}

export default Cards
