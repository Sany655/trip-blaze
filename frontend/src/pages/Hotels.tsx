import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Loading from '../components/UI/Loading.tsx';
import useAuth from '../hooks/useAuth.js';
import Modal from '../components/UI/Modal.tsx';
import { useNavigate } from 'react-router-dom';

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
  const { title, price, days, location, src } = hotel;
  const { handleBooking } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const bookingFormRef = React.useRef(null);
  hotel.bookingType = "hotel"
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 flex flex-col justify-between">
      <img src={process.env.REACT_APP_server_path + src} alt={title} className="w-full rounded-lg mb-4" />
      <div>
        <h2 className="text-2xl font-bold mb-4 cursor-pointer hover:text-blue-400" onClick={() => navigate('/hotel', { state: hotel })}>{title}</h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-500 font-bold">{location}</span>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title={`Booking ${hotel.bookingType}`}
        >
          <form onSubmit={e => {
            e.preventDefault();
            const formdata = {}
            formdata.date = bookingFormRef?.current.date.value;
            formdata.room = bookingFormRef?.current.room.value;
            formdata.bookingType = hotel.bookingType;
            formdata.days = days;
            formdata.location = location;
            formdata.price = price * bookingFormRef?.current.room.value;
            formdata.title = title;
            if (new Date(formdata.date) < new Date()) {
              alert('Invalid date');
            } else {
              handleBooking(formdata).then(() => setModalOpen(false));
            }
          }}
            className='flex flex-col space-y-2'
            ref={bookingFormRef}
          >
            <input required type="date" name="date" id="date" className='border border-1 p-2 me-2' />
            <input required type="number" name="room" id="room" placeholder={`per room ${price}USD`} className='border border-1 p-2 me-2' />
            <button className="bg-green-500 px-4 py-2 text-white">Book</button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Hotels