import React from 'react'

function ContactUs() {
    return (
        <section className="bg-gray-900 text-white flex justify-center items-center text-center" style={{ height: "70vh" }}>
            <div>
                <h2 className="text-2xl font-bold mb-1 text-green-500">Contact Us</h2>
                <small className='mb-4 block text-green-700'>we are here to provide you</small>
                <form className='md:flex flex-col gap-4 mx-auto' style={{ width: "40vw" }}>
                    <input type="text" placeholder='Name' className='p-2 border-2 border-green-400 rounded' />
                    <input type="email" placeholder='Email Address' className='p-2 border-2 border-green-400 rounded' />
                    <input type="number" placeholder='Phone number' className='p-2 border-2 border-green-400 rounded' />
                    <textarea placeholder='Write your message' className='p-2 border-2 border-green-400 rounded'></textarea>
                    <button className="bg-green-500 font-bold text-black p-4">Submit</button>
                </form>
            </div>
        </section>
    )
}

export default ContactUs