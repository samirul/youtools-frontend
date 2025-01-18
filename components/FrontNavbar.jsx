import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const FrontNavbar = () => {
  const logged = Cookies.get('logged_in')
  const handlelogout = async () =>{
    await axios.post('http://localhost:8000/api/auth/logout/',{
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }, { withCredentials: true });
    Cookies.remove('logged_in')
    window.location.replace("/")
  }
  return (
    <div>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="#home" className='nav-title'>Youtools AI</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-end flex-grow-1 pe-3" id='links'>
              <Nav.Link href="/products">Products</Nav.Link>
              {!logged ? <Nav.Link href="/login">Login/Register</Nav.Link> : 
              <Nav.Link type="button" onClick={handlelogout}>Logout</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default FrontNavbar
