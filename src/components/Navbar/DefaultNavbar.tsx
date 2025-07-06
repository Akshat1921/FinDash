import React from 'react';
import { Link } from 'react-router-dom';
export const DefaultNavbar: React.FC = () => (
  <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 shadow">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <Link to="/stocks" className="flex items-center space-x-3 rtl:space-x-reverse">
        <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white text-blue-700">FinDash</span>
      </Link>
      <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign In</button>
      </div>
    </div>
  </nav>
);