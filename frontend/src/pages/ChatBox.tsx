import React, { useEffect, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatBox: React.FC = () => {
    const [inbox, setInbox] = useState({});
    const { socket, user } = useAuth()
    const { title } = useParams();
    const msgFormRef = useRef()

    function getInbox() {
        axios.get('/get_messages?title=' + title + '&user=' + user.username).then(response => {
            if (response.data.status === 200) setInbox(response.data.messages);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getInbox()
        socket.on('receive_message', () => {
            getInbox()
        });

        return () => {
            socket.off('receive_message');
        };
    }, [])

    const handleSubmit = e => {
        e.preventDefault()
        const msg = msgFormRef.current.user_message.value;
        const data = {
            hotel: {
                location: inbox.hotel.location, title: inbox.hotel.title, date: inbox.hotel.date, status: inbox.hotel.status, room: inbox.hotel.room, price: inbox.hotel.price
            },
            user: {
                username: user.username,
                image: user.image,
                email: user.email
            },
            messages: [
                {
                    sender: 'user',
                    content: msg,
                    read: false,
                    time: new Date().toLocaleTimeString()
                }
            ]
        }
        axios.post('/set_message', data).then((response) => {
            if (response.data.status === 200) {
                msgFormRef.current.reset();
                getInbox()
            } else {
                alert(response.data.message)
            }
        })
    }

    return (
        <div className="flex flex-col w-full mx-auto max-w-xl bg-white shadow-lg rounded-lg ">
            {/* hotel profile */}
            <div className="flex flex-col justify-between bg-white p-4 border shadow-md">
                <h2 className="text-2xl font-bold mb-4">{inbox?.hotel?.title}</h2>
                <p className="mb-4"><span className='text-green-600'>{inbox?.hotel?.location}</span> Hotel</p>
                <div className="flex justify-between items-center mb-2">
                    <span className="">Booked at: {inbox?.hotel?.date}</span>
                    <span className={`text-gray-500 p-2 text-white rounded-full ${inbox?.hotel?.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>{inbox?.hotel?.status}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-green-500 font-bold">Rooms : {inbox?.hotel?.room}</span>
                    <span className="text-green-500 font-bold">{inbox?.hotel?.price} USD</span>
                </div>
            </div>

            {/* Chat Messages */}
            <div className={`flex flex-col-reverse space-y-2 overflow-y-auto mb-4 p-4`} style={{ 'height': window.screen.height - 570 + 'px' }}>
                {inbox.messages?.map((m, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`${m.sender === user.role
                                ? 'self-end bg-blue-500 text-white'
                                : 'self-start bg-gray-300 text-black'
                                } px-4 py-2 rounded-lg max-w-xs break-words`}
                        >
                            {m.content}
                        </div>
                        <small className='mx-4 text-xs text-center'>{m.time}</small>
                    </React.Fragment>
                ))}
            </div>

            {/* Input Field */}
            <form className="flex items-center space-x-2 p-4" onSubmit={handleSubmit} ref={msgFormRef}>
                <input
                    required
                    name='user_message'
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
