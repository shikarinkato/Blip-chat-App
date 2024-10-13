import { faBell } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightFromBracket,
  faDoorOpen,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Context } from "../context/StateProvider";
import { useNavigate } from "react-router-dom";

const SideBarHeader = ({ user }) => {
  const { setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  function handleSelect(e) {
    // console.log(e.target.getAttribute("data-name"));
    // if (e.target.getAttribute("data-name") == "logout") {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/auth");
    // }
  }

  return (
    <header className="bg-[#1F1F22] flex justify-between items-center w-full py-4 px-4 border-b-[1px] border-b-stone-700">
      <div className="flex items-center  gap-x-3">
        <div className=" h-[40px] w-[40px] rounded-full overflow-hidden ">
          <img
            src={user.pic}
            alt="user_img"
            className=" object-cover h-full w-full aspect-square object-top"
          />
        </div>
        <span className=" text-white inline-block text-[18px] sm:text-[16px] font-normal">
          {user.fullName}
        </span>
      </div>
      <div className=" flex gap-x-6 text-white">
        <FontAwesomeIcon icon={faBell} />
        <div>
          {/* <FontAwesomeIcon icon={faEllipsis} onClick={handleShow} /> */}
          {/* {show && ( */}
          {
            /* // <ul 
            //   onClick={handleSelect}
            //   className=" list-none absolute border-[1px] border-stone-600 rounded-lg px-3 py-2 bg-[#1F1F22] z-[1099] right-3"
            // >*/
            <span
              className=" text-nowrap cursor-pointer flex items-center gap-x-2"
              data-name="logout"
              onClick={handleSelect}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-5" />
            </span>
            /* </ul> 
           )} */
          }
        </div>
      </div>
    </header>
  );
};

export default React.memo(SideBarHeader);
