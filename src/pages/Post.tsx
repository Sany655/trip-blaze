import React from 'react'
import { useParams } from 'react-router-dom'
import data from "../data.json"

function Post() {
    const { title } = useParams();
    const post = data.blogs.find(p => p.title === title)
    return (
        <section className="container mx-auto my-16">
            <h1 className="text-3xl font-bold">{post?.title}</h1>
            <img src={post?.image} alt={post?.title} className='my-14' />
            {
                post?.section?.map((sec, i) => {
                    return (
                        <section>
                            <h2 className="text-xl font-bold mb-2">{sec.heading}</h2>
                            <p className='mb-4'>{sec.content}</p>
                        </section>
                    )
                })
            }
            <p>{post?.content}</p>
        </section>
    )
}

export default Post