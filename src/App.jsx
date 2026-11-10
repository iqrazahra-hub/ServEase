import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Protected from './components/Protected';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workers from './pages/Workers';
import WorkerDetail from './pages/WorkerDetail';
import NewRequest from './pages/NewRequest';
import MyRequests from './pages/MyRequests';
import RequestQuotes from './pages/RequestQuotes';
import Bookings from './pages/Bookings';
import WorkerProfile from './pages/WorkerProfile';
import WorkerJobs from './pages/WorkerJobs';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/workers/:id" element={<WorkerDetail />} />

        {/* Customer only */}
        <Route path="/requests" element={<Protected roles={['customer']}><MyRequests /></Protected>} />
        <Route path="/requests/new" element={<Protected roles={['customer']}><NewRequest /></Protected>} />
        <Route path="/requests/:id" element={<Protected roles={['customer']}><RequestQuotes /></Protected>} />

        {/* Worker only */}
        <Route path="/jobs" element={<Protected roles={['worker']}><WorkerJobs /></Protected>} />
        <Route path="/my-profile" element={<Protected roles={['worker']}><WorkerProfile /></Protected>} />

        {/* Customer and worker */}
        <Route path="/bookings" element={<Protected roles={['customer', 'worker']}><Bookings /></Protected>} />

        {/* Admin only */}
        <Route path="/admin" element={<Protected roles={['admin']}><Admin /></Protected>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
