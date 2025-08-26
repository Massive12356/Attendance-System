import React from 'react'
import { FaLock } from 'react-icons/fa'
import { Link } from 'react-router-dom'


const NavBar = () => {
  return (
    <div className="text-white p-2 flex flex-row items-center gap-1.5">
      <Link
        to="/login"
        className="flex flex-row items-center gap-1.5 "
      >
        <FaLock />
        <p className="font-semibold">Admin</p>
      </Link>
    </div>
  );
}

export default NavBar