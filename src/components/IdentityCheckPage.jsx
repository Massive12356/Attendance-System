import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "../assets/Background1.jpg";
import { FaArrowLeft, FaUsers, FaUser } from "react-icons/fa";

const MotionLink = motion(Link);

const IdentityCheckPage = () => {
  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-6 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Back Button */}
      <MotionLink
        to="/"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-[20%] sm:w-[15%] md:w-[9%] gap-2 px-5 py-2 bg-[#2989de] text-white font-semibold rounded-full hover:bg-[#2989de]/80 shadow-md transition-all duration-200 z-20"
      >
        <FaArrowLeft className="text-white" />
        <span className="hidden md:block">Back</span>
      </MotionLink>

      {/* content div */}
      <div className="flex flex-col w-full flex-grow items-center justify-center text-center  sm:-mt-6 md:-mt-9 space-y-8 sm:space-y-10">
        {/* Question */}
        <div className="space-y-2 sm:space-y-3">
          <p className="font-bold text-3xl sm:text-3xl md:text-4xl text-[#024e96]">
            Checking In
          </p>
          <p className="font-light text-lg sm:text-xl md:text-2xl text-white">
            Are you a Staff of our space?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6  justify-center items-center w-full md:gap-20 mt-6 sm:mt-9">
          {/* Member Button */}
          <MotionLink
            to="/check-in"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="w-full sm:w-[42%] md:w-[400px] min-h-[220px] sm:min-h-[230px] md:min-h-[250px] bg-zinc-800 rounded-4xl p-5 sm:p-6 md:p-6 text-white font-semibold flex flex-col justify-between"
          >
            <p className="mb-3 sm:mb-4 text-base sm:text-base md:text-lg text-left">
              Yes, I Am A Staff
            </p>
            <div className="flex justify-end">
              <div className="w-10 h-10 flex items-center justify-center">
                <FaUsers className="text-[#2989de] text-5xl" />
              </div>
            </div>
          </MotionLink>

          {/* Visitor Button */}
          <MotionLink
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="w-full sm:w-[42%] md:w-[400px] min-h-[220px] sm:min-h-[230px] md:min-h-[250px] bg-zinc-800 rounded-4xl p-5 sm:p-6 md:p-6 text-white font-semibold flex flex-col justify-between"
          >
            <p className="mb-3 sm:mb-4 text-base sm:text-base md:text-lg text-left">
              No, I'm a visitor
            </p>
            <div className="flex justify-end">
              <div className="w-10 h-10 flex items-center justify-center">
                <FaUser className="text-[#2989de] text-3xl" />
              </div>
            </div>
          </MotionLink>
        </div>
      </div>
    </div>
  );
};

export default IdentityCheckPage;
