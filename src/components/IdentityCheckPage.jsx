import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const IdentityCheckPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black p-4 md:p-6">
      {/* Back Button */}
      <Link to="/" className="mb-4">
        <div className="flex items-center text-white gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M5 12l4 4" />
            <path d="M5 12l4 -4" />
          </svg>
          <p className="text-sm md:text-base">Back</p>
        </div>
      </Link>

      <div className="flex flex-col w-full flex-grow">
        {/* Header */}
        <div className="border-b border-white pb-3 mb-5">
          <p className="font-bold text-2xl md:text-3xl text-white">
            Checking In
          </p>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="font-bold text-xl md:text-2xl text-white">
            Are you a Staff of our space?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Member Button */}
          <MotionLink
            to="/check-in"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="flex-1 min-h-[120px] bg-zinc-800 rounded-lg p-4 text-white font-semibold flex flex-col justify-between"
          >
            <p className="mb-4 text-base md:text-lg">Yes, I Am A Staff</p>
            <div className="flex justify-end">
              <div className="w-9 h-9 border border-gray-400 flex items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff9500"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                  <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                  <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                  <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                  <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                  <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
                </svg>
              </div>
            </div>
          </MotionLink>

          {/* Visitor Button */}
          <MotionLink
            to=""
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="flex-1 min-h-[120px] bg-zinc-800 rounded-lg p-4 text-white font-semibold flex flex-col justify-between"
          >
            <p className="mb-4 text-base md:text-lg">No, I'm a visitor</p>
            <div className="flex justify-end">
              <div className="w-9 h-9 border border-gray-400 flex items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff9500"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.008 .128" />
                  <path d="M19 16v3" />
                  <path d="M19 22v.01" />
                </svg>
              </div>
            </div>
          </MotionLink>
        </div>
      </div>
    </div>
  );
};

export default IdentityCheckPage;
