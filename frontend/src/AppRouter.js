import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Play from './components/Play';
import StreetView from './components/StreetView';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';

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
        <Route path="/street-view" element={<StreetView />} />
      </Routes>
    </Router>
  );
};

export default App;