import axios from 'axios';
import React, { useRef, useState } from 'react'
import useAuth from '../hooks/useAuth';

function Signup() {
    const { setUser } = useAuth();
    const signupForm = useRef();
    const [info, setInfo] = useState('');
    const [spin, setSpin] = useState(false);

    const handleSubmit = (event) => {
        setSpin(true);
        setInfo('');
        event.preventDefault();
        const data = new FormData(signupForm.current);
        axios.post('/signup', data).then((response) => {
            if (response.data.status === 200) {
                localStorage.setItem('auth', btoa(JSON.stringify(response.data.user)));
                signupForm.current.reset();
                setUser(response.data.user);
            } else {
                setInfo(response.data.message);
            }
        }).catch((error) => {
            console.error(error); // Handle failed signup
            setInfo(error.message);
        }).finally(() => setSpin(false));;
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 rounded-md shadow-md md:w-2/3 lg:w-1/4 mx-auto my-28" ref={signupForm} encType='multipart/form-data'>
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            <input name='role' defaultValue={'user'} className="hidden" type='password' />
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
                    User Email
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
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    User Picture
                </label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"

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
                ) : 'Sign Up'}
            </button>
            <p className="text-center">{info}</p>
        </form>
    );
}

export default Signup