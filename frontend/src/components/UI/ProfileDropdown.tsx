import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProfileDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { handleLogout, user } = useAuth();

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex justify-center w-full rounded-full bg-green-900 p-2 text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-900"
                >
                    <img src={process.env.REACT_APP_server_path + user.image} className="h-4 bg-green-500 rounded-full me-2" />
                    <i className={`fa ${isOpen ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                </button>
            </div>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="py-1" role="none">
                        <p
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                            role="menuitem"
                        >
                            <i className='me-3 fa fa-user'></i>
                            {user.username}
                        </p>
                        <hr />
                        {
                            user.role === "user" ? (
                                <>
                                    <Link
                                        to={'/messages'}
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-message'></i>
                                        Message
                                    </Link>
                                    <Link
                                        to="my-bookings"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-calendar-check'></i>
                                        My Booking
                                    </Link>
                                </>
                            ) : user.role === 'admin' ? (
                                <>
                                    <Link
                                        to="admin/tours"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-globe'></i>
                                        Manage Tour
                                    </Link>
                                    <Link
                                        to="admin/packages"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-gift'></i>
                                        Manage Packages
                                    </Link>
                                    <Link
                                        to="admin/blogs"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-blog'></i>
                                        Manage Blogs
                                    </Link>
                                    <Link
                                        to="admin/bookings"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-calendar-check'></i>
                                        Manage Bookings
                                    </Link>
                                </>
                            ) : user.role === 'hotel-manager' ? (
                                <>
                                    <Link
                                        to="hotel-manager/hotel"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className="me-3 fa-solid fa-hotel"></i>
                                        My Hotel
                                    </Link>
                                    <Link
                                        to="hotel-manager/bookings"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-calendar-check'></i>
                                        Manage Bookings
                                    </Link>
                                    <Link
                                        to="hotel-manager/messages"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-message'></i>
                                        Messages
                                    </Link>
                                </>
                            ) : user.role === 'transport-manager' && (
                                <>
                                    <Link
                                        to="transport-manager/transports"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-bus'></i>
                                        Manage Transportation
                                    </Link>
                                    <Link
                                        to="transport-manager/bookings"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-calendar-check'></i>
                                        Manage Bookings
                                    </Link>
                                </>
                            )
                        }
                        <span
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center cursor-pointer"
                            role="menuitem"
                            onClick={handleLogout}
                        >
                            <i className="me-3 fa-solid fa-right-from-bracket"></i>
                            Sign Out
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
