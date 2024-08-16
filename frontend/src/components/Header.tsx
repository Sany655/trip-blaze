import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ProfileDropdown from './UI/ProfileDropdown.tsx';
import useAuth from '../hooks/useAuth.js';

function Header() {
  const [header, setHeader] = useState(false)
  const { user } = useAuth()
  return (
    <header className='bg-green-400'>
      <div className='container mx-auto flex md:flex-col lg:flex-row items-start md:items-center justify-between text-center'>
        <Link to={'/'}><img src="/images/logo.png" className='w-24' alt="" /></Link>
        <nav className={`${header ? "block" : "hidden"} md:block`}>
          <ul className='flex flex-col md:flex-row gap-4 p-4 mt-12 md:mt-0 md:flex-wrap'>
            <li><NavLink to={'/tours'}>Tours</NavLink></li>
            <li><NavLink to={'/hotels'}>Hotels</NavLink></li>
            <li><NavLink to={'/packages'}>Packages</NavLink></li>
            <li><NavLink to={'/transports'}>Transportation</NavLink></li>
            <li><NavLink to={'/blogs'}>Blogs</NavLink></li>
            <li><NavLink to={'/reviews'}>Reviews</NavLink></li>
            <li><NavLink to={'/about'}>About Us</NavLink></li>
            <li><NavLink to={'/contact'}>Contact Us</NavLink></li>
            {
              user?.username ? <li><ProfileDropdown /></li> : (
                <>
                  <li><NavLink to={'/signin'}>Signin</NavLink></li>
                  <li><NavLink to={'/signup'}>Signup</NavLink></li>
                </>
              )
            }
          </ul>
        </nav>
        <button className="bg-green-400 p-4 me-4 md:hidden" onClick={() => setHeader(!header)}><i className={`fa-solid ${!header ? "fa-caret-down" : "fa-caret-up"}`}></i></button>
      </div>
    </header>
  )
}

export default Header