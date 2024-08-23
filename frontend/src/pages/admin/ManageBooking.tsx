import axios from 'axios'
import React, { useEffect, useState } from 'react'

const TourCard = ({ booking, confirmBooking }) => {
    const { bookingType, location, title, date, status, person, days, price, id } = booking;

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-800">{title} {bookingType}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                    <i className={`fas ${status === 'pending' ? 'fa-hourglass-half' : 'fa-check-circle'} mr-1`}></i>
                    <span>{status}</span>
                </span>
            </div>

            <div className="mt-3 space-y-2">
                <p className="text-md text-gray-600 flex items-center">
                    <i className="fas fa-map-marker-alt text-green-800 mr-2"></i>
                    {location}
                </p>
                <p className="text-md text-gray-600 flex items-center">
                    <i className="fas fa-calendar-alt text-green-800 mr-2"></i>
                    {date}
                </p>
                <p className="text-md text-gray-600 flex items-center">
                    <i className="fas fa-clock text-green-800 mr-2"></i>
                    {days} Days
                </p>
                <p className="text-md text-gray-600 flex items-center">
                    <i className="fas fa-users text-green-800 mr-2"></i>
                    {person} Person{person > 1 ? 's' : ''}
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

const PackageCard = ({ booking, confirmBooking }) => {
    const { bookingType, location, title, date, status, days, price, type, id } = booking;

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-800">{title} {bookingType}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                    <i className={`fas ${status === 'pending' ? 'fa-hourglass-half' : 'fa-check-circle'} mr-1`}></i>
                    <span>{status}</span>
                </span>
            </div>

            <div className="mt-3">
                <p className="text-md text-gray-600">
                    <i className="fas fa-map-marker-alt text-green-800 mr-1"></i> {location}
                </p>
                <p className="text-md text-gray-600">
                    <i className="fas fa-calendar-alt text-green-800 mr-1"></i> {date}
                </p>
                <p className="text-md text-gray-600">
                    <i className="fas fa-clock text-green-800 mr-1"></i> {days} Days
                </p>
                <p className="text-md text-gray-600">
                    <i className="fas fa-users text-green-800 mr-1"></i> {type} Package
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
    )
}

const TransportCard = ({ booking, confirmBooking }) => {
    const { id, bookingType, journeyTicket, status, tripType, user, returnTicket } = booking;
    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-800">
                    {tripType} {bookingType}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                    <i className={`fas ${status === 'pending' ? 'fa-hourglass-half' : 'fa-check-circle'} mr-1`}></i>
                    <span>{status}</span>
                </span>
            </div>

            <div className={`${returnTicket ? 'flex' : ''} justify-between items-start mb-6`}>
                <div className="w-full pr-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                        <i className="fas fa-route mr-2"></i> Journey
                    </h3>
                    <p className="text-md text-gray-500">
                        <i className="fas fa-map-marker-alt text-green-800 mr-1"></i> {journeyTicket.from} <i className="fas fa-arrow-right mx-1"></i> {journeyTicket.to}
                    </p>
                    <p className="text-md text-gray-500">
                        <i className="fas fa-calendar-alt text-green-800 mr-1"></i>
                        {journeyTicket.journeyDate}
                    </p>
                    <p className="text-md text-gray-500"><i className="fas fa-clock text-green-800 mr-1"></i> {journeyTicket.departureTime} - {journeyTicket.arrivalTime}</p>
                    <p className="text-md text-green-800">
                        <i className="fas fa-bus mr-1"></i> {journeyTicket.provider}
                    </p>
                    <p className="text-lg font-bold text-green-800 mt-2">
                        <i className="fas fa-dollar-sign mr-1"></i> {journeyTicket.price} USD
                    </p>
                </div>
                {returnTicket && (
                    <div className="w-full pl-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            <i className="fas fa-route mr-2"></i> Return
                        </h3>
                        <p className="text-md text-gray-500">
                            <i className="fas fa-map-marker-alt text-green-800 mr-1"></i>
                            {returnTicket.from} <i className="fas fa-arrow-right mx-1"></i> {returnTicket.to}
                        </p>
                        <p className="text-md text-gray-500">
                            <i className="fas fa-calendar-alt text-green-800 mr-1"></i>
                            {returnTicket.journeyDate}
                        </p>
                        <p className="text-md text-gray-500">
                            <i className="fas fa-clock text-green-800 mr-1"></i>
                            {returnTicket.departureTime} - {returnTicket.arrivalTime}
                        </p>
                        <p className="text-md text-green-800">
                            <i className="fas fa-train mr-1"></i> {returnTicket.provider}
                        </p>
                        <p className="text-lg font-bold text-green-800 mt-2">
                            <i className="fas fa-dollar-sign mr-1"></i> {returnTicket.price} USD
                        </p>
                    </div>
                )}
            </div>
            {
                status === 'pending' && (<div className="border-t border-gray-200 pt-4">
                    <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300" onClick={() => confirmBooking(id)}>
                        <i className={`fas ${status === 'pending' ? 'fa-hourglass-half' : 'fa-check-circle'} mr-1`}></i> Confirm Booking
                    </button>
                </div>)
            }
        </div>

    )
}

function ManageBooking() {
    const [allBookings, setAllBookings] = useState([])

    const getAllBookings = () => {
        // Fetch all bookings from the backend API
        axios.get('/get_all_bookings').then(response => {
            setAllBookings(response.data)
        }).catch(er => console.log(er.message))
    }

    useEffect(() => {
        getAllBookings();
    }, [])

    const confirmBooking = (bookingId) => {
        axios.post(`/confirm_booking`, { bookingId }).then(response => {
            if (response.data.status === 200) {
                alert(response.data.message)
                getAllBookings();
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
                    switch (booking.bookingType) {
                        case "tour":
                            return <TourCard booking={booking} key={index} confirmBooking={confirmBooking} />
                        case "package":
                            return <PackageCard booking={booking} key={index} confirmBooking={confirmBooking} />
                        case "transport":
                            return <TransportCard booking={booking} key={index} confirmBooking={confirmBooking} />

                        default:
                            break;
                    }
                })}
            </div>
        </div>
    )
}

export default ManageBooking