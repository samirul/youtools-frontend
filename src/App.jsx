import Front from '../pages/Front'
import ProductFront from '../pages/ProductFront'
import FrontNavbar from '../components/FrontNavbar'
import Footer from '../components/Footer'
import {
  // HashRouter as Router,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router";

function App() {
  return (
    <>
      <Router>
        <FrontNavbar />
        <Routes>
          <Route path="/" exact element={<Front />} />
          <Route path="/products" exact element={<ProductFront />} />
        </Routes>
        <footer>
          <Footer />
        </footer>
      </Router>
    </>
  )
}

export default App
