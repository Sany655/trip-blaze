import React from 'react'

function MyBookings() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-900">My Bookings</h1>
                    <div className="flex justify-center mt-4">
                        <button className="px-4 py-2 bg-blue-900 text-white rounded-l-lg">
                            All
                        </button>
                        <button className="px-4 py-2 bg-white text-blue-900 border border-blue-900 rounded-r-lg">
                            Pending
                        </button>
                    </div>
                </div>

                <div className="flex">
                    {/* Filters Sidebar */}
                    <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                            <button className="text-sm text-blue-600">Reset</button>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700">Product Type</h3>
                            <div className="mt-2 space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-blue-600" />
                                    <span className="ml-2 text-gray-700">Flight</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-blue-600" />
                                    <span className="ml-2 text-gray-700">Hotel</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-blue-600" />
                                    <span className="ml-2 text-gray-700">Tour</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Year</h3>
                            <div className="mt-2 space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-blue-600" />
                                    <span className="ml-2 text-gray-700">2024</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-blue-600" />
                                    <span className="ml-2 text-gray-700">2023</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-blue-600" />
                                    <span className="ml-2 text-gray-700">2022</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-blue-600" />
                                    <span className="ml-2 text-gray-700">2021</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-blue-600" />
                                    <span className="ml-2 text-gray-700">2020</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-3/4 bg-white p-8 rounded-lg shadow-md ml-8 flex flex-col items-center justify-center">
                        <img
                            src="https://via.placeholder.com/200"
                            alt="No bookings illustration"
                            className="mb-8"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">No bookings yet</h2>
                        <p className="text-gray-600 text-center mb-6">
                            Start your travel planning for your next adventure today
                        </p>
                        <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyBookings