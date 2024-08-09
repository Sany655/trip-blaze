import Home from './pages/Home.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Tours from './pages/Tours.tsx';
import Packages from './pages/Packages.tsx';
import Transportation from './pages/Transportation.tsx';
import Hotels from './pages/Hotels.tsx';
import Message from './pages/Message.tsx';
import Blog from './pages/Blog.tsx';
import Reviews from './pages/Reviews.tsx';
import ContactUs from './pages/ContactUs.tsx';
import About from './pages/About.tsx';
import Booking from './pages/Booking.tsx';
import Post from './pages/Post.tsx';
import Signup from './pages/Signup.tsx';
import Signin from './pages/Signin.tsx';
import MyBookings from './pages/MyBookings.tsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/tours' element={<Tours />}/>
        <Route path='/packages' element={<Packages />}/>
        <Route path='/transportation' element={<Transportation />}/>
        <Route path='/hotels' element={<Hotels />}/>
        <Route path='/message' element={<Message />}/>
        <Route path='/blog' element={<Blog />}/>
        <Route path='/blog/:title' element={<Post />}/>
        <Route path='/reviews' element={<Reviews />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<ContactUs />}/>
        <Route path='/booking/:type/:title' element={<Booking />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/signin' element={<Signin />}/>
        <Route path='/my-bookings' element={<MyBookings />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
