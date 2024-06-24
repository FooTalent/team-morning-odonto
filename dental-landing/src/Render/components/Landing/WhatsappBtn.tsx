import React from 'react'
import { IoLogoWhatsapp } from "react-icons/io";
import { Link } from 'react-router-dom';

const WhatsappBtn = () => {
  return (
    <div className='fixed bottom-5 right-5 xl:bottom-[199px] xl:right-[106px] '>
      <a href="https://whatsapp.com" target='_blank'>
        <IoLogoWhatsapp className='text-5xl xl:text-[92px] text-[#1FAF38] hover:text-green-500'/>
      </a>
    </div>

  )
}

export default WhatsappBtn