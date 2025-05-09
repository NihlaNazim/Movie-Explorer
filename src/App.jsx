import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Favorites from './pages/Favorites.jsx';

const App = () => {
  return (
    <MovieProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </MovieProvider>
  );
};

export default App;
