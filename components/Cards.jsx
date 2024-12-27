import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const Cards = () => {
    return (
        <>
            <div className='cards-grid'>
                <Card sx={{ maxWidth: 345 }} className='card-items'>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="180"
                            image="..\public\images\img1.jpg"
                            alt="green iguana"
                        />
                        <CardContent className="card-background">
                            <Typography gutterBottom variant="h5" component="div" className="title-color">
                                Lizard
                            </Typography>
                            <Typography variant="body2" className="card-text">
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card sx={{ maxWidth: 345 }} className='card-items'>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="180"
                            image="..\public\images\img1.jpg"
                            alt="green iguana"
                        />
                        <CardContent className="card-background">
                            <Typography gutterBottom variant="h5" component="div" className="title-color">
                                Lizard
                            </Typography>
                            <Typography variant="body2" className="card-text">
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card sx={{ maxWidth: 345 }} className='card-items'>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="180"
                            image="..\public\images\img1.jpg"
                            alt="green iguana"
                        />
                        <CardContent className="card-background">
                            <Typography gutterBottom variant="h5" component="div" className="title-color">
                                Lizard
                            </Typography>
                            <Typography variant="body2" className="card-text">
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>

        </>
    )
}

export default Cards
