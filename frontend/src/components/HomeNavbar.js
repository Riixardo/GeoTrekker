import React from 'react';
import Button from './Button';

const Navbar = () => {
  return (
    <nav class="bg-transparent p-4">
    <ul class="list-none p-0 flex flex-col items-center font-orbitron">
      <li class="mb-4">
        <Button page={"/play"} text={"Play"}></Button>
      </li>
      <li class="mb-4">
      <Button page={"/leaderboard"} text={"Leaderboard"}></Button>
      </li>
    </ul>
    </nav>
  );
};

export default Navbar;