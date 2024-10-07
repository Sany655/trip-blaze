import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Loading from '../components/UI/Loading.tsx';

function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const getBlogs = async () => {
    await axios.get('/get_blogs').then(response => {
      setBlogs(response.data);
    }).catch(error => console.error(error)).finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true)
    getBlogs();
  }, [])

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-12 text-green-500">Blogs</h1>
      <hr className='bg-green-500' />
      <div className="my-8">
        {loading ? <Loading /> : blogs.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>
    </div>
  )
}

function BlogCard({ title, image, content }) {
  return (
    // <Link to={`/blog/${title}`} className="text-blue-400"></Link>
    <Link to={`/blog/${title}`} className="bg-white shadow-md rounded-lg overflow-hidden mb-4 md:flex">
      <img
        src={process.env.REACT_APP_server_path + image}
        alt="Bangladesh Visa on Arrival"
        className="h-48 object-cover w-full md:w-1/4"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-700 text-base">{content.slice(0, 70)}...</p>
      </div>
    </Link>
  );
}

export default Blog