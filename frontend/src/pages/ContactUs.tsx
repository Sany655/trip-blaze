import React, { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

function ContactUs() {
    const form = useRef();
    const [info, setInfo] = useState("")

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs
            .sendForm(
                process.env.REACT_APP_Service_ID,
                process.env.REACT_APP_Template_ID,
                form.current,
                process.env.REACT_APP_public_key
            )
            .then((result) => {
                setInfo("We got your message!")
                form.current.reset(); 
            })
            .catch((error) => {
                console.log(error);
                setInfo("Something went wrong! try again later.")
            });
    };

    useEffect(() => {
        emailjs.init({
            publicKey: process.env.REACT_APP_public_key,
        })
    }, [])

    return (
        <section className="bg-gray-900 flex justify-center items-center text-center" style={{ height: "70vh" }}>
            <div>
                <h2 className="text-2xl font-bold mb-1 text-green-500">Contact Us</h2>
                <small className='mb-4 block text-green-700'>we are here to provide you</small>
                <form className='md:flex flex-col gap-4 mx-auto' style={{ width: "40vw" }} ref={form} onSubmit={sendEmail}>
                    <input name='from_name' type="text" placeholder='Name' className='p-2 border-2 border-green-400 rounded' required />
                    <input name='from_email' type="email" placeholder='Email Address' className='p-2 border-2 border-green-400 rounded' required />
                    <textarea name='message' placeholder='Write your message' className='p-2 border-2 border-green-400 rounded' required></textarea>
                    <button className="bg-green-500 font-bold text-black p-4">Submit</button>
                    <small className='text-white'>{info}</small>
                </form>
            </div>
        </section>
    )
}

export default ContactUs