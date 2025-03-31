import React from "react";
import { FaFacebook, FaYoutube, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <div className="fixed flex justify-center space-x-6 mt-10">
      <FaFacebook className="text-2xl cursor-pointer hover:text-gray-400" />
      <FaYoutube className="text-2xl cursor-pointer hover:text-gray-400" />
      <FaLinkedin className="text-2xl cursor-pointer hover:text-gray-400" />
      <FaInstagram className="text-2xl cursor-pointer hover:text-gray-400" />
    </div>
  );
}