import axios from 'axios';
import React, { useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth';

function ManagerSignup() {
    const { setUser } = useAuth();
    const signupForm = useRef();
    const hotelForm = useRef();
    const [info, setInfo] = useState('');
    const [spin, setSpin] = useState(false);
    const [step1, setStep1] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault();
        setSpin(true);
        setInfo('');
        const signupdata = new FormData(signupForm.current);
        if (!step1) {
            axios.post('/unique_manager', signupdata).then((res) => {
                if (res.data.status != 200) setInfo(res.data.message);
                else setStep1(true)
            }).finally(() => {
                setSpin(false);
            })
        } else {
            const hotelData = new FormData(hotelForm.current)
            axios.post('/signup_manager', { username: signupForm.current.username.value, email: signupForm.current.email.value, password: signupForm.current.password.value, role: 'manager' }).then((response) => {
                if (response.data.status === 200) {
                    hotelData.set('id', response.data.user.id && parseInt(response.data.user.id))
                    axios.post('/set_hotel', hotelData).then(hotelResponse => {
                        if (hotelResponse.data.status === 200) {
                            alert("Hotel Manager registered successfully.")
                            localStorage.setItem('auth', btoa(JSON.stringify(response.data.user)));
                            setUser(response.data.user);
                        } else {
                            setInfo('Failed to register hotel');
                        }
                    }).catch(error => setInfo(error.message)).finally(() => setSpin(false));
                } else {
                    setInfo(response.data.message);
                }
            }).finally(() => setSpin(false))
        }
    };

    return (
        <div className="p-8 rounded-md shadow-md md:w-md lg:max-w-xl mx-auto my-28">
            <h2 className="text-2xl font-bold text-center mb-8">Hotel Manager Signup</h2>
            <form onSubmit={handleSubmit} ref={signupForm} encType='multipart/form-data' className={step1 ? 'hidden' : "block"}>
                <input name='role' defaultValue='manager' className="hidden" type='password' />
                <div className="grid grid-cols-1 gap-4 my-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {spin ? (
                            <svg className="animate-spin mx-auto h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Continue'}
                    </button>
                    <p className="text-center">{info}</p>
                </div>
            </form>
            <form className={step1 ? 'block' : 'hidden'} onSubmit={handleSubmit} method='post' ref={hotelForm} encType='multipart/form-data'>
                <div className="grid grid-cols-1 gap-4 my-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Hotel Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
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
                            required
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
                        <label htmlFor="totalRooms" className="block text-sm font-medium text-gray-700">
                            Number of Rooms
                        </label>
                        <input
                            type="text"
                            id="totalRooms"
                            name="totalRooms"
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
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
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {spin ? (
                            <svg className="animate-spin mx-auto h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Signup'}
                    </button>
                </div>
                <p>{info}</p>
            </form>
        </div>
    );
}

export default ManagerSignup