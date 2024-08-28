import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

function ManageRooms() {
    const hotelForm = useRef()
    const [info, setInfo] = useState('')
    const [hotels, setHotels] = useState([])
    const [status, setStatus] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isHotelOpen, setIsHotelOpen] = useState(false)

    const handleSubmit = async (e) => {
        setInfo('')
        setStatus(true)
        e.preventDefault()
        const formData = new FormData(hotelForm.current)
        axios.post('/set_hotel', formData).then(response => {
            if (response.data.status === 200) {
                setInfo(response.data.message);
                hotelForm.current.reset();
                getHotels();
            } else {
                setInfo('Failed to set hotel');
            }
        }).catch(error => setInfo(error)).finally(() => setStatus(false));
    }

    const getHotels = async () => {
        await axios.get('/get_hotels').then(response => {
            setHotels(response.data);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getHotels();
    }, [])

    return (
        <section className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <h1 className="text-3xl font-bold text-center my-8">Manage Hotels</h1>
                <div className='flex gap-4'>
                    <button className="bg-green-500 py-2 px-6" onClick={() => { setIsOpen(!isOpen); setInfo("") }}>
                        Create Hotel
                        <i className={`fa ${isOpen ? "fa-caret-up" : "fa-caret-down"} ms-4`}></i>
                    </button>
                </div>
            </div>
            <form className={`flex flex-col items-center gap-2 mb-8 shadow py-14 shadow-lg ${isOpen ? "block" : "hidden"}`} onSubmit={handleSubmit} method='post' ref={hotelForm} encType='multipart/form-data'>
                <h3 className="text-2xl">Create Hotel</h3>
                <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Submitting...' : 'Submit'}</button>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Hotel Picture
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"

                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Hotel Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="facilities" className="block text-sm font-medium text-gray-700">
                        Hotel Facilities (separated by commas)
                    </label>
                    <input
                        type="text"
                        id="facilities"
                        name="facilities"
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                        Number of Rooms
                    </label>
                    <input
                        type="number"
                        id="rooms"
                        name="rooms"
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="floors" className="block text-sm font-medium text-gray-700">
                        Number of Floors
                    </label>
                    <input
                        type="number"
                        id="floors"
                        name="floors"
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="constructionYear" className="block text-sm font-medium text-gray-700">
                        Year of Construction
                    </label>
                    <input
                        type="number"
                        name="constructionYear"
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="star" className="block text-sm font-medium text-gray-700">
                        Hotel Start
                    </label>
                    <input
                        type="number"
                        id="star"
                        name="star"
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Hotel Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                        required></textarea>
                </div>

                <p>{info}</p>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
                {hotels.map((hotel, index) => (
                    <RoomCard key={index} {...hotel} getHotels={getHotels} />
                ))}
            </div>
        </section>
    )
}

const RoomCard = ({ title, price, location, src, getHotels }, index?) => {
    const handleDeleteHotel = async () => {
        if (window.confirm(`Are you sure you want to delete ${title}?`)) {
            await axios.delete(`/delete_hotel/${title}`).then(response => {
                if (response.status === 200) {
                    getHotels();
                } else {
                    alert('Failed to delete hotel');
                }
            }).catch(error => alert(error.message));
        }
    }
    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-4 flex flex-col justify-between" key={index}>
            <img src={process.env.REACT_APP_server_path + src} alt={title} className="w-full h-48 rounded-lg mb-4" />
            <div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                {/* <p className="text-gray-700 mb-4">{description}</p> */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">{price} USD</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-green-500 font-bold">{location}</span>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleDeleteHotel}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ManageRooms