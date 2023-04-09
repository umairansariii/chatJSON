import { Routes, Route } from 'react-router-dom';

// Routes
import Dashboard from '../routes/dashboard';

// Components
import Nav from './nav/nav';

export default function App() {
    return (
        <div className="app-container">
            <Nav/>
            <Routes>
                <Route path='/' element={<Dashboard/>}></Route>
            </Routes>
        </div>
    )
};