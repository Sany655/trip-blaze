import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/useAuth';
function ManagerSignin() {
    const signinForm = useRef();
    const { setUser } = useAuth();
    const [info, setInfo] = useState()
    const [spin, setSpin] = useState(false)

    const handleLogin = (event) => {
        setSpin(true); // Show loading spinner
        setInfo(null); // Clear any previous info message
        event.preventDefault();
        const formData = new FormData(signinForm.current);
        axios.post('/signin', formData).then((response) => {
            if (response.data.status === 200) {
                localStorage.setItem('auth', btoa(JSON.stringify(response.data.user)));
                setUser(response.data.user);
                signinForm.current.reset();
            } else {
                setInfo(response.data.message);
            }
        }).catch((error) => {
            setInfo(error.message); // Handle failed login
        }).finally(() => setSpin(false));
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8 rounded-md shadow-md md:w-2/3 lg:w-1/4 mx-auto my-20 md:my-44" ref={signinForm}>
            <h2 className="text-2xl font-bold text-center">Hotel Manager Signin</h2>
            <input name='role' defaultValue={'manager'} className="hidden" type='password' />
            <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                    Email or Username
                </label>
                <input
                    type="text"
                    id="user"
                    name="user"
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
                ) : 'Sign In'}
            </button>
            <p className="text-center">{info}</p>
        </form>
    );
}

export default ManagerSignin