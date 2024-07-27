import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ page, text, className, onClick}) => {

    return (
        <Link to={page} className={className || "text-black no-underline hover:underline font-orbitron font-medium text-xl"} onClick={onClick}>{text}</Link>
    );
};

export default Button;