import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Loading from '../components/UI/Loading.tsx';
import Modal from '../components/UI/Modal.tsx';

function MyBookings() {
    const [bookings, setBookings] = useState([])
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)

    const fetchBookings = async () => {
        const response = await axios.get('/get_bookings?username=' + user.username)
        setBookings(response.data)
    }

    useEffect(() => {
        fetchBookings().finally(() => setLoading(false))
    }, [])

    const cancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking? its irreversible')) {
            axios.delete('cancel_booking?id=' + bookingId).then(response => {
                fetchBookings();
                alert(response.data.message);
            })
        }
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center my-12 text-green-500">My Bookings</h1>
            <hr className='bg-green-500 mb-8' />
            {
                !loading ? (bookings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {
                            bookings.map((booking, index) => {
                                switch (booking.bookingType) {
                                    case "tour":
                                        return <TourCard booking={booking} key={index} fetchBookings={fetchBookings} />
                                    case "hotel":
                                        return <HotelCard booking={booking} key={index} fetchBookings={fetchBookings} />
                                    case "package":
                                        return <PackageCard booking={booking} key={index} fetchBookings={fetchBookings} />
                                    case "transport":
                                        return <TransportCard booking={booking} key={index} cancelBooking={cancelBooking} />

                                    default:
                                        break;
                                }
                            })
                        }
                    </div>
                ) : (
                    <div className="w-full bg-white p-8 rounded-lg shadow-md flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-semibold text-green-800 mb-4">No bookings yet</h2>
                        <p className="text-green-600 text-center mb-6">
                            Start your travel planning for your next adventure today
                        </p>
                    </div>
                )) : <Loading />
            }
        </div >
    );
}


const TourCard = ({ booking, fetchBookings }) => {
    const { reviewed, bookingType, location, title, date, status, person, days, price } = booking;
    const [isModalOpen, setModalOpen] = useState(false);
    const reviewFormRef = React.useRef(null);
    const { user } = useAuth()

    function handleSubmit(e) {
        e.preventDefault();
        axios.post('/add_review', { title, bookingType, rating: reviewFormRef.current.rating.value, review: reviewFormRef.current.review.value, name: user.username, src: user.image }).then((response) => {
            if (response.data.status === 200) {
                setModalOpen(false);
                reviewFormRef.current.reset();
                fetchBookings()
                alert(response.data.message)
            } else {
                alert(response.data.message)
            }
        })
    }

    return (
        <div className={`rounded-lg shadow-lg p-6`}>
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
                status === 'confirmed' && (reviewed ? (
                    <button className="mt-4 w-full bg-green-800 text-white py-2 rounded-lg" disabled>
                        <i className="fas fa-right mr-2"></i> Reviewed
                    </button>
                ) : (
                    <div className="border-t border-gray-200 pt-4">
                        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300" onClick={() => setModalOpen(true)}>
                            <i className="fas fa-paper mr-2"></i> Write Review
                        </button>
                    </div>
                ))
            }
            <Modal title={`Write a Review for ${booking.title}`} onClose={() => setModalOpen(false)} isOpen={isModalOpen}>
                <form onSubmit={handleSubmit} className="space-y-4" ref={reviewFormRef}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <select
                            name='rating'
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                            {[5, 4, 3, 2, 1].map((rate) => (
                                <option key={rate} value={rate}>
                                    {rate} Star{rate > 1 && 's'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Review</label>
                        <textarea
                            name='review'
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        Submit Review
                    </button>
                </form>
            </Modal>
        </div>
    );
};

const HotelCard = ({ booking, fetchBookings }) => {
    const { hotelId, roomId, date, bookingType, price, title, size, status, reviewed, hotelTitle } = booking;
    const [reviewModal, setReviewModal] = useState(false)
    const { user } = useAuth()

    function handleReviewSubmit(e) {
        e.preventDefault();
        axios.post('/add_review', { title, bookingType, rating: e.target.rating.value, review: e.target.review.value, name: user.username, src: user.image }).then((response) => {
            if (response.data.status === 200) {
                setReviewModal(false);
                e.target.reset();
                fetchBookings();
                alert(response.data.message)
            } else {
                alert(response.data.message)
            }
        })
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-800">{hotelTitle} {bookingType}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                        <i className={`fas ${status === 'pending' ? 'fa-hourglass-half' : 'fa-check-circle'} mr-1`}></i>
                        <span>{status}</span>
                    </span>
                </div>
                <h3 className="text-xl font-bold text-green-800">{title} Room</h3>
                <div className="">
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
            </div>

            <div className="border-t border-gray-200 pt-4">
                {
                    status === 'confirmed' && (reviewed ? (
                        <button className="mt-4 w-full bg-green-800 text-white py-2 rounded-lg" disabled>
                            <i className="fas fa-right mr-2"></i> Reviewed
                        </button>
                    ) : (
                        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300" onClick={() => setReviewModal(true)}>
                            <i className="fas fa-paper mr-2"></i> Write Review
                        </button>
                    ))
                }
                <Modal title={`Write a Review for ${booking.title}`} onClose={() => setReviewModal(false)} isOpen={reviewModal}>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <select
                                name='rating'
                                required
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            >
                                {[5, 4, 3, 2, 1].map((rate) => (
                                    <option key={rate} value={rate}>
                                        {rate} Star{rate > 1 && 's'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Review</label>
                            <textarea
                                name='review'
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        >
                            Submit Review
                        </button>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

const PackageCard = ({ booking, fetchBookings }) => {
    const { reviewed, bookingType, location, title, date, status, days, price, type } = booking;
    const [isModalOpen, setModalOpen] = useState(false);
    const reviewFormRef = React.useRef(null);
    const { user } = useAuth()

    function handleSubmit(e) {
        e.preventDefault();
        axios.post('/add_review', { title, bookingType, rating: reviewFormRef.current.rating.value, review: reviewFormRef.current.review.value, name: user.username, src: user.image }).then((response) => {
            if (response.data.status === 200) {
                setModalOpen(false);
                reviewFormRef.current.reset();
                fetchBookings();
                alert(response.data.message)
            } else {
                alert(response.data.message)
            }
        })
    }

    return (
        <div className={`rounded-lg shadow-lg p-6`}>
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
                status === 'confirmed' && (reviewed ? (
                    <button className="mt-4 w-full bg-green-800 text-white py-2 rounded-lg" disabled>
                        <i className="fas fa-right mr-2"></i> Reviewed
                    </button>
                ) : (
                    <div className="border-t border-gray-200 pt-4">
                        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300" onClick={() => setModalOpen(true)}>
                            <i className="fas fa-paper mr-2"></i> Write Review
                        </button>
                    </div>
                ))
            }
            <Modal title={`Write a Review for ${booking.title}`} onClose={() => setModalOpen(false)} isOpen={isModalOpen}>
                <form onSubmit={handleSubmit} className="space-y-4" ref={reviewFormRef}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <select
                            name='rating'
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                            {[5, 4, 3, 2, 1].map((rate) => (
                                <option key={rate} value={rate}>
                                    {rate} Star{rate > 1 && 's'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Review</label>
                        <textarea
                            name='review'
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        Submit Review
                    </button>
                </form>
            </Modal>
        </div>
    )
}

const TransportCard = ({ booking, cancelBooking }) => {
    const { id, bookingType, journeyTicket, status, tripType, user, returnTicket, person } = booking;
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 capitalize">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-800">
                    {tripType} {bookingType} for {person} Person
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center text-white ${status === 'pending' ? 'bg-yellow-500' : status === 'cancelled' ? 'bg-red-500' : 'bg-green-500'}`}>
                    <i className={`fas ${status === 'pending' ? 'fa-hourglass-half' : status === 'cancelled' ? 'fa-trash' : 'fa-check-circle'} mr-1`}></i>
                    <span>{status}</span>
                </span>
            </div>

            <div className={`${returnTicket ? 'flex' : ''} justify-between items-start mb-6`}>
                <div className="w-1/2 pr-4">
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
                        <i className="fas fa-arrow-right mr-1"></i> {journeyTicket.provider}
                    </p>
                    <p className="text-lg font-bold text-green-800 mt-2">
                        <i className="fas fa-dollar-sign mr-1"></i> {journeyTicket.price} USD
                    </p>
                </div>
                {returnTicket && (
                    <div className="w-1/2 pl-4">
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
                            <i className="fas fa-arrow-left mr-1"></i> {returnTicket.provider}
                        </p>
                        <p className="text-lg font-bold text-green-800 mt-2">
                            <i className="fas fa-dollar-sign mr-1"></i> {returnTicket.price} USD
                        </p>
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 pt-4">
                {
                    status !== 'confirmed' && status !== 'cancelled' && (
                        <button className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg" onClick={() => cancelBooking(id)}>
                            <i className="fas fa-right mr-2"></i> Cancel Booking
                        </button>
                    )
                }
            </div>
        </div>

    )
}


export default MyBookings