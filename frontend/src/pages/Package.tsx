import React, { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import Modal from '../components/UI/Modal.tsx';

function Package() {
    const { handleBooking } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const bookingFormRef = useRef();
    const locate = useLocation()
    const pakage = locate.state;
    const { title, price, days, location, src, description, type } = pakage;
    pakage.bookingType = "package"
    return (
        <div className="container mx-auto flex flex-col justify-between">
            <div className="grid grid-col-1 md:grid-cols-2 items-end">
                <img src={process.env.REACT_APP_server_path + src} alt={title} className="rounded-lg mb-4" />
                <div className='md:mx-5'>
                    <h2 className="text-2xl font-bold mb-4 cursor-pointer">{title}</h2>
                    <div className="flex flex-col mb-2">
                        <span className="text-gray-500">{type} PACKAGE &nbsp;</span>
                        <span className="text-gray-500">{days} DAY &nbsp;</span>
                        <span className="text-gray-500">{price} USD PER PERSON</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-green-500 font-bold">{location}</span>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModalOpen(true)}>Book now</button>
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        title={`Booking ${pakage.bookingType}`}
                    >
                        <form onSubmit={e => {
                            e.preventDefault();
                            const formdata = {}
                            formdata.date = bookingFormRef?.current.date.value;
                            formdata.person = bookingFormRef?.current.person.value;
                            formdata.bookingType = pakage.bookingType;
                            formdata.days = days;
                            formdata.location = location;
                            formdata.price = price * bookingFormRef?.current.person.value;
                            formdata.title = title;
                            formdata.type = type;
                            if (new Date(formdata.date) < new Date()) {
                                alert('Invalid date');
                            } else {
                                handleBooking(formdata).then(() => setModalOpen(false));
                            }
                        }}
                            className='flex flex-col space-y-2'
                            ref={bookingFormRef}
                        >
                            <input required type="date" name="date" id="date" className='border border-1 p-2 me-2' />
                            <input required type="number" name="person" id="person" className='border border-1 p-2 me-2' placeholder='person' defaultValue={1} min={1} max={50}/>
                            <button className="bg-green-500 px-4 py-2 text-white">Book</button>
                        </form>
                    </Modal>
                </div>
            </div>
            <pre className="text-gray-700 text-lg font-medium text-wrap">{description}</pre>
        </div>
    )
}

export default Package