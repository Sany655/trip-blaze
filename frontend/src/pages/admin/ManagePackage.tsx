import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react';

function ManagePackage() {
    const packageForm = useRef()
    const [info, setInfo] = useState('')
    const [packages, setPackages] = useState([])
    const [status, setStatus] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (e) => {
        setInfo('')
        setStatus(true)
        e.preventDefault()
        const formData = new FormData(packageForm.current)
        axios.post('/set_package', formData).then(response => {
            if (response.status === 200) {
                setInfo(response.data.message);
                packageForm.current.reset();
                getPackages();
            } else {
                setInfo('Failed to set package');
            }
        }).catch(error => setInfo(error)).finally(() => setStatus(false));
    }

    const getPackages = async () => {
        await axios.get('/get_packages').then(response => {
            setPackages(response.data);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getPackages();
    }, [])

    return (
        <section className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <h1 className="text-3xl font-bold text-center my-8">Manage Packages</h1>
                <div className='flex gap-4'>
                    <button className="bg-green-500 py-2 px-6" onClick={() => { setIsOpen(!isOpen); setInfo("") }}>
                        Create Package
                        <i className={`fa ${isOpen ? "fa-caret-up" : "fa-caret-down"} ms-4`}></i>
                    </button>
                </div>
            </div>
            <form className={`flex flex-col items-center gap-2 mb-8 shadow py-14 shadow-lg ${isOpen ? "block" : "hidden"}`} onSubmit={handleSubmit} method='post' ref={packageForm} encType='multipart/form-data'>
                <h3 className="text-2xl">Create Package</h3>
                <input required type="text" className="md:w-1/3 p-4 my-2 border" placeholder='Title' name='title' />
                <select name="type" id="type" name="type" className="md:w-1/3 p-4 my-2 border" required>
                    <option value="">Chose package type</option>
                    <option value="Solo">Solo</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                    <option value="Couple">Couple</option>
                </select>
                <input required type="number" className="md:w-1/3 p-4 my-2 border" placeholder='Price' name='price' />
                <input required type="number" className="md:w-1/3 p-4 my-2 border" placeholder='Days' name='days' />
                <input required type="text" className="md:w-1/3 p-4 my-2 border" placeholder='Location' name='location' />
                <input required type="file" className="md:w-1/3 my-2" name='src' />
                <input required type="text" className="hidden" name='type' defaultValue={'package'} />
                <textarea required name="description" id="" className="md:w-1/3 p-4 my-2 border" placeholder='Description'></textarea>
                <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Submitting...' : 'Submit'}</button>
                <p>{info}</p>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
                {packages.map((packageTour, index) => (
                    <PackageCard key={index} {...packageTour} getPackages={getPackages} />
                ))}
            </div>
        </section>
    )
}

const PackageCard = ({ title, price, days, location, src, getPackages, type }) => {
    const handleDeletePackage = async () => {
        if (window.confirm(`Are you sure you want to delete ${title}?`)) {
            await axios.delete(`/delete_package/${title}`).then(response => {
                if (response.status === 200) {
                    getPackages();
                } else {
                    alert('Failed to delete package');
                }
            }).catch(error => alert(error.message));
        }
    }
    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-4 flex flex-col justify-between">
            <img src={process.env.REACT_APP_server_path + src} alt={title} className="w-full rounded-lg mb-4" />
            <div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="mb-4"><span className='text-green-600'>{type}</span> Package</p>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">{days} DAY &nbsp;</span>
                    <span className="text-gray-500">{price} USD</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-green-500 font-bold">{location}</span>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleDeletePackage}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ManagePackage