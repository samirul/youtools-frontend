import { useState } from 'react'
import Front from '../pages/Front'
import FrontNavbar from '../components/FrontNavbar'
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
        <FrontNavbar/>
          <Routes>
            <Route path="/" exact element={<Front/>} />
          </Routes>
      </Router>
    </>
  )
}

export default App
