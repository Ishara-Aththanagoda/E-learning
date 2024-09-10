// src/components/Home.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';


const Home = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div className="home-container">
           

            <h1 className="animated-text">Welcome to the E Learning</h1>
            <p>Your one-stop solution for managing school processes efficiently.</p>
            <button className="get-started-btn" onClick={handleGetStarted}>
                Get Started
            </button>
        </div>
    );
};

export default Home;
