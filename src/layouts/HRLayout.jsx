import React from 'react'
import { Outlet } from 'react-router-dom'

const HRLayout = () => {
  return (
    <div className='h-screen flex flex-col'>

      {/* main content area */}
      <main className='flex-1'>
        <Outlet/>
      </main>
    </div>
  )
}

export default HRLayout