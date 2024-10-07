import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import Modal from '../../components/UI/Modal.tsx'
import useAuth from '../../hooks/useAuth.js'

function ManageTransport() {
    const transportForm = useRef()
    const { user } = useAuth();
    const [info, setInfo] = useState('')
    const [transports, setTranport] = useState([])
    const [status, setStatus] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setInfo('')
        setStatus(true)
        const formData = new FormData(transportForm.current)
        formData.set('transporter_id', user.id);
        axios.post('/set_transport', formData).then(response => {
            if (response.status === 200) {
                getTransports();
                setInfo(response.data.message);
                transportForm.current.reset();
            } else {
                setInfo('Failed to set transport');
            }
        }).catch(error => setInfo(error)).finally(() => setStatus(false));
    }

    const getTransports = async () => {
        await axios.get('/get_transports?transporter_id=' + user.id).then(response => {
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
                <button className="bg-green-500 py-2 px-6" onClick={() => { setIsOpen(!isOpen); setInfo("") }}>Create Transports</button>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={"Create Transport"} >
                <form className={``} onSubmit={handleSubmit} method='post' ref={transportForm}>
                    <div className="mb-2">
                        <label htmlFor="provider" className="block text-left text-gray-700 mb-2 font-medium">Provider</label>
                        <input required readOnly id="provider" type="text" className="w-full p-3 border rounded" placeholder="Provider" name="provider" defaultValue={user.username} />
                    </div>

                    <div className="flex gap-2">
                        <div className="mb-2">
                            <label htmlFor="departureTime" className="block text-left text-gray-700 mb-2 font-medium">Departure Time</label>
                            <input required id="departureTime" type="time" className="w-full p-3 border rounded" name="departureTime" />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="arrivalTime" className="block text-left text-gray-700 mb-2 font-medium">Arrival Time</label>
                            <input required id="arrivalTime" type="time" className="w-full p-3 border rounded" name="arrivalTime" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="mb-2">
                            <label htmlFor="from" className="block text-left text-gray-700 mb-2 font-medium">From</label>
                            <input required id="from" type="text" className="w-full p-3 border rounded" placeholder="Departure Location" name="from" />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="to" className="block text-left text-gray-700 mb-2 font-medium">To</label>
                            <input required id="to" type="text" className="w-full p-3 border rounded" placeholder="Arrival Location" name="to" />
                        </div>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="price" className="block text-left text-gray-700 mb-2 font-medium">Price</label>
                        <input required id="price" type="number" className="w-full p-3 border rounded" placeholder="Price" name="price" />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="capacity" className="block text-left text-gray-700 mb-2 font-medium">Capacity</label>
                        <input required id="capacity" type="number" className="w-full p-3 border rounded" placeholder="Capacity" name="capacity" />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="vehicleNumber" className="block text-left text-gray-700 mb-2 font-medium">Vehicle Number</label>
                        <input required id="vehicleNumber" type="text" className="w-full p-3 border rounded" placeholder="Vehicle Number" name="vehicleNumber" />
                    </div>

                    <div className="flex gap-2">
                        <button className="mt-6 bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition" onClick={() => {
                            setIsOpen(false);
                            setInfo("")
                            transportForm.current.reset();
                        }}>Close</button>
                        <button className="mt-6 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition">{status ? 'Submitting...' : 'Submit'}</button>
                    </div>

                    <p className="mt-4 text-gray-500">{info}</p>
                </form>
            </Modal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
                {transports.map((transport, index) => (
                    <TransportCard key={index} {...transport} getTransports={getTransports} />
                ))}
            </div>
        </section>
    )
}

const TransportCard = ({ transporter_id, id, capacity, type, provider, departureTime, arrivalTime, from, to, price, vehicleNumber, getTransports }, index?) => {
    const [modal, setModal] = useState(false)
    const [status, setStatus] = useState(false)
    const [info, setInfo] = useState('')

    const handleDeleteTransport = async () => {
        if (window.confirm(`Are you sure you want to delete ${vehicleNumber}?`)) {
            await axios.delete(`/delete_transport/${id}`).then(response => {
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
        axios.post(`/update_transport?id=${id}&transporter_id=${transporter_id}`, formdata)
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
            <p className="text-lg font-bold text-yellow-600">Capecity: {capacity} person</p>
            <div>
                <button className="mt-2 me-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 " onClick={() => setModal(true)}>
                    Edit
                </button>
                <Modal isOpen={modal} title={'Update Ticket'} onClose={() => setModal(false)}>
                    <form className="flex flex-col gap-4" onSubmit={handleUpdate} method="post">
                        <div className="flex gap-4">
                            <div className="">
                                <label htmlFor="provider" className="block text-gray-700 mb-1">Provider</label>
                                <input required readOnly type="text" className="w-full p-3 border rounded" placeholder="Provider" name="provider" defaultValue={provider} />
                            </div>
                            <div className="">
                                <label htmlFor="vehicleNumber" className="block text-gray-700 mb-1">Vehicle Number</label>
                                <input required type="text" className="w-full p-3 border rounded" placeholder="Vehicle Number" name="vehicleNumber" defaultValue={vehicleNumber} />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="">
                                <label htmlFor="from" className="block text-gray-700 mb-1">From</label>
                                <input required type="text" className="w-full p-3 border rounded" placeholder="From" name="from" defaultValue={from} />
                            </div>
                            <div className="">
                                <label htmlFor="to" className="block text-gray-700 mb-1">To</label>
                                <input required type="text" className="w-full p-3 border rounded" placeholder="To" name="to" defaultValue={to} />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="">
                                <label htmlFor="departureTime" className="block text-gray-700 mb-1">Departure Time</label>
                                <input required id="dep" type="time" className="w-full p-3 border rounded" name="departureTime" defaultValue={departureTime} />
                            </div>
                            <div className="">
                                <label htmlFor="arrivalTime" className="block text-gray-700 mb-1">Arrival Time</label>
                                <input required id="arr" type="time" className="w-full p-3 border rounded" name="arrivalTime" defaultValue={arrivalTime} />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="">
                                <label htmlFor="price" className="block text-gray-700 mb-1">Price</label>
                                <input required type="number" className="w-full p-3 border rounded" placeholder="Price" name="price" defaultValue={price} />
                            </div>
                            <div className="">
                                <label htmlFor="capacity" className="block text-gray-700 mb-1">Capacity</label>
                                <input required type="number" className="w-full p-3 border rounded" placeholder="Capacity" name="capacity" defaultValue={capacity} />
                            </div>
                        </div>

                        <button className="mt-4 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition">{status ? 'Updating...' : 'Update'}</button>
                        <p className="mt-2 text-gray-600">{info}</p>
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