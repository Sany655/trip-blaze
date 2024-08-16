import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import data from "../data.json"
import axios from 'axios';

function Post() {
    const { title } = useParams();
    const [post, setPost] = useState([])

    useEffect(() => {
        axios.get('/get_blog/' + title).then(response => {
            setPost(response.data);
        }).catch(error => console.error(error));
    },[])

    return (
        <section className="container mx-auto my-16">
            <h1 className="text-5xl font-bold">{post?.title}</h1>
            <img src={process.env.REACT_APP_server_path+post?.image} alt={post?.title} className='my-14' />
            <pre style={{whiteSpace: "pre-wrap"}}>{post?.content}</pre>
        </section>
    )
}

export default Post