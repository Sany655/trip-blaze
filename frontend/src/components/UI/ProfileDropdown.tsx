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
                    {/* <i className='fa fa-user me-2'></i> */}
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
                            ) : (
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
                                        to="admin/hotels"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-hotel'></i>
                                        Manage Hotels
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
                                        to="admin/transports"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-bus'></i>
                                        Manage Transportation
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
                                    <Link
                                        to="admin/messages"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-message'></i>
                                        Messages
                                    </Link>
                                    {/* <Link
                                        to="admin/reviews"
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                                        role="menuitem"
                                    >
                                        <i className='me-3 fa fa-star'></i>
                                        Manage Reviews
                                    </Link> */}
                                </>
                            )
                        }
                        <a
                            href="#"
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                            role="menuitem"
                            onClick={handleLogout}
                        >
                            <i className="me-3 fa-solid fa-right-from-bracket"></i>
                            Sign Out
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
