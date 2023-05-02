import { Routes, Route } from 'react-router-dom';

// Routes
import Home from '../routes/home';
import Browse from '../routes/browse';
import Media from '../routes/media';

// Components
import Nav from './nav/nav';

export default function App() {
    return (
        <div className="app-container">
            <Nav/>
            <Routes>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/browse' element={<Browse/>}></Route>
                <Route path='/media' element={<Media/>}></Route>
            </Routes>
        </div>
    )
};