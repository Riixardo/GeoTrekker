import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ page, text }) => {

    return (
        <Link to={page} class="text-black no-underline hover:underline font-orbitron">{text}</Link>
    );
};

export default Button;