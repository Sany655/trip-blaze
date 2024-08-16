import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

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
            <div className="flex flex-col md:flex-row items-center justify-between">
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
                {/* <input required type="text"  placeholder='Title' name='type' /> */}
                <select name="type" className="md:w-1/3 p-4 my-2 border">
                    <option value="">Chose a transportation</option>
                    <option value="bus">Bus</option>
                    <option value="flight">Flight</option>
                    <option value="train">Train</option>
                </select>
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
    return (
        <div className="border rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center justify-evenly md:justify-between mb-4">
            <div className="md:flex md:items-center">
                <div className='flex flex-row md:flex-col items-center md:items-stretch justify-between'>
                    <h3 className="text-lg font-bold text-green-800">{provider}</h3>
                    <p className="text-sm text-green-500">{vehicleNumber}</p>
                </div>
            </div>

            <div className="flex items-center justify-center md:justify-between my-2 md:my-0">
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

            <div className="text-right flex md:flex-col flex-row justify-between items-center">
                <p className="text-lg font-bold text-yellow-600">{price} USD</p>
                <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600" onClick={handleDeleteTransport}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ManageTransport