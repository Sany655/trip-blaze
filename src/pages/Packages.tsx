import React from 'react'
import data from "../data.json"
import TourCard from '../components/TourCard.tsx'

function Packages() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Packages</h1>
      <hr className='bg-green-500' />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        <div className="flex flex-col">
          <h2 className="text-2xl text-center text-green-400">Family Package</h2>
          {
            data.places.slice(0,2).map((place,index) => TourCard(place,index))
          }
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl text-center text-green-400">Couple Package</h2>
          {
            data.places.slice(2,4).map((place,index) => TourCard(place,index))
          }
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl text-center text-green-400">Solo Package</h2>
          {
            data.places.slice(4,6).map((place,index) => TourCard(place,index))
          }
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl text-center text-green-400">Group Package</h2>
          {
            data.places.slice(6,8).map((place,index) => TourCard(place,index))
          }
        </div>
      </div>
    </div>
  )
}

export default Packages