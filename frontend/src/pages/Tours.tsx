import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Loading from '../components/UI/Loading.tsx';
import { useNavigate } from 'react-router-dom';

function Tours() {
  const [loading, setLoading] = useState(false)
  const [tours, setTours] = useState([])
  const getPlaces = async () => {
    await axios.get('/get_places').then(response => {
      setTours(response.data);
    }).catch(error => console.error(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true)
    getPlaces();
  }, [])

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Tours</h1>
      <hr className='bg-green-500' />
      {loading && <Loading />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tours.length > 0 ? tours.map((tour, index) => (
          <TourCard key={index} tour={tour} />
        )) : <div className='h-screen'><p>No tours found.</p></div>}
      </div>
    </div>
  )
}

const TourCard = ({ tour }, index?) => {
  const { title, price, days, location, src, description } = tour;
  const navigate = useNavigate();

  function gotoPage() {
    navigate('/tour', { state: tour });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 flex flex-col justify-between" key={index}>
      <img src={process.env.REACT_APP_server_path + src} alt={title} className="w-full h-48 rounded-lg mb-4" />
      <div>
        <h2 className="text-2xl font-bold mb-4 cursor-pointer hover:text-blue-400" onClick={gotoPage}>{title}</h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500">{days} DAY &nbsp;</span>
          <span className="text-gray-500">{price} USD</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-500 font-bold">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default Tours