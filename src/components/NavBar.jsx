import React from "react";
import sukuLogo from "../assets/suku logo variant.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const MotionLink = motion(Link);

const NavBar = () => {
  return (
    <header>
      <div className="flex mb-4 items-center justify-between p-2 overflow-hidden">
        {/* Logo */}
        <img
          src={sukuLogo}
          alt="suku-logo"
          className="h-10 w-auto md:h-20 lg:h-24 object-contain rounded-lg"
        />

        {/* Sign In Button */}
        <MotionLink
          to="/login"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2 bg-[#2989de] text-white font-semibold rounded-full hover:bg-[#2989de]/80 shadow-md transition-all duration-200"
        >
          Sign In
          <FaArrowRight className="text-white" />
        </MotionLink>
      </div>
    </header>
  );
};

export default NavBar;
