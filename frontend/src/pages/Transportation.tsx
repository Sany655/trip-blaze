import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import Loading from '../components/UI/Loading.tsx';
import useAuth from '../hooks/useAuth.js';
import Modal from '../components/UI/Modal.tsx';

function Transportation() {
  const [transports, setTransport] = useState([])
  const [searchTransport, setSearchTransport] = useState([])
  const [loading, setLoading] = useState(false)
  const [tripTypeConditional, setTripType] = useState()
  const searchForm = useRef();
  const [submitted, setSubmitted] = useState(false)


  const searchSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const formdata = new FormData(searchForm.current);
    const { tripType, from, to, returnDate, journeyDate, checkProvider } = Array.from(formdata.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    if (new Date() < new Date(journeyDate) && (tripType === 'roundway' ? new Date(journeyDate) < new Date(returnDate) : true)) {
      setSearchTransport(
        transports.reduce((result, transport) => {
          const fromMatches = transport.from.toLowerCase() === from.toLowerCase();
          const toMatches = transport.to.toLowerCase() === to.toLowerCase();
          transport.journeyDate = journeyDate;
          if (tripType === 'oneway') {
            if (fromMatches && toMatches) {
              result.push({
                journeyTicket: transport,
                tripType: 'oneway'
              });
            }
          }
          if (tripType === 'roundway') {
            const matchedReturn = transports.find(returnTrip => {
              const reverseMatches = returnTrip.from.toLowerCase() === to.toLowerCase() && returnTrip.to.toLowerCase() === from.toLowerCase();
              const providerMatches = returnTrip.provider === transport.provider;
              return reverseMatches
              // && providerMatches;
            });
            if (fromMatches && toMatches && matchedReturn) {
              matchedReturn.returnDate = returnDate;
              result.push({
                journeyTicket: transport,
                returnTicket: matchedReturn,
                tripType: 'roundway'
              });
            }
          }
          return result;
        }, [])
      );
    } else alert('Date is invalid');
  }

  const getTransports = async () => {
    await axios.get('/get_transports').then(response => {
      setTransport(response.data);
    }).catch(error => console.error(error)).finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true)
    getTransports();
  }, [])

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Transportation</h1>
      <hr className='bg-green-500' />
      <form className="bg-white p-4 rounded-md shadow-md max-w-xl mx-auto my-8 flex flex-col gap-2" ref={searchForm} onSubmit={searchSubmit}>
        <select name='tripType' onChange={(e) => setTripType(e.target.value)} className="border border-1 p-2" required>
          <option value="">Select ticket type</option>
          <option value="oneway">One Way</option>
          <option value="roundway">Round Way</option>
        </select>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
          <input name='from' type="text" placeholder='From' className="border border-1 p-2" required />
          <div className="flex items-center hidden md:block">
            <span className="text-2xl mx-2">⇄</span>
          </div>
          <input name='to' type="text" placeholder='To' className="border border-1 p-2" required />
        </div>
        <label htmlFor="">Journey Date</label>
        <input name='journeyDate' type="date" className="border border-1 p-2" required />
        {
          tripTypeConditional === 'roundway' && (
            <>
              <label htmlFor="">Return Date</label>
              <input name='returnDate' type="date" className="border border-1 p-2" required />
            </>
          )
        }
        <button className="bg-yellow-400 text-white font-bold py-2 px-4 rounded-md mt-4 md:mt-0">Search</button>
      </form>
      {
        loading ? <Loading /> : (searchTransport.length > 0) ? searchTransport.map((transport, i) => <Transport transport={transport} searchForm={searchForm} key={i} />) : submitted ? <p className="text-center text-lg font-bold text-green-800">No transports found for the given criteria.</p> : null
      }
    </div>
  );
}

const Transport = ({ transport, searchForm }) => {
  transport.bookingType = "transport"
  const { handleBooking } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(false)
  const [info, setInfo] = useState('')

  return (
    <div className="max-w-xl mx-auto bg-white border rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center justify-evenly md:justify-between mb-4">
      <div>
        <div className="md:flex md:items-center">
          <div className='flex flex-row items-center justify-between gap-2'>
            <h3 className="text-lg font-bold text-green-800">{transport.journeyTicket.provider}</h3>
            <p className="text-sm text-green-500">{transport.journeyTicket.vehicleNumber}</p>
            <p className="text-sm text-green-500">capacity: {transport.journeyTicket.capacity}</p>
          </div>
        </div>

        <div className="flex items-center justify-between my-2 md:my-0">
          <div className="text-center">
            <p className="text-sm text-green-500">{transport.journeyTicket.from}</p>
            <p className="text-lg font-semibold text-green-800">{transport.journeyTicket.departureTime}</p>
          </div>

          <div className="flex items-center">
            <span className="text-green-500 mx-2">→</span>
            <div className="text-center">
              <p className="text-sm text-green-500">{transport.journeyTicket.to}</p>
              <p className="text-lg font-semibold text-green-800">{transport.journeyTicket.arrivalTime}</p>
            </div>
          </div>
        </div>
      </div>

      {
        transport.returnTicket && (
          <div>
            <div className="md:flex md:items-center">
              <div className='flex flex-row md:flex-col items-center md:items-stretch justify-between'>
                <h3 className="text-lg font-bold text-green-800">{transport.returnTicket.provider}</h3>
                <p className="text-sm text-green-500">{transport.returnTicket.vehicleNumber}</p>
                <p className="text-sm text-green-500">capacity: {transport.returnTicket.capacity}</p>
              </div>
            </div>

            <div className="flex items-center justify-between my-2 md:my-0">
              <div className="text-center">
                <p className="text-sm text-green-500">{transport.returnTicket.from}</p>
                <p className="text-lg font-semibold text-green-800">{transport.returnTicket.departureTime}</p>
              </div>

              <div className="flex items-center">
                <span className="text-green-500 mx-2">→</span>
                <div className="text-center">
                  <p className="text-sm text-green-500">{transport.returnTicket.to}</p>
                  <p className="text-lg font-semibold text-green-800">{transport.returnTicket.arrivalTime}</p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <div className="text-right flex md:flex-col flex-row justify-between items-center">
        <p className="text-lg font-bold text-yellow-600">{transport.returnTicket ? parseInt(transport.returnTicket.price) + parseInt(transport.journeyTicket.price) : transport.journeyTicket.price} USD</p>
        <button className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600" onClick={() => setModalOpen(true)}>
          Book
        </button>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={'Confirm Transport Booking'}>
        <form className="flex flex-col gap-2" onSubmit={(e) => {
          e.preventDefault();
          transport.person = e.target.person.value;
          transport.journeyTicket.price = transport.journeyTicket.price * e.target.person.value;
          if (transport.returnTicket) transport.returnTicket.price = transport.returnTicket.price * e.target.person.value;
          handleBooking(transport).then(() => {
            searchForm.current.reset();
            setModalOpen(false);
          })
        }}>
          <input type="number" className="p-3 border" placeholder='People Count' name='person' defaultValue={1} min={1} max={5} />
          <button type='submit' className='bg-green-500 text-white p-2'>Confirm</button>
        </form>
      </Modal>
    </div>
  )
}

export default Transportation