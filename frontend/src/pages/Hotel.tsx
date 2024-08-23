import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Modal from '../components/UI/Modal.tsx';
import axios from 'axios';

function Hotel() {
    const hotel = useLocation().state;
    const { id, title, location, src, description, rooms, floors, constructionYear, star, facilities, totalRooms } = hotel;
    const [contactModal, setContactModal] = useState(false);
    const { user } = useAuth()

    const handleContactSubmit = e => {
        e.preventDefault()
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
            }
            axios.post('/set_message', data).then((response) => {
                if (response.data.status === 200) {
                    setContactModal(false);
                    e.target.reset();
                    alert(response.data.message)
                } else {
                    alert(response.data.message)
                }
            })
        } else {
            alert("only users can contact hotels")
        }
    }
    return (
        <div className='container mx-auto flex flex-col gap-2'>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-col-1 md:grid-cols-2 items-end">
                    <img src={process.env.REACT_APP_server_path + src} alt={title} className="rounded-lg mb-4" />
                    <div className="md:m-5">
                        <h2 className="text-2xl font-bold mb-4 cursor-pointer hover:text-blue-400">{title} <small className='text-grey-800'>({star} star hotel)</small></h2>
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
            {
                rooms.map((room, index) => (
                    <RoomCart {...room} key={index} hotelId={id} />
                ))
            }
        </div>
    )
}

const RoomCart = ({ id, title, src, occupancy, roomCharacteristics, roomSize, facilities, price, hotelId }) => {
    const { handleBooking } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <div className="flex flex-col lg:flex-row gap-8">
                <img src={process.env.REACT_APP_server_path + src} alt="" className='w-98 lg:max-w-md' />
                <div className="">
                    <h2 className="text-lg font-bold mb-4">{title}</h2>
                    <p className="text-md"><span className='font-semibold'>Size: </span>{roomSize}</p>
                    <p className="text-md"><span className='font-semibold'>Occupancy: </span> <br />{occupancy}</p>
                    <p className="text-md"><span className='font-semibold'>Characteristics: </span> <br />{roomCharacteristics}</p>
                    <p className="text-md"><span className='font-semibold'>Facilities: </span> <br />{facilities}</p>
                    <p className="text-md"><span className='font-semibold'>Price: </span> {price} USD</p>
                    <div className="flex gap-3">
                        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={() => setModalOpen(true)}>Book Now</button>
                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => setModalOpen(false)}
                            title={`Booking ${title} Room`}
                        >
                            <form onSubmit={e => {
                                e.preventDefault();
                                const formdata = {}
                                formdata.hotelId = hotelId;
                                formdata.roomId = id;
                                formdata.date = e.target.date.value;
                                formdata.bookingType = "hotel";
                                formdata.price = price;
                                formdata.title = title;
                                formdata.size = roomSize;
                                if (new Date(formdata.date) <= new Date()) {
                                    alert('Invalid date');
                                } else {
                                    handleBooking(formdata).then(() => setModalOpen(false));
                                }
                            }}
                                className='flex flex-col space-y-2'
                            >
                                <input required type="date" name="date" id="date" className='border border-1 p-2 me-2' />
                                <button className="bg-green-500 px-4 py-2 text-white">Book</button>
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hotel