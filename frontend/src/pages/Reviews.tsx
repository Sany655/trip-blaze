import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ReviewCard({ title, bookingType, rating, review, name, src, date }) {
  return (
    <div className="mx-auto bg-white p-6 rounded-lg shadow-md flex my-4">
      <img className="w-24 h-24 mr-6" src={process.env.REACT_APP_img_path + src} alt={`${name}`} />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <p>Date : {date}</p>
          </div>
          <div className="text-right">
            <p className='capitalize'>{bookingType} review</p>
            <p className="text-sm font-bold text-yellow-600">{'★'.repeat(rating)}</p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-green-600 mt-4">{title}</h2>
        <p className="text-gray-700 mt-2">{review}</p>
      </div>
    </div>
  );
}

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [nothingFoundReview, setNothingFoundReview] = useState('')
  useEffect(() => {
    axios.get('/get_reviews').then((response) => {
      if (response.data.status == 200) setReviews(response.data.reviews)
      else setNothingFoundReview(response.data.message)
    }).catch((error) => {
      console.error(error)
    })
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Reviews</h1>
      <hr className='bg-green-500' />
      {nothingFoundReview ? <p className='my-36'>{nothingFoundReview}</p> : reviews.map((review, index) => (
        <ReviewCard key={index} {...review} />
      ))}
    </div>
  );
}

export default Reviews