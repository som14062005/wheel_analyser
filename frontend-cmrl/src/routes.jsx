import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Compartment1 from './pages/compartments/Compartment1';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/compartment1" element={<Compartment1 />} />
    </Routes>
  );
}
