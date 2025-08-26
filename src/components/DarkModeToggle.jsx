import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { toggleTheme, getCurrentTheme } from "../utils/themeManager";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(getCurrentTheme() === "dark");

  const handleToggle = () => {
    toggleTheme();
    setIsDark(!isDark);
  };

  // Optional: sync with system changes or page navigation
  useEffect(() => {
    setIsDark(getCurrentTheme() === "dark");
  }, []);

  return (
    <motion.button
      onClick={handleToggle}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md hidden"
    >
      {isDark ? (
        <BsSunFill className="text-yellow-400 text-xl" />
      ) : (
        <BsMoonStarsFill className="text-gray-800 text-xl" />
      )}
    </motion.button>
  );
};

export default DarkModeToggle;
