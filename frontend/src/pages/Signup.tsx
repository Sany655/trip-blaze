import React, { useState } from 'react'

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData); // Handle form submission here
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 rounded-md shadow-md md:w-2/3 lg:w-1/4 mx-auto my-28">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.name}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-green-500"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Sign Up
            </button>
        </form>
    );
}

export default Signup