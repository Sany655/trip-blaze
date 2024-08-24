import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Modal from '../components/UI/Modal.tsx';
import axios from 'axios';
import FilteredRoomList from '../components/UI/Hotel/FilteredRoomList.tsx';
import Filter from '../components/UI/Hotel/Filter.tsx';

function Hotel() {
    const hotelId = useParams().id;
    const [{ id, title, location, src, description, rooms, floors, constructionYear, star, facilities, totalRooms }, setHotel] = useState({})
    const hotel = { id, title, location, src, description, rooms, floors, constructionYear, star, facilities, totalRooms };
    const [contactModal, setContactModal] = useState(false);
    const [filters, setFilters] = useState({});
    const { user } = useAuth();

    const getHotel = () => {
        axios.get('/get_hotel?id=' + hotelId).then(response => {
            if (response.data.status === 200) setHotel(response.data.hotel);
            else setHotel({});
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getHotel();
    }, [])

    const handleContactSubmit = e => {
        e.preventDefault();
        if (user.role === 'user') {
            const msg = e.target.user_message.value;
            const data = {
                hotel: {
                    title, id, src
                },
                user: {
                    id: user.id,
                    username: user.username,
                    image: user.image,
                    email: user.email
                },
                messages: [
                    {
                        sender: 'user',
                        content: msg,
                        read: false,
                        time: new Date().toLocaleTimeString()
                    }
                ]
            };
            axios.post('/set_message', data).then((response) => {
                if (response.data.status === 200) {
                    setContactModal(false);
                    e.target.reset();
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
            });
        } else {
            alert("Only users can contact hotels.");
        }
    };

    const handleFilterChange = (updatedFilters) => {
        setFilters(updatedFilters);
    };

    return (
        <div className='container mx-auto flex flex-col gap-2'>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-col-1 md:grid-cols-2 items-end">
                    <img src={process.env.REACT_APP_server_path + src} alt={title} className="rounded-lg mb-4" />
                    <div className="md:m-5">
                        <h2 className="text-2xl font-bold mb-4 cursor-pointer">{title} <small className='text-grey-800'>({star} star hotel)</small></h2>
                        <p className="text-green-500 font-bold">{location}</p>
                        <p className="text-grey-200">Total Rooms: {totalRooms}</p>
                        <p className="text-grey-200">Total Floors: {floors}</p>
                        <p className="text-grey-200">Facilities: {facilities}</p>
                        <p className="text-grey-200">Constructed: {constructionYear}</p>
                        <button className="bg-green-500 text-white px-2 rounded py-1 my-2" onClick={() => setContactModal(true)}>Contact Now</button>
                        <Modal title={`Write message to ${title}`} onClose={() => setContactModal(false)} isOpen={contactModal}>
                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea
                                        name='user_message'
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                                >
                                    Send Message
                                </button>
                            </form>
                        </Modal>
                    </div>
                </div>
                <pre className='text-gray-700 text-lg font-medium text-wrap'>{description}</pre>
            </div>
            <div className="flex md:flex-row flex-col gap-3">
                <Filter onFilterChange={handleFilterChange} />
                <FilteredRoomList rooms={rooms} hotel={{ title: hotel.title, id: hotel.id }} filters={filters} />
            </div>
        </div>
    );
}

export default Hotel;
