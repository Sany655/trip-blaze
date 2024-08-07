import React from 'react'
import tours from "../data.json"

function Tours() {

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Tours</h1>
      <hr className='bg-green-500' />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.places.map((tour, index) => (
          <TourCard key={index} {...tour} />
        ))}
      </div>
    </div>
  )
}

export const TourCard = ({ title, price, days, location, src }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4">
      <img src={src} alt={title} className="w-full rounded-lg mb-4" />
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {/* <p className="text-gray-700 mb-4">{description}</p> */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-500">{days} DAY &nbsp;</span>
        <span className="text-gray-500">{price} USD</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-green-500 font-bold">{location}</span>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Book now</button>
      </div>
    </div>
  );
};


export default Tours