import React from 'react'
import data from "../data.json"
import { Link } from 'react-router-dom';

function Blog() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Blogs</h1>
      <hr className='bg-green-500' />
      <div className="my-8">
        {data.blogs.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>
    </div>
  )
}

function BlogCard({ title, image, section }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4 md:flex">
      <img
        src={image}
        alt="Bangladesh Visa on Arrival"
        className=" h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-700 text-base">{section[0].content.slice(0,70)}... <Link to={`/blog/${title}`} className="text-blue-400">Read more</Link></p>
      </div>
    </div>
  );
}

export default Blog