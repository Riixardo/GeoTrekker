import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StreetView from './components/StreetView';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/street-view" element={<StreetView />} />
      </Routes>
    </Router>
  );
};

export default App;