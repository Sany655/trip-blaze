import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import Loading from '../components/UI/Loading.tsx';
import useAuth from '../hooks/useAuth.js';
import Modal from '../components/UI/Modal.tsx';

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
  const { title, price, days, location, src } = tour;
  tour.bookingType = "tour"
  const { handleBooking } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const bookingFormRef = useRef();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 flex flex-col justify-between" key={index}>
      <img src={process.env.REACT_APP_server_path + src} alt={title} className="w-full rounded-lg mb-4" />
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {/* <p className="text-gray-700 mb-4">{description}</p> */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500">{days} DAY &nbsp;</span>
          <span className="text-gray-500">{price} USD</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-500 font-bold">{location}</span>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModalOpen(true)}>Book now</button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title={`Booking ${tour.bookingType}`}
        >
          <form onSubmit={e => {
            e.preventDefault();
            const formdata = {}
            formdata.date = bookingFormRef?.current.date.value;
            formdata.person = bookingFormRef?.current.person.value;
            formdata.bookingType = tour.bookingType;
            formdata.days = days;
            formdata.location = location;
            formdata.price = price * bookingFormRef?.current.person.value;
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
            <input required type="number" name="person" id="person" placeholder={`person per/${price}`} className='border border-1 p-2 me-2' />
            <button className="bg-green-500 px-4 py-2 text-white">Book</button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Tours