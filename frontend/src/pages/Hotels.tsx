import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Loading from '../components/UI/Loading.tsx';
import useAuth from '../hooks/useAuth.js';
import Modal from '../components/UI/Modal.tsx';
import { Link, useNavigate } from 'react-router-dom';

function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const getHotels = async () => {
    await axios.get('/get_hotels').then(response => {
      setHotels(response.data);
    }).catch(error => console.error(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true)
    getHotels();
  }, [])
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Hotels</h1>
      <hr className='bg-green-500' />
      {loading && <Loading />}
      {!hotels.length && <p className="text-center text-gray-600 m-98">No hotels found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotels.length > 0 && hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  )
}


const HotelCard = ({ hotel }) => {
  const { title, location, src, id } = hotel;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 flex flex-col justify-between">
      <img src={process.env.REACT_APP_server_path + src} alt={title} className="w-full rounded-lg mb-4" />
      <div>
        <h2 className="text-2xl font-bold mb-4 cursor-pointer hover:text-blue-400">
          <Link to={`/hotel/${id}`}>{title}</Link>
        </h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-500 font-bold">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default Hotels