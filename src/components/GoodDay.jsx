import React from "react";
import GoodDayImage from "../assets/Good day.png";

const GoodDay = () => {
  return (
    <div className="flex w-full flex-col md:flex-col sm:flex-row min-h-[290px] items-center justify-evenly bg-transparent px-4 py-6">
      {/* GoodDay image */}
      <div className="flex justify-center sm:justify-start w-full sm:w-1/2 mb-4 sm:mb-0">
        <img
          src={GoodDayImage}
          alt="Good Day"
          className="w-[180px] sm:w-[250px] md:w-[300px] lg:w-[350px] h-auto object-contain"
        />
      </div>

      {/* Text section */}
      <div className="w-full sm:w-1/2 text-center sm:text-left">
        <p className="text-white text-lg sm:text-2xl md:text-3xl font-light">
          Why Are you <br /> here?
        </p>
      </div>
    </div>
  );
};

export default GoodDay;
