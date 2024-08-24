import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import Modal from '../../components/UI/Modal.tsx'

function ManageTransport() {
    const transportForm = useRef()
    const [info, setInfo] = useState('')
    const [transports, setTranport] = useState([])
    const [status, setStatus] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setInfo('')
        setStatus(true)
        const formData = new FormData(transportForm.current)
        axios.post('/set_transport', formData).then(response => {
            if (response.status === 200) {
                setInfo(response.data.message);
                transportForm.current.reset();
                getTransports();
            } else {
                setInfo('Failed to set transport');
            }
        }).catch(error => setInfo(error)).finally(() => setStatus(false));
    }

    const getTransports = async () => {
        await axios.get('/get_transports').then(response => {
            setTranport(response.data);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getTransports();
    }, [])

    return (
        <section className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between  mb-8">
                <h1 className="text-3xl font-bold text-center my-8">Manage Transports</h1>
                <div className='flex gap-4'>
                    <button className="bg-green-500 py-2 px-6" onClick={() => { setIsOpen(!isOpen); setInfo("") }}>
                        Create Transports
                        <i className={`fa ${isOpen ? "fa-caret-up" : "fa-caret-down"} ms-4`}></i>
                    </button>
                </div>
            </div>
            <form className={`flex flex-col items-center gap-2 mb-8 shadow py-14 shadow-lg ${isOpen ? "block" : "hidden"}`} onSubmit={handleSubmit} method='post' ref={transportForm}>
                <h3 className="text-2xl">Create Transport</h3>
                <p>Create them in regular basis</p>
                <input required type="text" className="md:w-1/3 p-4 my-2 border" placeholder='Provider' name='provider' />
                <label htmlFor="dep">Departure Time</label>
                <input required id='dep' type="time" className="md:w-1/3 p-4 my-2 border" name='departureTime' />
                <label htmlFor="arr">Arrival Time</label>
                <input required id='arr' type="time" className="md:w-1/3 p-4 my-2 border" name='arrivalTime' />
                <input required type="text" className="md:w-1/3 p-4 my-2 border" placeholder='From' name='from' />
                <input required type="text" className="md:w-1/3 p-4 my-2 border" placeholder='To' name='to' />
                <input required type="number" className="md:w-1/3 p-4 my-2 border" placeholder='Price' name='price' />
                <input required type="text" className="md:w-1/3 p-4 my-2 border" placeholder='Vehicle Number' name='vehicleNumber' />
                <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Submitting...' : 'Submit'}</button>
                <p>{info}</p>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
                {transports.map((transport, index) => (
                    <TransportCard key={index} {...transport} getTransports={getTransports} />
                ))}
            </div>
        </section>
    )
}

const TransportCard = ({ type, provider, departureTime, arrivalTime, from, to, price, vehicleNumber, getTransports }, index?) => {
    const [modal, setModal] = useState(false)
    const [status, setStatus] = useState(false)
    const [info, setInfo] = useState('')

    const handleDeleteTransport = async () => {
        if (window.confirm(`Are you sure you want to delete ${vehicleNumber}?`)) {
            await axios.delete(`/delete_transport/${vehicleNumber}`).then(response => {
                if (response.status === 200) {
                    getTransports();
                } else {
                    alert('Failed to delete transport');
                }
            }).catch(error => alert(error.message));
        }
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        setStatus(true)
        setInfo('')
        const formdata = new FormData(e.target);
        axios.post(`/update_transport`, formdata)
            .then(response => {
                if (response.data.status === 200) {
                    alert(response.data.message);
                    getTransports();
                    setModal(false);
                    setInfo('')
                } else {
                    setInfo('Failed to update transport');
                }
            })
            .catch(error => setInfo(error.message))
            .finally(() => setStatus(false));
    }

    return (
        <div className="border rounded-lg shadow-md p-4 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-green-800">{provider}</h3>
            <p className="text-sm text-green-500">Number: {vehicleNumber}</p>
            <div className="flex items-center">
                <div className="text-center">
                    <p className="text-sm text-green-500">{from}</p>
                    <p className="text-lg font-semibold text-green-800">{departureTime}</p>
                </div>

                <div className="flex items-center justify-center">
                    <span className="text-green-500 mx-2">→</span>
                    <div className="text-center">
                        <p className="text-sm text-green-500">{to}</p>
                        <p className="text-lg font-semibold text-green-800">{arrivalTime}</p>
                    </div>
                </div>
            </div>
            <p className="text-lg font-bold text-yellow-600">Price {price} USD</p>
            <div>
                <button className="mt-2 me-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 " onClick={() => setModal(true)}>
                    Edit
                </button>
                <Modal isOpen={modal} title={'Update Ticket'} onClose={() => setModal(false)}>
                    <form className={`flex flex-col gap-2`} onSubmit={handleUpdate} method='post'>
                        <input required type="text" className="p-4 my-2 border" placeholder='Provider' name='provider' defaultValue={provider} />
                        <label htmlFor="dep">Departure Time</label>
                        <input required id='dep' type="time" className="p-4 my-2 border" name='departureTime' defaultValue={departureTime} />
                        <label htmlFor="arr">Arrival Time</label>
                        <input required id='arr' type="time" className="p-4 my-2 border" name='arrivalTime' defaultValue={arrivalTime} />
                        <input required type="text" className="p-4 my-2 border" placeholder='From' name='from' defaultValue={from} />
                        <input required type="text" className="p-4 my-2 border" placeholder='To' name='to' defaultValue={to} />
                        <input required type="number" className="p-4 my-2 border" placeholder='Price' name='price' defaultValue={price} />
                        <input required type="text" className="p-4 my-2 border" placeholder='Vehicle Number' name='vehicleNumber' defaultValue={vehicleNumber} />
                        <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Updating...' : 'Update'}</button>
                        <p>{info}</p>
                    </form>
                </Modal>
                <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={handleDeleteTransport}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ManageTransport