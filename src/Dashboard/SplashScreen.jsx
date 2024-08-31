import React, { useEffect, useState } from 'react';
import './SplashScreen.css'; // We'll create this CSS file for styles
import  SignalForge from './SignalForge.png';

const SplashScreen = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide splash screen after 1 second
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) {
                const timer = setTimeout(() => {
                    onFinish();
                }, 500);
            }
        }, 1000); // 1 second

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={`splash-screen`}>
            <img src={SignalForge} alt="Logo" className={`splash-logo ${isVisible ? '' : 'fly-off'}`} />
        </div>
    );
};

export default SplashScreen;
