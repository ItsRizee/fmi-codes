import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AboutUs from "./pages/AboutUs";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/about-us' element={<AboutUs />} />
        </Routes>
    );
}

export default App;
