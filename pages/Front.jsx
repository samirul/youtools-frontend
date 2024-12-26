import React from 'react'
import Button from '@mui/material/Button';
import Cards from '../components/Cards'
import Footer from '../components/Footer'

const Front = () => {
  return (
    <>
      <div>
        <main className='grid-container'>
          <div className='bannner'>
            <img src="..\public\images\img1.jpg" alt="" srcSet="" />
            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae illo ipsum reprehenderit deserunt. Sequi, esse!</h3>
          </div>
          <div className='btn-1'>
            <Button variant="outlined">Login Now</Button>
          </div>
          <div className='cards'>
            <h3>Our Avalible Tools</h3>
            <Cards />
            <div className='btn-2'>
              <Button variant="outlined">View More</Button>
            </div>
          </div>
        </main>
        <footer>
          <Footer/>
        </footer>
      </div>
    </>
  )
}

export default Front
