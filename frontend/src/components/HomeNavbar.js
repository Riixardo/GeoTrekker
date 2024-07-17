import React from 'react';
import Button from './PageButton';

const Navbar = () => {
  return (
    <nav className="bg-transparent p-4">
    <ul className="list-none p-0 flex flex-col items-center font-orbitron">
      <li className="mb-4">
        <Button page={"/play"} text={"Play"}></Button>
      </li>
      <li className="mb-4">
      <Button page={"/leaderboard"} text={"Leaderboard"}></Button>
      </li>
    </ul>
    </nav>
  );
};

export default Navbar;