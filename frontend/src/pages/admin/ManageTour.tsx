import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import Modal from '../../components/UI/Modal.tsx'

function ManageTour() {
    const tourForm = useRef()
    const [info, setInfo] = useState('')
    const [places, setPlaces] = useState([])
    const [status, setStatus] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isTourOpen, setIsTourOpen] = useState(false)

    const handleSubmit = async (e) => {
        setInfo('')
        setStatus(true)
        e.preventDefault()
        const formData = new FormData(tourForm.current)
        axios.post('/set_place', formData).then(response => {
            if (response.data.status === 200) {
                setInfo(response.data.message);
                tourForm.current.reset();
                getPlaces();
            } else {
                setInfo(response.data.message);
            }
        }).catch(error => setInfo(error)).finally(() => setStatus(false));
    }

    const getPlaces = async () => {
        await axios.get('/get_places').then(response => {
            setPlaces(response.data);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getPlaces();
    }, [])

    return (
        <section className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <h1 className="text-3xl font-bold text-center my-8">Manage Tours</h1>
                <div className='flex gap-4'>
                    <button className="bg-green-500 py-2 px-6" onClick={() => { setIsOpen(!isOpen); setInfo("") }}>
                        Create Tour
                        <i className={`fa ${isOpen ? "fa-caret-up" : "fa-caret-down"} ms-4`}></i>
                    </button>
                </div>
            </div>
            <form className={`flex flex-col items-center gap-2 mb-8 shadow py-14 shadow-lg ${isOpen ? "block" : "hidden"}`} onSubmit={handleSubmit} method='post' ref={tourForm} encType='multipart/form-data'>
                <h3 className="text-2xl">Create Tour</h3>
                <input required type="text" className="md:w-1/3 p-4 my-2 border" placeholder='Title' name='title' />
                <input required type="number" className="md:w-1/3 p-4 my-2 border" placeholder='Price' name='price' />
                <input required type="number" className="md:w-1/3 p-4 my-2 border" placeholder='Days' name='days' />
                <input required type="text" className="md:w-1/3 p-4 my-2 border" placeholder='Location' name='location' />
                <input required type="file" className="md:w-1/3 my-2" name='src' />
                <textarea required name="description" id="" className="md:w-1/3 p-4 my-2 border" placeholder='Description'></textarea>
                <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Submitting...' : 'Submit'}</button>
                <p>{info}</p>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
                {places.map((place, index) => (
                    <TourCard key={index} {...place} getPlaces={getPlaces} />
                ))}
            </div>
        </section>
    )
}

const TourCard = ({ title, price, days, location, src, getPlaces, description }, index?) => {
    const place = { title, price, days, location, src, description };
    const [placeEditModal, setPlaceEditModal] = useState(false)
    const [status, setStatus] = useState(false)
    const [info, setInfo] = useState('')
    const handleDeleteTour = async () => {
        if (window.confirm(`Are you sure you want to delete ${title}?`)) {
            await axios.delete(`/delete_place/${title}`).then(response => {
                if (response.status === 200) {
                    getPlaces();
                } else {
                    alert('Failed to delete place');
                }
            }).catch(error => alert(error.message));
        }
    }
    const handleUpdatePlace = async (e) => {
        e.preventDefault()
        setStatus(true)
        setInfo('')
        axios.post(`/update_place`, new FormData(e.target))
            .then(response => {
                if (response.data.status === 200) {
                    getPlaces()
                    setPlaceEditModal(false)
                } else {
                    setInfo(response.data.message);
                }
            }).finally(() => setStatus(false));
    }
    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-4 flex flex-col justify-between" key={index}>
            <img src={process.env.REACT_APP_server_path + src} alt={title} className="w-full rounded-lg mb-4" />
            <div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                {/* <p className="text-gray-700 mb-4">{description}</p> */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">{days} DAY &nbsp;</span>
                    <span className="text-gray-500">{price} USD</span>
                </div>
                <p className="text-green-500 font-bold mb-2">{location}</p>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded me-2" onClick={() => setPlaceEditModal(true)}>Edit</button>
                <EditModal place={place} handleUpdate={handleUpdatePlace} setPlaceEditModal={setPlaceEditModal} placeEditModal={placeEditModal} status={status} info={info} />
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleDeleteTour}>Delete</button>
                <div className="flex justify-between items-center mb-2">
                </div>
            </div>
        </div>
    );
};

const EditModal = ({ place, handleUpdate, setPlaceEditModal, placeEditModal, status, info }) => {
    return (
        <Modal title={place.title} onClose={() => setPlaceEditModal(false)} isOpen={(placeEditModal)}>
            <form className={`flex flex-col gap-2`} onSubmit={handleUpdate} method='post' encType='multipart/form-data'>
                <input required type="text" className="p-4 my-2 border" placeholder='Title' name='title' defaultValue={place.title} />
                <input required type="number" className="p-4 my-2 border" placeholder='Price' name='price' defaultValue={place.price} />
                <input required type="number" className="p-4 my-2 border" placeholder='Days' name='days' defaultValue={place.days} />
                <input required type="text" className="p-4 my-2 border" placeholder='Location' name='location' defaultValue={place.location} />
                <input type="file" className="my-2" name='src' />
                <textarea required name="description" id="" className="p-4 my-2 border" placeholder='Description' defaultValue={place.description}></textarea>
                <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Submitting...' : 'Submit'}</button>
                <p>{info}</p>
            </form>
        </Modal>
    )
}

export default ManageTour