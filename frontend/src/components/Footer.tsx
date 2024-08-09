import React from 'react'

function Footer() {
    return (
        <footer className='bg-green-400 text-center pt-14 px-2 md:px-0'>
            <div className="md:flex items-center justify-around pb-4">
                <div className="flex flex-col items-start justify-center gap-2">
                    <h3 className='text-2xl'>Trip Blaze</h3>
                    <p><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg> tripblaze@bd.com</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg> 019111111111</p>
                </div>
                <div className="flex flex-col items-start justify-center gap-2">
                    <a href="/#members">Our Latest Members</a>
                    <a href="/#offers">Our Grand Tours</a>
                    {/* <Link to="/my-bookings">Manage your bookings</Link> */}
                </div>
                <div className="">
                    {/* <img src={} alt="" className='w-full border p-5' /> */}
                </div>
            </div>
            <hr />
            <p className="text-center py-5">Copyright &copy; Trip Blaze</p>
        </footer>
    )
}

export default Footer