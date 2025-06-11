import { Navigate, Outlet, BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoadingComponent from './components/LoadingComponent';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import Settings from './pages/Settings';
import Artist from './pages/Artist';
import BannerPage from './pages/BannerPage';
import News from './pages/News';
import ContactUs from './pages/ContactUs';
import ShowLineUp from './pages/ShowLineUp';
import Enquiry from './pages/Enquiry';
import EnquiryPage from './pages/EnquiryPage';

const AuthenticatedLayout = () => {

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={user ? <AuthenticatedLayout /> : <Navigate to="/" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/show-lineup" element={<ShowLineUp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/banner" element={<BannerPage />} />
        <Route path="/enquiry" element={<EnquiryPage />} />
        <Route path='/news' element={<News />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Route>
    </Routes>
  );

}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/summerfest/admintogo">
        <AppRoutes />
        <ToastContainer position='top-right' autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
