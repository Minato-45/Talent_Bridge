import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import EmployerOverview from './employer/EmployerOverview';
import EmployerJobs from './employer/EmployerJobs';
import CreateJob from './employer/CreateJob';
import EditJob from './employer/EditJob';
import Applicants from './employer/Applicants';
import EmployerProfile from './employer/EmployerProfilePage';
import EmployerSettings from './employer/EmployerSettings';
import { HiHome, HiBriefcase, HiPlusCircle, HiUser, HiCog } from 'react-icons/hi';

const links = [
  { to: '/employer/dashboard', label: 'Overview', icon: <HiHome />, end: true },
  { to: '/employer/dashboard/jobs', label: 'My Jobs', icon: <HiBriefcase /> },
  { to: '/employer/dashboard/create-job', label: 'Post a Job', icon: <HiPlusCircle /> },
  { to: '/employer/dashboard/profile', label: 'Company Profile', icon: <HiUser /> },
  { to: '/employer/dashboard/settings', label: 'Settings', icon: <HiCog /> },
];

const EmployerDashboard = () => {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route index element={<EmployerOverview />} />
        <Route path="jobs" element={<EmployerJobs />} />
        <Route path="create-job" element={<CreateJob />} />
        <Route path="edit-job/:id" element={<EditJob />} />
        <Route path="applicants/:jobId" element={<Applicants />} />
        <Route path="profile" element={<EmployerProfile />} />
        <Route path="settings" element={<EmployerSettings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
