import React from 'react'

function ReviewCard({ author, location, date, tour, rating, reviewText, reviewLink }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-lg font-semibold">{author}</h4>
          <p className="text-gray-500 text-sm">{location}, {date}</p>
        </div>
        <div className="flex items-center">
          <p className="text-gray-500 text-sm">{tour}</p>
          <div className="ml-2">
            {[...Array(rating)].map((_, i) => (
              <span key={i} className="text-yellow-500">★</span>
            ))}
            {[...Array(5 - rating)].map((_, i) => (
              <span key={i} className="text-gray-300">★</span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-base mb-4">{reviewText}</p>
    </div>
  );
}

function Reviews() {
  const reviews = [
    {
      author: 'Roger Williams',
      location: 'Salisbury, UK',
      date: 'February 7, 2024',
      tour: 'Bangladesh Photography Tour',
      rating: 5,
      reviewText:
        'The 12-day photography tour covered a lot of ground. I particularly enjoyed the visit to the Chittagong hill tribes and to Cox Bazar. Visited fascinating different markets, the brick kilns, a primary school, early morning fishermen, river and lake trips. Fascinating insights as to how the people live and work.',
      reviewLink: '#', // Replace with actual review link
    },
    {
      author: 'Svetlana Suslova',
      location: 'Moscow, Russia',
      date: 'February 5, 2024',
      tour: 'Bangladesh Photography Tour',
      rating: 4,
      reviewText:
        'A wonderful trip with Nijhoom tours. We have visited shipyards, fishing ports, brick factory, various local markets, villages of different tribes. We had boat rides in the beautiful rivers. We stopped by the school, we learnt, how villagers cultivated and traded rice, how they fished. People were wonderful.',
      reviewLink: '#', // Replace with actual review link
    },
    {
      author: 'Svetlana Suslova',
      location: 'Moscow, Russia',
      date: 'February 5, 2024',
      tour: 'Bangladesh Photography Tour',
      rating: 4,
      reviewText:
        'A wonderful trip with Nijhoom tours. We have visited shipyards, fishing ports, brick factory, various local markets, villages of different tribes. We had boat rides in the beautiful rivers. We stopped by the school, we learnt, how villagers cultivated and traded rice, how they fished. People were wonderful.',
      reviewLink: '#', // Replace with actual review link
    },
    {
      author: 'Svetlana Suslova',
      location: 'Moscow, Russia',
      date: 'February 5, 2024',
      tour: 'Bangladesh Photography Tour',
      rating: 4,
      reviewText:
        'A wonderful trip with Nijhoom tours. We have visited shipyards, fishing ports, brick factory, various local markets, villages of different tribes. We had boat rides in the beautiful rivers. We stopped by the school, we learnt, how villagers cultivated and traded rice, how they fished. People were wonderful.',
      reviewLink: '#', // Replace with actual review link
    },
    {
      author: 'Svetlana Suslova',
      location: 'Moscow, Russia',
      date: 'February 5, 2024',
      tour: 'Bangladesh Photography Tour',
      rating: 4,
      reviewText:
        'A wonderful trip with Nijhoom tours. We have visited shipyards, fishing ports, brick factory, various local markets, villages of different tribes. We had boat rides in the beautiful rivers. We stopped by the school, we learnt, how villagers cultivated and traded rice, how they fished. People were wonderful.',
      reviewLink: '#', // Replace with actual review link
    },
    {
      author: 'Svetlana Suslova',
      location: 'Moscow, Russia',
      date: 'February 5, 2024',
      tour: 'Bangladesh Photography Tour',
      rating: 4,
      reviewText:
        'A wonderful trip with Nijhoom tours. We have visited shipyards, fishing ports, brick factory, various local markets, villages of different tribes. We had boat rides in the beautiful rivers. We stopped by the school, we learnt, how villagers cultivated and traded rice, how they fished. People were wonderful.',
      reviewLink: '#', // Replace with actual review link
    },
    // Add more reviews here
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-8 text-center">
        Rating & Reviews
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  );
}

export default Reviews