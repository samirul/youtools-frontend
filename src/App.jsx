import Front from '../pages/Front'
import ProductFront from '../pages/ProductFront'
import FrontNavbar from '../components/FrontNavbar'
import Footer from '../components/Footer'
import TextToImage from '../pages/TextToImage';
import SentimentAnalysis from '../pages/SentimentAnalysis';
import CategoriesAndDatas from '../pages/CategoriesAndDatas';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from '../pages/Login';
import Register from '../pages/Register';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function App() {
  const [backdrop, setBackDrop] = useState(false);
  useEffect(() => {
    const checkBackdropSession = sessionStorage.getItem('BackdropSession');
    if (!checkBackdropSession) {
      setBackDrop(true);
      sessionStorage.setItem('BackdropSession', "true");
      setTimeout(() => {
        setBackDrop(false);
      }, 2500)
    }
    sessionStorage.removeItem('BackdropSession')
  }, [])
  useEffect(() => {
    if (Cookies.get('logged_in')) {
      const timeout = 1000 * 300
      const fetchAccess = setInterval(async () => {
        try {
          await axios.post('http://localhost:8000/api/auth/token/refresh/', {
            headers: {
              'X-CSRFToken': Cookies.get('csrftoken'),
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          }, { withCredentials: true });
          Cookies.set('logged_in', true, { expires: new Date(new Date().getTime() + 15 * 60 * 1000), path: '' })
        } catch (error) {}
      }, timeout);
      return () => {
        clearInterval(fetchAccess);
      }
    }
  }, []);
  const logged = Cookies.get('logged_in')
  return (
    <>
      <Router>
        <FrontNavbar />
        <Backdrop
          sx={(theme) => ({ color: '#a3fff9', zIndex: theme.zIndex.drawer + 1 })}
          open={backdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {backdrop ? "" :
          <Routes>
            <Route path="/" exact element={<Front />} />
            {logged ? (<Route path="/login" exact element={<Navigate to="/" replace />} />) :
              (<Route path="/" exact element={<Front />} />)}
            {logged ? (<Route path="/register" exact element={<Navigate to="/" replace />} />) :
              (<Route path="/" exact element={<Front />} />)}
            <Route path="/products" exact element={<ProductFront />} />
            <Route path="/generate-image" exact element={<TextToImage />} />
            <Route path="/analysis-youtube-comments" exact element={<SentimentAnalysis />} />
            <Route path="/category-data-result/:category_id" exact element={<CategoriesAndDatas />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" exact element={<Register />} />
          </Routes>
        }
        {backdrop ? "" :
        <footer>
          <Footer />
        </footer>
        }
      </Router>
    </>
  )
}

export default App
