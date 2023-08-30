import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="flex w-[700px]">
      <div className="w-[30%] flex flex-col items-center h-screen bg-gray-100">
        <div className="bg-blue-500 text-white p-4">
          <h1 className="text-2xl font-bold">React Router Contacts</h1>
        </div>
        <div className="my-4 px-4">
          <form id="search-form" role="search" className="flex items-center">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              className="px-2 py-1 border rounded-md"
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </form>
          <form method="post" className="mt-2">
            <button
              type="submit"
              className="px-3 py-2 bg-blue-500 text-white rounded-md"
            >
              New
            </button>
          </form>
        </div>
        <nav>
          <ul className="list-none">
            <li className="my-1">
            <Link to={`credential`}>Credential</Link>
            </li>
            <li className="my-1">
            <Link to={`uploadImage`}>Upload Image</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}
