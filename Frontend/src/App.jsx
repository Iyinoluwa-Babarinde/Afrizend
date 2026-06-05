import { Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useAuthStore } from './lib/store';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AutoDemo from './components/AutoDemo';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Employer Pages
import EmployerOverview from './pages/dashboard/employer/Overview';
import EmployerJobs from './pages/dashboard/employer/Jobs';
import EmployerNewJob from './pages/dashboard/employer/NewJob';
import EmployerContracts from './pages/dashboard/employer/Contracts';
import EmployerContractDetails from './pages/dashboard/employer/ContractDetails';
import EmployerMatches from './pages/dashboard/employer/Matches';
import EmployerNetwork from './pages/dashboard/employer/Network';
import EmployerSessions from './pages/dashboard/employer/Sessions';
import EmployerSettings from './pages/dashboard/employer/Settings';

// Freelancer Pages
import FreelancerOverview from './pages/dashboard/freelancer/Overview';
import FreelancerContracts from './pages/dashboard/freelancer/Contracts';
import FreelancerSubmitMilestone from './pages/dashboard/freelancer/SubmitMilestone';
import FreelancerOpportunities from './pages/dashboard/freelancer/Opportunities';
import FreelancerSessions from './pages/dashboard/freelancer/Sessions';

// Shared Dashboard Pages
import Wallet from './pages/dashboard/Wallet';
import Room from './pages/dashboard/sessions/Room';

function App() {
    const navigate = useNavigate();
    const fetchMe = useAuthStore(s => s.fetchMe);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    // Expose navigate globally for the AutoDemo script
    if (typeof window !== 'undefined') {
      window.routerNavigate = navigate;
    }

    return (<>
      <AutoDemo />
      <Helmet>
        <title>Afrizend.</title>
        <meta name="description" content="AI-powered global talent marketplace with Kora virtual accounts and escrow. Work first, get paid automatically. No invoices. No ghosting."/>
      </Helmet>

      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/auth/login" element={<Login />}/>
          <Route path="/auth/register" element={<Register />}/>
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/employer" element={<EmployerOverview />}/>
            <Route path="/dashboard/employer/jobs" element={<EmployerJobs />}/>
            <Route path="/dashboard/employer/jobs/new" element={<EmployerNewJob />}/>
            <Route path="/dashboard/employer/contracts" element={<EmployerContracts />}/>
            <Route path="/dashboard/employer/jobs/:id/contract" element={<EmployerContractDetails />}/>
            <Route path="/dashboard/employer/jobs/:id/matches" element={<EmployerMatches />}/>
            <Route path="/dashboard/employer/network" element={<EmployerNetwork />}/>
            <Route path="/dashboard/employer/sessions" element={<EmployerSessions />}/>
            <Route path="/dashboard/employer/settings" element={<EmployerSettings />}/>

            <Route path="/dashboard/freelancer" element={<FreelancerOverview />}/>
            <Route path="/dashboard/freelancer/contracts" element={<FreelancerContracts />}/>
            <Route path="/dashboard/freelancer/contracts/:id/submit/:milestoneId" element={<FreelancerSubmitMilestone />}/>
            <Route path="/dashboard/freelancer/opportunities" element={<FreelancerOpportunities />}/>
            <Route path="/dashboard/freelancer/sessions" element={<FreelancerSessions />}/>

            <Route path="/dashboard/wallet" element={<Wallet />}/>
            <Route path="/dashboard/sessions/room/:id" element={<Room />}/>
          </Route>
        </Route>
      </Routes>
    </>);
}

export default App;
