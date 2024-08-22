import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Modal from '../../components/UI/Modal.tsx'

function ManageHotel() {
    const [hotel, setHotel] = useState({})
    const { user } = useAuth();

    const getHotel = () => {
        axios.get('/get_hotel?id=' + user.id).then(response => {
            if (response.data.status === 200) setHotel(response.data.hotel);
            else setHotel({});
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getHotel();
    }, [])

    return (
        <section className="container mx-auto">
            <HotelCard {...hotel} getHotel={getHotel} />
        </section>
    )
}

const HotelCard = ({ id, title, location, src, description, rooms, floors, constructionYear, star, facilities, getHotel, totalRooms }) => {
    const [hotelModal, setHotelModal] = useState(false);
    const [roomModal, setRoomModal] = useState(false)
    const hotelForm = useRef()
    const { user } = useAuth()
    const [info, setInfo] = useState('')
    const [status, setStatus] = useState(false)

    const handleSubmit = async (e) => {
        setInfo('')
        setStatus(true)
        e.preventDefault()
        const formData = new FormData(hotelForm.current)
        axios.post('/set_hotel', formData).then(response => {
            if (response.data.status === 200) {
                setInfo(response.data.message);
                setHotelModal(false);
                getHotel();
            } else {
                setInfo('Failed to update hotel');
            }
        }).catch(error => setInfo(error)).finally(() => setStatus(false));
    }

    const handleRoomCreate = e => {
        setStatus(true)
        e.preventDefault();
        const data = new FormData(e.target);
        axios.post('/create_room', data)
            .then(response => {
                if (response.data.status === 200) {
                    alert('Room created successfully');
                    e.target.reset();
                    setRoomModal(false);
                    getHotel()
                } else {
                    setInfo('Failed to create room');
                }
            }).finally(() => setStatus(false));
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between my-2">
                <div className="lg:flex justify-between gap-4">
                    {src && <img src={process.env.REACT_APP_server_path + src} alt={title} className="w-98 rounded-lg mb-4" />}
                    {/* <div className="flex flex-col gap-2 my-4">
                        <h1 className="text-2xl font-bold">Manager</h1>
                        <p>{user.username}</p>
                        <p>{user.email}</p>
                    </div> */}
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Hotel Name: {title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-green-500 font-bold">Location: {location}</span>
                    </div>
                    <div className="flex gap-4 my-4">
                        <small>Rooms: {totalRooms}</small>
                        <small>Floors: {floors}</small>
                        <small>Construction Year: {constructionYear}</small>
                        <small>Hotel Type: {star} star</small>
                    </div>
                    <p className="text-gray-700 mb-4">Description: {description}</p>
                    <button className="bg-yellow-500 text-white p-2 mb-2 md:mb-0 md:me-2 rounded" onClick={() => setHotelModal(true)}>Edit Hotel Information</button>
                    <Modal title={"Update hotel information"} isOpen={hotelModal} onClose={() => setHotelModal(false)}>
                        <form className={`flex flex-col gap-3`} onSubmit={handleSubmit} method='post' ref={hotelForm} encType='multipart/form-data'>
                            <input type="number" name='id' defaultValue={user.id} className='hidden'/>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Hotel Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                                    defaultValue={title}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                    Hotel Picture
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    accept='image/*'
                                    name="src"
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
                                    defaultValue={location}
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
                                    defaultValue={facilities}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                                    Number of Rooms
                                </label>
                                <input
                                    type="text"
                                    id="rooms"
                                    name="rooms"
                                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                                    defaultValue={totalRooms}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="floors" className="block text-sm font-medium text-gray-700">
                                    Number of Floors
                                </label>
                                <input
                                    type="text"
                                    id="floors"
                                    name="floors"
                                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                                    defaultValue={floors}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="constructionYear" className="block text-sm font-medium text-gray-700">
                                    Year of Construction
                                </label>
                                <input
                                    type="text"
                                    name="constructionYear"
                                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                                    defaultValue={constructionYear}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="star" className="block text-sm font-medium text-gray-700">
                                    Hotel Star
                                </label>
                                <input
                                    type="text"
                                    id="star"
                                    name="star"
                                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                                    defaultValue={star}
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
                                    defaultValue={description}
                                    required></textarea>
                            </div>
                            <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Updating...' : 'Update'}</button>
                            <p>{info}</p>
                        </form>
                    </Modal>
                    <button className="bg-green-500 p-2 rounded text-white" onClick={() => setRoomModal(true)}>Create Room</button>
                    <Modal title={"Create Room"} isOpen={roomModal} onClose={() => setRoomModal(false)}>
                        <form className={`flex flex-col gap-3`} onSubmit={handleRoomCreate} method='post' ref={hotelForm} encType='multipart/form-data'>
                            <input type="number" name="id" defaultValue={id} className='hidden'/>
                            <input type="text" className="p-2 border rounded" name='title' placeholder='Title' required />
                            <input type="file" name="src" id="" required />
                            <textarea className="p-2 border rounded" name='occupancy' placeholder='Occupancy' required></textarea>
                            <textarea className="p-2 border rounded" name='roomCharacteristics' placeholder='Room Characteristics' required></textarea>
                            <input type="text" className="p-2 border rounded" name='roomSize' placeholder='Room Size' required />
                            <textarea className="p-2 border rounded" name='facilities' placeholder='Facilities' required></textarea>
                            <input type="text" className="p-2 border rounded" name='price' placeholder='Price' required />
                            <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Submitting...' : 'Submit'}</button>
                            <p>{info}</p>
                        </form>
                    </Modal>
                </div>
            </div>
            {rooms?.map((room, index) => <RoomCart key={index} {...room} getHotel={getHotel} />)}
        </>
    );
};

const RoomCart = ({ id, title, src, occupancy, roomCharacteristics, roomSize, facilities, price, getHotel }) => {
    const [roomEditModal, setRoomEditModal] = useState(false)
    const [info, setInfo] = useState('')
    const [status, setStatus] = useState(false)
    const { user } = useAuth();

    const handleRoomUpdate = async (e) => {
        setInfo('')
        setStatus(true)
        e.preventDefault()
        const formData = new FormData(e.target);
        axios.post(`/update_room?hotelId=${user.id}`, formData)
            .then(response => {
                if (response.data.status === 200) {
                    alert('Room updated successfully');
                    setRoomEditModal(false);
                    getHotel()
                } else {
                    setInfo('Failed to update room');
                }
            })
            .finally(() => setStatus(false));
    }

    const handleDeleteRoom = roomId => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            axios.get(`/delete_room?hotelId=${user.id}&roomId=${roomId}`)
                .then(response => {
                    if (response.data.status === 200) {
                        getHotel();
                    } else {
                        alert(response.data.message);
                    }
                })
        }
    }

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
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded mt-4" onClick={() => setRoomEditModal(true)}>Edit</button>
                        <Modal title={"Create Room"} isOpen={roomEditModal} onClose={() => setRoomEditModal(false)}>
                            <form className={`flex flex-col gap-3`} onSubmit={handleRoomUpdate} method='post' encType='multipart/form-data'>
                                <input type="hidden" name="id" defaultValue={id} />
                                <input type="text" className="p-2 border rounded" name='title' placeholder='Title' required defaultValue={title} />
                                <input type="file" name="src" id="" />
                                <textarea className="p-2 border rounded" name='occupancy' placeholder='Occupancy' required defaultValue={occupancy}></textarea>
                                <textarea className="p-2 border rounded" name='roomCharacteristics' placeholder='Room Characteristics' required defaultValue={roomCharacteristics}></textarea>
                                <input type="text" className="p-2 border rounded" name='roomSize' placeholder='Room Size' required defaultValue={roomSize} />
                                <textarea className="p-2 border rounded" name='facilities' placeholder='Facilities' required defaultValue={facilities}></textarea>
                                <input type="text" className="p-2 border rounded" name='price' placeholder='Price' required defaultValue={price} />
                                <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Updating...' : 'Update'}</button>
                            </form>
                        </Modal>
                        <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={() => handleDeleteRoom(id)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageHotel