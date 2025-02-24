import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Cards from '../components/Cards'
import ReactMarkdown from "react-markdown";
import Cookies from 'js-cookie';
import axios from 'axios';

const Front = () => {
  const [topBanner, setTopBanner] = useState([]);
  const [bottomBanner, setBottomBanner] = useState([]);

  const fetchTopBanner = async () => {
    const response = await axios.get('http://localhost:80/api/others/top-banner/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    setTopBanner(response.data)
  }
  const fetchBottomBanner = async () => {
    const response = await axios.get('http://localhost:80/api/others/bottom-banner/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    setBottomBanner(response.data)
  }
  useEffect(()=>{
    fetchTopBanner();
    fetchBottomBanner();
  },[])
  return (
    <>
      <div className='front-container'>
        <main className='grid-container'>
          { topBanner.map((data)=>(
          <div className='bannner' key={data.id}>
            <img src={"http://localhost:80/" + data.banner_image} alt="" srcSet="" />
            <h3><ReactMarkdown>{data.banner_text}</ReactMarkdown></h3>
          </div>
          ))}
          <div className='btn-1'>
            {!Cookies.get('logged_in') ? <Button href='/login' variant="outlined">Login Now</Button> : 
            <Button href='/products' variant="outlined">Checkout Now</Button>}
          </div>
          <div className='cards'>
            <h3>Our Available Tools</h3>
            <Cards />
            <div className='btn-2'>
              <Button href='/products' variant="outlined">View More</Button>
            </div>
          </div>
          { bottomBanner.map((data)=>(
          <div className='bannner-2' key={data.id}>
            <h3><ReactMarkdown>{data.banner_text}</ReactMarkdown></h3>
            <img src={"http://localhost:80/" + data.banner_image} alt="" srcSet="" />
          </div>
          ))}
          <div className='btn-1'>
            {!Cookies.get('logged_in') ? <Button href='/login' variant="outlined">Login Now</Button> : 
            <Button href='/products' variant="outlined">Click Here</Button>}
          </div>
        </main>
      </div>
    </>
  )
}

export default Front
