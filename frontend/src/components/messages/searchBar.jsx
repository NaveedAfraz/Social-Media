import React from "react";
import { BiSearch } from "react-icons/bi";

function SearchBar({ setSearchQuery, searchQuery }) {
  return (
    <div className="relative w-[98%] mx-2.5 my-3">
      <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full h-12 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
      />
    </div>
  );
}

export default SearchBar;
