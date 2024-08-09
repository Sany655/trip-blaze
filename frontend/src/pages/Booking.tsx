import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase.confic';
import { collection, getDocs, query, where } from 'firebase/firestore';
import data from '../data.json'


function Booking() {
    const toursRef = collection(db, 'tours');
    const { title, type } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        fullName: '',
        nationality: '',
        email: '',
        whatsapp: '',
        pickupAddress: '',
        tourPackage: title,
        tourDate: '',
        numberOfPeople: '',
        bookingType: '',
        billingAddress: '',
        promoCode: '',
        howHeardAboutUs: '',
        message: '',
    });
    const [tours, setTours] = useState([]);

    useEffect(() => {
        if (type === "place") {
            setTours(data.places)
        } else setTours(data.hotels)
    }, [])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        // TODO: Send data to Firebase
        // You'll need to implement Firebase logic here
        // to save the data to your Firestore database
        console.log(formData); // Replace with your Firebase save logic
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center my-12 text-green-500">Book Your Tour</h1>
            <hr className='bg-green-500' />
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Your Title:*
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="title"
                        id="title"
                        onChange={handleChange}
                        required
                    >
                        <option value=''>Select one</option>
                        <option value="mr">Mr.</option>
                        <option value="ms">Ms.</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                        Your Full Name (according to your passport):*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="fullName"
                        name="fullName"
                        type="text"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nationality">
                        Nationality:*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="nationality"
                        name="nationality"
                        type="text"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Your Email:*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whatsapp">
                        Your WhatsApp No (with '+' and country code):*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pickupAddress">
                        Pick-up Address:*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="pickupAddress"
                        name="pickupAddress"
                        type="text"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tourPackage">
                        Tour Package:*
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="tourPackage"
                        id="tourPackage"
                        onChange={handleChange}
                        required
                        value={formData.tourPackage}
                    >
                        <option value=''>Select one</option>
                        {tours.map((tour, index) => (
                            <option key={index} value={tour.title}>
                                {tour.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tourDate">
                        Tour Date:*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="tourDate"
                        name="tourDate"
                        type="date"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberOfPeople">
                        Number of People:*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="numberOfPeople"
                        name="numberOfPeople"
                        type="number"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bookingType">
                        Booking Type:*
                    </label>
                    <div className="mt-2">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="bookingType"
                                value="groupTour"
                                onChange={handleChange}
                                required
                            />
                            <span className="ml-2">Group Tour (Others Can Join and Reduce Costs)</span>
                        </label>
                        <label className="inline-flex items-center ml-6">
                            <input
                                type="radio"
                                className="form-radio"
                                name="bookingType"
                                value="privateTour"
                                onChange={handleChange}
                                required
                            />
                            <span className="ml-2">Private Tour (More Expensive)</span>
                        </label>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingAddress">
                        Billing Address:*
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="billingAddress"
                        name="billingAddress"
                        type="text"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="promoCode">
                        Promo Code (if any):
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="promoCode"
                        name="promoCode"
                        type="text"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="howHeardAboutUs">
                        How did you first hear about us:*
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="howHeardAboutUs"
                        id="howHeardAboutUs"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select One</option>
                        <option value="friend">Friend</option>
                        <option value="website">Website</option>
                        <option value="socialMedia">Social Media</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                        Your Message (expectations, special needs, special instructions, any physical disability):
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="message"
                        name="message"
                        rows="4"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Book Tour
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Booking