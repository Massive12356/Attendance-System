import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useLoginStore from "../../store/useLoginStore"
import sukuIcon from "../assets/suku logo variant.png";
import bgImage from "../assets/Background.jpg"
import { FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const loginUser = useLoginStore((state) => state.loginUser);
  const loading = useLoginStore((state) => state.loading); // get loading state

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState(""); // maps to ID

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start toast loading feedback
    const toastId = toast.loading("Signing in...");

    const user = await loginUser(fullName, password);

    if (!user) {
      toast.error("Login failed. Check your credentials.", { id: toastId });
      return;
    }

    // Check admin role
    if (user.attendee?.role === "admin") {
      localStorage.setItem("userId", user.attendee._id);
      toast.success("Login successful! Redirecting...", { id: toastId });
      navigate("/insight-center");
    } else {
      toast.error("You do not have access to this page.", { id: toastId });
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-no-repeat bg-center bg-cover md:p-9 p-3"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full flex flex-row items-center justify-between">
        <Link to="/">
          <div className="flex items-center justify-center   gap-2 px-5 py-2 bg-[#2989de] text-white font-semibold rounded-full hover:bg-[#2989de]/80 shadow-md hover:scale-105 transition-all duration-200 z-20">
            <FaArrowLeft className="text-lg md:text-xl text-white" />
            <p className="text-sm md:text-base hidden md:block">Back</p>
          </div>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mt-9 md:mt-0 md:w-[40%] bg-black p-6 md:p-15 rounded-4xl shadow-lg min-h-[500px] flex flex-col justify-center "
      >
        <div className="w-full  flex justify-center items-start -mt-6">
          <img src={sukuIcon} alt="sukuIcon" className="w-30" />
        </div>
        <h2 className="text-white text-2xl font-extrabold mb-6 mt-6 text-center">
          Sign In to Your Account
        </h2>

        <form className="space-y-5 p-6 h-[300px]" onSubmit={handleSubmit}>
          <div className="mb-12">
            <label htmlFor="fullName" className="block text-sm text-white mb-3">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2  bg-zinc-900 text-white placeholder-gray-500 border-3 border-white focus:outline-none "
              placeholder="Your Full Name"
              required
            />
          </div>

          <div className="mb-7">
            <label htmlFor="password" className="block text-sm text-white mb-3">
              Password
            </label>
            <input
              type="password"
              name="ID"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2  bg-zinc-900 text-white placeholder-gray-500 border-3 border-white"
              placeholder="*********"
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-500" : "bg-[#2989de] hover:bg-[#02447f]"
            } transition-colors text-white font-medium py-2 px-4`}
            type="submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <p className="text-sm font-semibold mt-3 md:mt-2 text-white leading-3  text-center ">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#2989de] hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
