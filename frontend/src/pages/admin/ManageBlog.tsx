import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function ManageBlog() {
    const blogForm = useRef()
    const [info, setInfo] = useState('')
    const [blogs, setBlogs] = useState([])
    const [status, setStatus] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isBlogOpen, setIsBlogOpen] = useState(false)

    const handleSubmit = async (e) => {
        setInfo('')
        setStatus(true)
        e.preventDefault()
        const formData = new FormData(blogForm.current)
        axios.post('/set_blog', formData).then(response => {
            if (response.data.status === 200) {
                getBlogs();
                setInfo(response.data.message);
                blogForm.current.reset();
            } else {
                setInfo(response.data.message);
            }
        }).catch(error => setInfo(error.message)).finally(() => setStatus(false));
    }

    const getBlogs = async () => {
        await axios.get('/get_blogs').then(response => {
            setBlogs(response.data);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getBlogs();
    }, [])

    return (
        <section className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <h1 className="text-3xl font-bold text-center my-8">Manage Blogs</h1>
                <div className='flex gap-4'>
                    <button className="bg-green-500 py-2 px-6" onClick={() => { setIsOpen(!isOpen); setInfo("") }}>
                        Create Blog
                        <i className={`fa ${isOpen ? "fa-caret-up" : "fa-caret-down"} ms-4`}></i>
                    </button>
                </div>
            </div>
            <form className={`flex flex-col items-center gap-2 mb-8 shadow py-14 shadow-lg ${isOpen ? "block" : "hidden"}`} onSubmit={handleSubmit} method='post' ref={blogForm} encType='multipart/form-data'>
                <h3 className="text-2xl">Create Blog</h3>
                <input required type="text" className="w-full md:w-1/3 p-4  m-2 border" placeholder='Title' name='title' />
                <input required type="file" className="w-full md:w-1/3 p-4  m-2" name='image' />
                <textarea required type="text" className="w-full md:w-1/3 p-4  m-2 border" placeholder='Content' name='content'></textarea>
                <button className="bg-green-500 px-8 py-2 focus:bg-green-700">{status ? 'Submitting...' : 'Submit'}</button>
                <p>{info}</p>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-14">
                {blogs.map((blog, index) => (
                    <BlogCard key={index} {...blog} getBlogs={getBlogs} />
                ))}
            </div>
        </section>
    )
}

const BlogCard = ({ image, title, content, getBlogs }, index?) => {
    const handleDeleteBlog = async () => {
        if (window.confirm(`Are you sure you want to delete ${title}?`)) {
            await axios.delete(`/delete_blog/${title}`).then(response => {
                if (response.status === 200) {
                    getBlogs();
                } else {
                    alert('Failed to delete blog');
                }
            }).catch(error => alert(error.message));
        }
    }
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4 md:flex">
            <img
                src={process.env.REACT_APP_server_path + image}
                alt="Bangladesh Visa on Arrival"
                className="h-48 object-cover w-full md:w-1/2"
            />
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="text-gray-700 text-base">{content.slice(0, 70)}... <Link to={`/blog/${title}`} className="text-blue-400">Read more</Link></p>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleDeleteBlog}>Delete</button>
            </div>
        </div>
    );
};

export default ManageBlog