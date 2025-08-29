import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import bgImage from "../assets/Background.jpg";
import { motion } from "framer-motion";
import GoodDay from "./GoodDay";
import { FaBox } from "react-icons/fa";
import AnimatedClock from "./AnimatedClock";

const MotionLink = motion(Link);

const AttendancePage = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-no-repeat bg-cover bg-center p-4 sm:p-6 md:p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Navbar */}
      <NavBar />

      <div className="absolute right-1 hidden md:block">
      <AnimatedClock/>
      </div>



      {/* Responsive Flex Container */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-center w-full sm:w-[90%] md:w-[70%] px-3 sm:px-4 md:px-8 gap-4 sm:gap-6 md:gap-6 py-4 sm:py-6 md:py-6 bg-black/85 rounded-4xl mx-auto my-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Text Section */}
        <motion.div
          className="flex w-full md:w-1/2 h-auto items-center justify-center rounded-lg overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <GoodDay />
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col h-auto md:h-[450px] justify-start gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-4"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        >
          {/* Icon */}
          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60" // smaller on mobile
                height="60"
                viewBox="0 0 24 24"
                fill="#2989de"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="3"
                  ry="3"
                  stroke="black"
                  fill="#2989de"
                />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M3 11h18" />
                <circle
                  cx="18"
                  cy="18"
                  r="3.8"
                  stroke="black"
                  strokeWidth="1.2"
                  fill="#2989de"
                />
                <path d="M16.6 18l1 1l2-2" stroke="black" strokeWidth="1.2" />
              </svg>
            </div>
          </motion.div>

          {/* Buttons Column */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-4 justify-center h-full">
            {/* Check into Workspace */}
            <div className="group">
              <MotionLink
                to="/identityCheck"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="relative w-full min-h-[90px] sm:min-h-[100px] md:min-h-[100px] bg-white group-hover:bg-[#2989de] group-hover:text-white text-black p-4 sm:p-6 md:p-6 rounded-3xl font-bold flex items-center justify-center shadow-md"
              >
                <p className="text-center text-sm sm:text-base md:text-base">
                  Check into Workspace
                </p>
                <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    className="fill-white stroke-[#2989de] group-hover:fill-white group-hover:stroke-[#2989de]"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      className="fill-black stroke-white group-hover:fill-white group-hover:stroke-[#2989de]"
                    />
                    <path
                      d="M4 21v-2c0-3.3 3.6-6 8-6s8 2.7 8 6v2z"
                      className="fill-black stroke-white group-hover:fill-white group-hover:stroke-[#2989de]"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="3.8"
                      className="fill-black stroke-white group-hover:fill-white group-hover:stroke-[#2989de]"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M16.6 18l1 1l2-2"
                      className="stroke-white group-hover:stroke-[#2989de]"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>
              </MotionLink>
            </div>

            <div className="group">
              {/* Deliver Packages */}
              <MotionLink
                to=""
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="relative w-full min-h-[90px] sm:min-h-[100px] md:min-h-[100px] bg-white text-black p-4 sm:p-6 md:p-6 rounded-3xl font-bold flex items-center justify-center shadow-md group-hover:text-white group-hover:bg-[#2989de] "
              >
                <p className="text-center text-sm sm:text-base md:text-base">
                  Deliver Packages
                </p>
                <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-8 sm:w-10 h-8 sm:h-10  flex items-center justify-center r">
                  <FaBox className="text-black text-sm sm:text-lg md:text-2xl group-hover:text-white" />
                </div>
              </MotionLink>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AttendancePage;
