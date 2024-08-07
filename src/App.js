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
        <Route path='/reviews' element={<Reviews />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<ContactUs />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
