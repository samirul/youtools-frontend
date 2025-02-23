import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

const FrontNavbar = () => {
  const [userProfile, setUserProfile] = useState([])
  const logged = Cookies.get('logged_in')

  const handlelogout = async () =>{
    const res = await axios.get("http://localhost/accounts/user/", { withCredentials: true }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    await axios.post('http://localhost:80/api/auth/logout/',{
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }, { withCredentials: true });
    Cookies.remove('logged_in')
    Cookies.remove(`task_id_text2_${res.data.user.id}`)
    Cookies.remove(`task_id_sentiment_${res.data.user.id}`)
    localStorage.removeItem('_id_task_id_')
    window.location.replace("/")
  }

  const handleProfile = async () =>{
    const response = await axios.get("http://localhost/accounts/user/", { withCredentials: true }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    setUserProfile([response.data.user])
  }
  useEffect(()=>{
    handleProfile();
  }, [])
  return (
    <div>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="/" className='nav-title'>Youtools AI</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-end flex-grow-1 pe-3" id='links'>
              <Nav.Link href="/products">Products</Nav.Link>
              {logged ? userProfile.map((data, index)=>(
              <Nav key={index} style={{marginLeft: 10, marginRight: 10}}>
                <Nav.Link className='user-info'>{data.username.toUpperCase()}</Nav.Link>
                  <Image src={"http://localhost" + data.profilePic} style={{height: 35, width: 35}} roundedCircle />
              </Nav>
              )): ""}
              {!logged ? <Nav.Link href="/login">Login</Nav.Link> :
                <Nav.Link type="button" onClick={handlelogout}>Logout</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default FrontNavbar
