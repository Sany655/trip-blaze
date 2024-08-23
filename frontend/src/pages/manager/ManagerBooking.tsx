import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth';

const HotelCard = ({ booking, confirmBooking }) => {
    const { bookingType, hotelId, roomId, date, price, title, size, id, status } = booking;

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-800">{title} Room</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                    <i className={`fas ${status === 'pending' ? 'fa-hourglass-half' : 'fa-check-circle'} mr-1`}></i>
                    <span>{status}</span>
                </span>
            </div>

            <div className="mt-3">
                <p className="text-md text-gray-600">
                    <i className="fas fa-calendar-alt text-green-800 mr-1"></i> {date}
                </p>
                <p className="text-md text-gray-600">
                    <i className="fas fa-bed text-green-800 mr-1"></i> {size}
                </p>

                <p className="text-lg font-bold text-green-800 mt-2">
                    <i className="fas fa-dollar-sign mr-1"></i> {price} USD
                </p>
            </div>

            {
                status === 'pending' && (<div className="border-t border-gray-200 pt-4">
                    <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300" onClick={() => confirmBooking(id)}>
                        <i className={`fas ${status === 'pending' ? 'fa-hourglass-half' : 'fa-check-circle'} mr-1`}></i> Confirm Booking
                    </button>
                </div>)
            }
        </div>
    );
};

function ManagerBooking() {
    const [allBookings, setAllBookings] = useState([])
    const { user } = useAuth();

    const getHotelBookings = () => {
        // Fetch all bookings from the backend API
        axios.get('/get_hotel_bookings?hotelId=' + user.id).then(response => {
            setAllBookings(response.data)
        }).catch(er => console.log(er.message))
    }

    useEffect(() => {
        getHotelBookings();
    }, [])

    const confirmBooking = (bookingId) => {
        axios.post(`/confirm_booking`, { bookingId }).then(response => {
            if (response.data.status === 200) {
                alert(response.data.message)
                getHotelBookings();
            } else {
                alert(response.data.message)
            }
        }).catch(er => console.log(er.message))
    }

    return (
        // show all bookings in cards
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold my-8">Manage Bookings</h1>
            <div className=' grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                {allBookings.map((booking, index) => {
                    return <HotelCard booking={booking} key={index} confirmBooking={confirmBooking} />
                })}
            </div>
        </div>
    )
}

export default ManagerBooking