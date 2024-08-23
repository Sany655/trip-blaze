import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, redirect } from 'react-router-dom';
import { io } from "socket.io-client";
export const AuthContext = createContext()

const socket = io(process.env.REACT_APP_server_path);

export function AuthProvider({ children }) {
    const ls = localStorage.getItem('auth')
    const [user, setUser] = useState(ls ? JSON.parse(atob(ls)) : null);
    useEffect(() => {
        const saved = ls?JSON.parse(atob(ls)):null;
        if (saved) {
            setUser(saved);
        }
    }, [])

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('auth');
    }

    const handleBooking = async (booking) => {
        if (user?.username && user.role === 'user') {
            booking.user = user.username;
            axios.post('/set_booking', booking).then(response => {
                if (response.data.status === 200) alert(response.data.message);
                else alert('Something went wrong while booking. Please try again later.');
            }).catch(error => alert(error.message))
        } else if (user?.username && user.role !== 'user') {
            alert('Only users can make bookings.');
        } else {
            alert('Please sign in to make a booking.');
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, handleLogout, handleBooking, socket }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext)
};

export default useAuth;