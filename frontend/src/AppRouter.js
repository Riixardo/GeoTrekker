import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Leaderboard from './components/pages/Leaderboard';
import Play from './components/pages/Play';
import StreetView from './components/StreetView';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Profile from './components/pages/Profile';
import Directions from './components/pages/Directions';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/play" element={<Play />} />
        <Route path="/leaderboard" element={ <Leaderboard />} />
        <Route path="/play/directions" element={<Directions />} />
        <Route path="/street-view" element={<StreetView />} />
      </Routes>
    </Router>
  );
};

export default App;