// src/components/TimerPage.js
import React, { useState, useEffect } from 'react';
import './TimerPage.css';

const TimerPage = () => {
    const [time, setTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [inputTime, setInputTime] = useState('');

    useEffect(() => {
        let timer;
        if (timerRunning && time > 0) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            clearInterval(timer);
            setTimerRunning(false);
            if (inputTime) {
                alert('Time is up!');
            }
        }
        return () => clearInterval(timer);
    }, [timerRunning, time, inputTime]);

    const startTimer = () => {
        if (inputTime && !isNaN(inputTime) && inputTime > 0) {
            setTime(parseInt(inputTime) * 60); // Set time in seconds
            setTimerRunning(true);
        }
    };

    const stopTimer = () => {
        setTimerRunning(false);
    };

    const resetTimer = () => {
        setTimerRunning(false);
        setTime(0);
        setInputTime('');
    };

    const handleInputChange = (e) => {
        setInputTime(e.target.value);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="timer-page">
            <h1>Task Timer and Reminder</h1>
            <div className="timer-container">
                <input
                    type="number"
                    placeholder="Set timer (minutes)"
                    value={inputTime}
                    onChange={handleInputChange}
                    className="timer-input"
                />
                <div className="timer-display">
                    {formatTime(time)}
                </div>
                <div className="timer-buttons">
                    <button onClick={startTimer} className="start-btn" disabled={timerRunning}>
                        Start
                    </button>
                    <button onClick={stopTimer} className="stop-btn" disabled={!timerRunning}>
                        Stop
                    </button>
                    <button onClick={resetTimer} className="reset-btn">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimerPage;
