import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard Routes wrapped in a layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="freelancer" element={<FreelancerDashboard />} />
          <Route path="client" element={<ClientDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
