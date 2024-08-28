import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../components/UI/Loading.tsx'
import useAuth from '../hooks/useAuth.js'
import Modal from '../components/UI/Modal.tsx'
import { useNavigate } from 'react-router-dom'

function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const getPackages = async () => {
    axios.get('/get_packages').then(response => {
      setPackages(response.data);
    }).catch(error => console.error(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    getPackages();
  }, [])
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Packages</h1>
      <hr className='bg-green-500' />
      {loading && <Loading />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
        {packages.map((packageTour, index) => (
          <PackageCard key={index} pakage={packageTour} />
        ))}
      </div>
    </div>
  )
}

const PackageCard = ({ pakage }) => {
  const { title, price, days, location, src, type } = pakage;

  const navigate = useNavigate();

  function gotoPage() {
    navigate('/package', { state: pakage });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 flex flex-col justify-between">
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
      {/* <div className="bg-white rounded-lg shadow-md p-6 m-4 flex flex-col justify-between">
      <img src={process.env.REACT_APP_server_path + src} alt={title} className="w-full rounded-lg mb-4" />
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-4"><span className='text-green-600'>{type}</span> Package</p>
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
          title={`Booking ${pakage.bookingType}`}
        >
          <form onSubmit={e => {
            e.preventDefault();
            const formdata = {}
            formdata.date = bookingFormRef?.current.date.value;
            formdata.bookingType = pakage.bookingType;
            formdata.days = days;
            formdata.location = location;
            formdata.price = price;
            formdata.title = title;
            formdata.type = type;
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
            <button className="bg-green-500 px-4 py-2 text-white">Book</button>
          </form>
        </Modal>
      </div>
    </div> */}
    </div>
  );
};

export default Packages