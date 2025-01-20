import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Cards from '../components/Cards'
import Footer from '../components/Footer'
import Cookies from 'js-cookie';
import axios from 'axios';

const Front = () => {
  const [topbanner, setTopBanner] = useState([]);
  const fetchTopBanner = async () => {
    const response = await axios.get('http://localhost:8000/api/others/top-banner/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    setTopBanner(response.data)
  }
  useEffect(()=>{
    fetchTopBanner();
  },[])
  return (
    <>
      <div className='front-container'>
        <main className='grid-container'>
          { topbanner.map((data)=>(
          <div className='bannner' key={data.id}>
            <img src={"http://localhost:8000/" + data.banner_image} alt="" srcSet="" />
            <h3>{data.banner_text}</h3>
          </div>
          ))}
          <div className='btn-1'>
            {!Cookies.get('logged_in') ? <Button href='/login' variant="outlined">Login Now</Button> : 
            <Button href='/products' variant="outlined">Checkout Now</Button>}
          </div>
          <div className='cards'>
            <h3>Our Avaliable Tools</h3>
            <Cards />
            <div className='btn-2'>
              <Button href='/products' variant="outlined">View More</Button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Front
