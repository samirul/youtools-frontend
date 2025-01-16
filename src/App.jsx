import Front from '../pages/Front'
import ProductFront from '../pages/ProductFront'
import FrontNavbar from '../components/FrontNavbar'
import Footer from '../components/Footer'
import TextToImage from '../pages/TextToImage';
import SentimentAnalysis from '../pages/SentimentAnalysis';
import CategoriesAndDatas from '../pages/CategoriesAndDatas';
import {
  // HashRouter as Router,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from '../pages/Login';
import Register from '../pages/Register';

function App() {
  return (
    <>
      <Router>
        <FrontNavbar />
        <Routes>
          <Route path="/" exact element={<Front />} />
          <Route path="/products" exact element={<ProductFront />} />
          <Route path="/generate-image" exact element={<TextToImage />} />
          <Route path="/analysis-youtube-comments" exact element={<SentimentAnalysis />} />
          <Route path="/category-data-result/:category_id" exact element={<CategoriesAndDatas />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
        </Routes>
        <footer>
          <Footer />
        </footer>
      </Router>
    </>
  )
}

export default App
