import React from 'react'
import Button from '@mui/material/Button';
import Cards from '../components/Cards'
import Footer from '../components/Footer'

const Front = () => {
  return (
    <>
      <div className='front-container'>
        <main className='grid-container'>
          <div className='bannner'>
            <img src="..\public\images\img1.jpg" alt="" srcSet="" />
            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae illo ipsum reprehenderit deserunt. Sequi, esse!</h3>
          </div>
          <div className='btn-1'>
            <Button variant="outlined">Login Now</Button>
          </div>
          <div className='cards'>
            <h3>Our Avaliable Tools</h3>
            <Cards />
            <div className='btn-2'>
              <Button variant="outlined">View More</Button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Front
