import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaYoutube, FaTwitter, FaPinterest, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='bg-veryDarkBlue'>
      {/* Flex Container */}
      <div className='container flex flex-col-reverse justify-between px-6 py-10 mx-auto space-y-8 md:flex-row md:space-y-0'>
        {/* Logo and social links container */}
        <div className='flex flex-col-reverse items-center justify-between space-y-12 md:flex-col md:space-y-0 md:items-start'>
          <div className='mx-auto my-6 text-center text-white md:hidden'>
            Copyright © 2022, All Rights Reserved
          </div>
          {/* Logo */}
          <div>
            <h1 className='text-white text-2xl font-bold'>AdrenaLux</h1>
          </div>
          {/* Social Links Container */}
          <div className='flex justify-center space-x-4'>
            <Link to='#' className='text-white text-2xl hover:text-brightRed'>
              <FaFacebook />
            </Link>
            <Link to='#' className='text-white text-2xl hover:text-brightRed'>
              <FaYoutube />
            </Link>
            <Link to='#' className='text-white text-2xl hover:text-brightRed'>
              <FaTwitter />
            </Link>
            <Link to='#' className='text-white text-2xl hover:text-brightRed'>
              <FaPinterest />
            </Link>
            <Link to='#' className='text-white text-2xl hover:text-brightRed'>
              <FaInstagram />
            </Link>
          </div>
        </div>
        {/* List Container */}
        <div className='flex justify-around space-x-32'>
          <div className='flex flex-col space-y-3 text-white'>
            <Link to='#' className='hover:text-brightRed'>
              Home
            </Link>
            <Link to='#' className='hover:text-brightRed'>
              Pricing
            </Link>
            <Link to='#' className='hover:text-brightRed'>
              Products
            </Link>
            <Link to='#' className='hover:text-brightRed'>
              About
            </Link>
          </div>
          <div className='flex flex-col space-y-3 text-white'>
            <Link to='#' className='hover:text-brightRed'>
              Careers
            </Link>
            <Link to='#' className='hover:text-brightRed'>
              Community
            </Link>
            <Link to='#' className='hover:text-brightRed'>
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Input Container */}
        <div className='flex flex-col justify-between'>
          <form>
            <div className='flex space-x-3'>
              <input
                type='text'
                className='flex-1 px-4 rounded-full focus:outline-none'
                placeholder='Updated in your inbox'
              />
              <button className='px-6 py-2 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none'>
                Go
              </button>
            </div>
          </form>
          <div className='hidden text-white md:block'>
            Copyright © 2022, All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
