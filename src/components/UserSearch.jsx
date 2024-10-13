import { faAdd, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useAnimation } from "framer-motion";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/StateProvider";

const UserSearch = () => {
  const [show, setShow] = useState(false);
  const [result, setResult] = useState([]);
  const navigate = useNavigate();
  const { searchUser, onlineUsers } = useContext(Context);
  let resultBox = useAnimation();
  let input = useRef();

  function handleAnimaton() {
    if (show) {
      resultBox.start({
        height: "83vh",
        transition: {
          duration: 0.8,
          ease: "backInOut",
          type: "spring",
          delay: 0.2,
        },
      });
    } else {
      resultBox.start({
        height: 0,
        transition: {
          duration: 0.8,
          ease: "backInOut",
          type: "spring",
          delay: 0.2,
        },
      });
    }
  }

  async function handleAdd() {
    setShow(!show);
  }

  let current = null;

  async function handleSearch(e) {
    if (current) {
      clearTimeout(current);
    }
    current = setTimeout(async () => {
      let res = await searchUser(e.target.value);
      if (res.success === true) {
        setResult(res.users);
      }
    }, 400);
  }

  useEffect(() => {
    handleAnimaton();
  }, [show]);

  async function handleClick(id) {
    let anotheruser = result.filter((user) => user._id === id);
    navigate(`user/${id}`, {
      state: { anotherUser: anotheruser[0] },
    });
    setShow(false);
    setResult("");
    input.current.value = "";
  }

  return (
    <div className="w-full relative">
      <div className=" flex justify-between items-center px-2 gap-x-1 ">
        <div className=" flex items-center gap-x-2 border-[1px] border-solid border-[#1F1F22] bg-neutral-700 rounded-full w-4/5">
          <FontAwesomeIcon
            icon={faSearch}
            className="  text-stone-500 h-[18px] w-[18px] pl-3 font-light"
          />
          <input
            ref={input}
            onChange={handleSearch}
            placeholder="search"
            type="text"
            className=" bg-transparent w-full placeholder-stone-500 border-none outline-none text-white text-[15px] h-8 "
          />
        </div>
        <span onClick={handleAdd}>
          <FontAwesomeIcon
            icon={faAdd}
            className="bg-[rgb(253,120,124)] h-[15px] w-[15px] rounded-full p-[0.4rem] mr-2 shadow-md shadow-[rgb(253,120,124)]"
          />
        </span>
      </div>
      <motion.div
        className=" absolute text-neutral-600 gap-y-1 overflow-hidden flex-col  overflow-y-auto bg-[#1F1F22] flex justify-start items-center w-full z-[999] mt-3 border-t-[1px] border-solid border-neutral-700"
        initial={{ height: 0 }}
        animate={resultBox}
      >
        {result.length < 1 ? (
          <span className=" pt-4">No result found</span>
        ) : (
          <div className=" flex justify-start items-center flex-col gap-y-2 w-full mt-3">
            {result &&
              result.map((user) => (
                <div
                  className=" w-full px-3 py-1 cursor-pointer"
                  onClick={() => {
                    handleClick(user._id);
                  }}
                  key={user._id}
                >
                  <div className=" flex justify-start items-center gap-x-5 text-neutral-400 w-full bg-stone-600 p-2 rounded-md">
                    <div className=" rounded-full  relative">
                      {onlineUsers.includes(user._id) == "active" && (
                        <span className=" absolute p-[0.3rem] bg-green-500 rounded-full inline-block -right-1 -top-1 z-[99]"></span>
                      )}
                      <img
                        src={
                          !user.pic
                            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                            : user.pic
                        }
                        alt="user-img"
                        className=" h-[45px] w-[55px] object-cover aspect-square rounded-full"
                      />
                    </div>
                    <div className=" flex justify-between items-start w-full">
                      <div className=" text-xl w-3/5">
                        <h6 className=" text-[17px]">{user.fullName}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(UserSearch);
