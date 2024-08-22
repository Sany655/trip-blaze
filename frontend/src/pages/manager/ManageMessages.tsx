import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ManageMessages = () => {
  const [messages, setMessages] = useState([])
  const [msg, setMsg] = useState('')
  
  useEffect(() => {
    axios.get('/get_all_inbox').then(m => {
      if (m.data.status == 200) {
        setMessages(m.data.messages)
      } else {
        setMsg(m.data.message)
      }
    })
  }, [])

  return (
    msg ? (
      <div className="h-80 flex items-center justify-center" >
        <h1 className="text-center text-3xl">{msg}</h1>
      </div >
    ) : (
      <div className={`${messages.length < 4? 'h-80 my-20' : ''} max-w-xl mx-auto rounded-lg`}>
        {
          messages.map((chat, index) => (
            <Link to={chat.hotel.title+'/'+chat.user.username} key={index}>
              <div className={`flex items-center p-4 border-b hover:bg-gray-100 shadow-md ${chat.read ? 'bg-blue-50' : ''}`}>
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{chat.hotel?.title} by {chat.user.username}</span>
                    <span className="text-sm text-gray-500">{chat.messages[0].time}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {chat.messages[0].content}
                  </div>
                </div>
                {/* {chat.messages[0].read && (
                  <i className="fa fa-check-circle ml-2"></i>
                )} */}
              </div>
            </Link>
          ))
        }
      </div>
    )
  );
};

export default ManageMessages;
