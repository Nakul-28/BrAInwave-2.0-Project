import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import ScenarioSetup from './pages/ScenarioSetup';
import LiveSimulationView from './pages/LiveSimulationView';
import Results from './pages/Results';
import Report from './pages/Report';
import { SmokeTest } from './components/SmokeTest';
import './styles/global.css';
import './styles/maplibre.css';

/**
 * Main Application Component
 * 
 * Establishes routing structure for the disaster response simulation platform.
 * 
 * Route hierarchy:
 * /         → Landing page (entry point)
 * /setup    → Scenario configuration
 * /simulate → Live simulation dashboard
 * /results  → Post-simulation analysis
 * /report   → Exportable decision report
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<ScenarioSetup />} />
        <Route path="/simulate" element={<LiveSimulationView />} />
        <Route path="/results" element={<Results />} />
        <Route path="/report" element={<Report />} />
        <Route path="/smoke-test" element={<SmokeTest />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
