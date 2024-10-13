import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Header = () => {
  function handleSearch(e) {
    console.log(e.target);
  }
  return (
    <header className=" w-full flex justify-center items-center py-3 border-l-[1px] border-b-[1px] border-stone-700 border-b-stone-900 gap-x-2 select-none">
      <div className=" w-2/4">
        <input
          type="text"
          className=" h-[40px] w-full bg-neutral-700 rounded-full placeholder-stone-500 px-3 outline-none text-gray-100 border-none text-[15px]"
          placeholder="search"
        />
      </div>
      <FontAwesomeIcon
        icon={faSearch}
        className=" font-light p-2 rounded-full bg-[rgb(253,120,124)] h-[17px] w-[17px] cursor-pointer"
      />
    </header>
  );
};

export default React.memo(Header);
