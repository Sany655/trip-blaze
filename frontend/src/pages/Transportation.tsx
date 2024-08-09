import React, { useState } from 'react'
import data from "../data.json"

function Transport({ transport }) {
  return (
      <div className="max-w-xl mx-auto bg-white border rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center justify-evenly md:justify-between mb-4">
          <div className="md:flex md:items-center">
              <div className='flex flex-row md:flex-col items-center md:items-stretch justify-between'>
                  <h3 className="text-lg font-bold text-green-800">{transport.provider}</h3>
                  <p className="text-sm text-green-500">{transport.vehicleNumber}</p>
              </div>
          </div>

          <div className="flex items-center justify-center md:justify-between my-2 md:my-0">
              <div className="text-center">
                  <p className="text-sm text-green-500">{transport.from}</p>
                  <p className="text-lg font-semibold text-green-800">{transport.departureTime}</p>
              </div>

              <div className="flex items-center justify-center">
                  <span className="text-green-500 mx-2">→</span>
                  <div className="text-center">
                      <p className="text-sm text-green-500">{transport.to}</p>
                      <p className="text-lg font-semibold text-green-800">{transport.arrivalTime}</p>
                  </div>
              </div>
          </div>

          <div className="text-right flex md:flex-col flex-row justify-between items-center">
              <p className="text-lg font-bold text-yellow-600">{transport.price} USD</p>
              <button className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                  Select
              </button>
          </div>
      </div>
  )
}

function Transportation() {
  return (
    <div className="container mx-auto p-6 bg-white my-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Transport Booking</h1>
      {
        data.transports?.map((transport,i) => <Transport transport={transport} key={i}/>)
      }
    </div>
  );
}



export default Transportation