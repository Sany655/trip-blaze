import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProfileDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex justify-center w-full rounded-full bg-green-900 p-2 text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-900"
                >
                    <i className='fa fa-user me-2'></i>
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
                        <Link
                            to="profile"
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                            role="menuitem"
                        >
                            <i className='me-3 fa fa-user'></i>
                            Profile
                        </Link>

                        <Link
                            to={'/message'}
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
                            <i className='me-3 fa fa-tag'></i>
                            My Booking
                        </Link>
                        <Link
                            to="saved"
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                            role="menuitem"
                        >
                            <i className='me-3 fa fa-heart'></i>
                            Saved
                        </Link>
                        <a
                            href="#signout"
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                            role="menuitem"
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
