import Home from './pages/Home.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Tours from './pages/Tours.tsx';
import Packages from './pages/Packages.tsx';
import Transportation from './pages/Transportation.tsx';
import Hotels from './pages/Hotels.tsx';
import Message from './pages/Message.tsx';
import Blog from './pages/Blog.tsx';
import Reviews from './pages/Reviews.tsx';
import ContactUs from './pages/ContactUs.tsx';
import About from './pages/About.tsx';
import Post from './pages/Post.tsx';
import Signup from './pages/Signup.tsx';
import Signin from './pages/Signin.tsx';
import MyBookings from './pages/MyBookings.tsx';
import axios from 'axios';
import useAuth from './hooks/useAuth.js';
import ManageTour from './pages/admin/ManageTour.tsx';
import ManageHotel from './pages/hotel-manager/ManageHotel.tsx';
import ManageTransport from './pages/transport-manager/ManageTransport.tsx';
import ManageBlog from './pages/admin/ManageBlog.tsx';
import ManagePackage from './pages/admin/ManagePackage.tsx';
import ManageBooking from './pages/admin/ManageBooking.tsx';
import ChatBox from './pages/ChatBox.tsx';
import ManageMessages from './pages/hotel-manager/ManageMessages.tsx';
import ManageChatbox from './pages/hotel-manager/ManageChatbox.tsx';
import { useEffect } from 'react';
import Tour from './pages/Tour.tsx';
import Hotel from './pages/Hotel.tsx';
import ManagerBooking from './pages/hotel-manager/ManagerBooking.tsx';
import Package from './pages/Package.tsx';
import TransportBooking from './pages/transport-manager/TransportBooking.tsx';

function App() {
  axios.defaults.baseURL = process.env.REACT_APP_server_path + 'api/';
  const { user, socket } = useAuth();

  useEffect(() => {
    if(user) socket.emit('register', user?.id);
  }, [user,socket])

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/tours' element={<Tours />} />
        <Route path='/tour' element={<Tour />} />
        <Route path='/packages' element={<Packages />} />
        <Route path='/package' element={<Package />} />
        <Route path='/transports' element={<Transportation />} />
        <Route path='/hotels' element={<Hotels />} />
        <Route path='/hotel/:id' element={<Hotel />} />
        <Route path='/blogs' element={<Blog />} />
        <Route path='/blog/:title' element={<Post />} />
        <Route path='/reviews' element={<Reviews />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/' element={(!user && user?.role !== 'user') ? <Navigate to="/" replace /> : <Outlet />}>
          <Route path='/messages/:hotelId' element={<ChatBox />} />
          <Route path='/messages' element={<Message />} />
          <Route path='/my-bookings' element={<MyBookings />} />
        </Route>
        <Route path='/' element={user ? <Navigate to="/" replace /> : <Outlet />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path='admin' element={(!user && user?.role !== 'admin') ? <Navigate to="/" replace /> : <Outlet />}>
          <Route path='tours' element={<ManageTour />} />
          <Route path='blogs' element={<ManageBlog />} />
          <Route path='packages' element={<ManagePackage />} />
          <Route path='bookings' element={<ManageBooking />} />
        </Route>
        <Route path='hotel-manager' element={(!user && user?.role !== 'hotel-manager') ? <Navigate to="/" replace /> : <Outlet />}>
          <Route path='hotel' element={<ManageHotel />} />
          <Route path='bookings' element={<ManagerBooking />} />
          <Route path='messages' element={<ManageMessages />} />
          <Route path='messages/:userId' element={<ManageChatbox />} />
        </Route>
        <Route path='transport-manager' element={(!user && user?.role !== 'transport-manager') ? <Navigate to="/" replace /> : <Outlet />}>
          <Route path='transports' element={<ManageTransport />} />
          <Route path='bookings' element={<TransportBooking />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
