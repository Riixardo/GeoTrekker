import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/street-view">StreetView</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;