import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Alerts from './pages/Alerts';
import About from './pages/About';
import Prediction from './pages/Prediction';
import WheelHealth from './pages/WheelHealth';
import AxleInfo from './pages/axle';

import Compartment1 from './pages/compartment1';
import Compartment2 from './pages/compartment2';
import Compartment3 from './pages/compartment3';
import Compartment4 from './pages/compartment4';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/about" element={<About />} />
      <Route path="/prediction" element={<Prediction />} />
      <Route path="/wheelhealth" element={<WheelHealth />} />
      <Route path="/axle" element={<AxleInfo />} />
      <Route path="/comp1" element={<Compartment1 />} />
      <Route path="/comp2" element={<Compartment2 />} />
      <Route path="/comp3" element={<Compartment3 />} />
      <Route path="/comp4" element={<Compartment4 />} />
    </Routes>
  );
}
