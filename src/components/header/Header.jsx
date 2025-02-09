import React from 'react'
import { Outlet } from 'react-router-dom'

const Header = () => {
  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav
          className="relative flex w-full h-10 items-center justify-between py-1  bg-red-500  md:flex-wrap md:justify-start"
          data-te-navbar-ref
        >
         
        </nav>
      </header>
      <main className="z-50 mt-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Header
