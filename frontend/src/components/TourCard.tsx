import React from 'react'
import { Link, redirect } from 'react-router-dom';

const TourCard = ({ title, price, days, location, src, type },index?) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-4" key={index}>
            <img src={src} alt={title} className="w-full rounded-lg mb-4" />
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            {/* <p className="text-gray-700 mb-4">{description}</p> */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">{days} DAY &nbsp;</span>
                <span className="text-gray-500">{price} USD</span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-green-500 font-bold">{location}</span>
                <Link to={`/booking/${type}/${title}`} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Book now</Link>
            </div>
        </div>
    );
};

export default TourCard