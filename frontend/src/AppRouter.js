import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Leaderboard from './components/pages/Leaderboard';
import Play from './components/pages/Play';
import DirectionsGame from './components/pages/DirectionsGame';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Profile from './components/pages/Profile';
import Directions from './components/pages/Directions';
import DirectionsGameEnd from './components/pages/DirectionsGameEnd';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/games" element={<Play />} />
        <Route path="/leaderboard" element={ <Leaderboard />} />
        <Route path="/games/directions" element={<Directions />} />
        <Route path="/play/directions" element={<DirectionsGame />} />
        <Route path="/play/directions/endscreen" element={<DirectionsGameEnd />} />
      </Routes>
    </Router>
  );
};

export default App;