import React from 'react'
import tours from "../data.json"
import TourCard from '../components/TourCard.tsx';

function Hotels() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Hotels</h1>
      <hr className='bg-green-500' />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.hotels.map((hotel, index) => (
          <TourCard key={index} {...hotel} />
        ))}
      </div>
    </div>
  )
}


// const HotelCard = ({ title, description, price, days, location, src, type }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 m-4">
//       <img src={src} alt={title} className="w-full rounded-lg mb-4" />
//       <h2 className="text-2xl font-bold mb-4">{title}</h2>
//       {/* <p className="text-gray-700 mb-4">{description}</p> */}
//       <div className="flex justify-between items-center mb-2">
//         <span className="text-gray-500">
//           {days} DAY &nbsp;
//           {price}
//         </span>
//         <span className="text-green-500 font-bold">{location}</span>
//       </div>
//       <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Book now</button>
//     </div>
//   );
// };

export default Hotels