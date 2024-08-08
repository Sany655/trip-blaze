import React from 'react'
import tours from "../data.json"
import TourCard from '../components/TourCard.tsx'

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

export default Tours