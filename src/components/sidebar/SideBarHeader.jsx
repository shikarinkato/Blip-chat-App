import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/StateProvider";

const SideBarHeader = () => {
  const { setIsAuthenticated, user } = useContext(Context);
  const navigate = useNavigate();

  function handleSelect(e) {
    // ////(e.target.getAttribute("data-name"));
    // if (e.target.getAttribute("data-name") == "logout") {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/auth");
    // }
  }

  if (!user) {
    return (
      <div className=" w-full py-2 px-3 border-b-[1px] border-gray-600">
        <div className="  w-full flex items-center gap-x-3">
          <span className=" h-12 w-16 rounded-full skeleton"></span>
          <div className="w-full flex flex-col gap-y-1">
            <span className=" h-2 w-16 skeleton rounded-md"></span>
            <span className=" h-2 w-14 skeleton rounded-md"></span>
            <span className=" h-2 w-20 skeleton rounded-md"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className="bg-[#1F1F22] flex justify-between items-center w-full py-4 px-4 border-b-[1px] border-b-stone-700">
      <nav className="flex items-center  gap-x-3">
        <div className=" h-[40px] w-[40px] rounded-full overflow-hidden ">
          <img
            src={user?.pic}
            alt="user_img"
            className=" object-cover h-full w-full aspect-square object-top"
          />
        </div>
        <span className=" text-white inline-block text-[18px] sm:text-[16px] font-normal">
          {user?.fullName}
        </span>
      </nav>
      <nav className=" flex gap-x-6 text-white">
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
      </nav>
    </header>
  );
};

export default React.memo(SideBarHeader);
