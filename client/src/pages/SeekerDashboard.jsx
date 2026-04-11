import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import SeekerOverview from './seeker/SeekerOverview';
import SeekerApplications from './seeker/SeekerApplications';
import SeekerProfile from './seeker/SeekerProfilePage';
import SeekerSettings from './seeker/SeekerSettings';
import { HiHome, HiDocumentText, HiUser, HiCog } from 'react-icons/hi';

const links = [
  { to: '/seeker/dashboard', label: 'Dashboard', icon: <HiHome />, end: true },
  { to: '/seeker/dashboard/applications', label: 'My Applications', icon: <HiDocumentText /> },
  { to: '/seeker/dashboard/profile', label: 'My Profile', icon: <HiUser /> },
  { to: '/seeker/dashboard/settings', label: 'Settings', icon: <HiCog /> },
];

const SeekerDashboard = () => {
  return (
    <DashboardLayout links={links}>
      <Routes>
        <Route index element={<SeekerOverview />} />
        <Route path="applications" element={<SeekerApplications />} />
        <Route path="profile" element={<SeekerProfile />} />
        <Route path="settings" element={<SeekerSettings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default SeekerDashboard;
