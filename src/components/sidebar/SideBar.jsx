import {
  faArrowRightFromBracket,
  faBell,
  faCircleQuestion,
  faGear,
  faLock,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainDrawer from "../Drawers/MainDrawer";
import SideBarHeader from "./SideBarHeader";
import UserSearch from "./users/UserSearch";
import Users from "./users/Users";

const SideBar = ({ user }) => {
  const [opnStngs, setOpnStngs] = useState(false);
  const [callDrwr, setCallDrwr] = useState(false);
  const [callDrwrNum, setCallDrwrNum] = useState(0);
  const animations = [useAnimation(), useAnimation()];
  const sdBrPrnt = useRef(null);
  const drawer = useRef(null);
  const btnRef = useRef(null);
  const navigate = useNavigate(0);

  const MotionIcon = motion.create(FontAwesomeIcon);

  const gearOpen = (e) => {
    e.stopPropagation();

    setOpnStngs(!opnStngs);
  };

  const animationHandler = (opnStngs) => {
    if (opnStngs) {
      animations[0].start({
        rotate: "-25deg",
        transition: { duration: 0.3, ease: "easeInOut" },
      });
      animations[1].start({
        clipPath: "circle(130% at 90% 90%)",
        transition: { duration: 1, ease: "easeInOut" },
      });
    } else {
      setCallDrwr(false);
      animations[0].start({
        rotate: "25deg",
        transition: { duration: 0.3, ease: "easeInOut" },
      });
      animations[1].start({
        clipPath: "circle(2% at 90% 95%)",
        transition: { duration: 1, ease: "easeInOut" },
      });
    }
  };

  useEffect(() => {
    animationHandler(opnStngs);
  }, [opnStngs]);

  let ulVariants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: 2,
        staggerChildren: 0.1,
        ease: "easeInOut",
      },
    },
  };

  let liVariants = {
    hidden: { x: "-120%" },
    show: { x: 0 },
    transition: {
      ease: "easeInOut",
    },
  };

  let sideBarItems = [
    { name: "Account", icon: faPerson, id: 1 },
    { name: "Privacy and Security", icon: faLock, id: 2 },
    { name: "Help", icon: faCircleQuestion, id: 3 },
    { name: "LogOut", icon: faArrowRightFromBracket, id: 4 },
  ];

  let handleSelect = useCallback((e) => {
    localStorage.removeItem("token");
    navigate("/auth");
  }, []);

  let drwrOpnr = useCallback(
    (e) => {
      const node = e.target;
      const parentNode = node.parentNode;
      const grndPrntNode = parentNode.parentNode;
      if (+grndPrntNode.id === 1 || +parentNode.id === 1 || +node.id === 1) {
        setCallDrwr(true);
        setCallDrwrNum(1);
      } else if (
        +grndPrntNode.id === 2 ||
        +parentNode.id === 2 ||
        +node.id === 2
      ) {
        setCallDrwr(true);
        setCallDrwrNum(2);
      } else if (
        +grndPrntNode.id === 3 ||
        +parentNode.id === 3 ||
        +node.id === 3
      ) {
        setCallDrwr(true);
        setCallDrwrNum(3);
      } else if (
        +grndPrntNode.id === 4 ||
        +parentNode.id === 4 ||
        +node.id === 4
      ) {
        setCallDrwr(true);
        setCallDrwrNum(4);
      }
    },
    [callDrwr]
  );

  let drwrClsr = useCallback(() => {
    setCallDrwr(false);
    setCallDrwrNum(null);
  }, []);

  return (
    <div
      ref={sdBrPrnt}
      className=" h-full w-full  sm:w-3/5 lg:w-2/3 xl:w-2/6 bg-[#1F1F22] absolute sm:relative z-50"
    >
      <div className=" flex flex-col justify-start items-start h-full w-full px-1 relative overflow-hidden">
        <SideBarHeader />
        <div className="py-3 w-full">
          <UserSearch />
        </div>
        <div className=" w-full flex  h-full overflow-hidden ">
          <Users />
        </div>
        {/* <div className=" absolute bottom-8"> */}
        <div className=" absolute bottom-4 right-3">
          <div
            ref={btnRef}
            className={`p-3 px-4 rounded-full ${
              opnStngs
                ? "bg-transparent delay-400 "
                : "bg-neutral-700 delay-1000  "
            } cursor-pointer relative z-[102] transition-all duration-500 `}
            onClick={gearOpen}
          >
            <MotionIcon
              icon={faGear}
              initial={{ rotate: 0 }}
              animate={animations[0]}
              className={` text-white rotate`}
            />
          </div>
        </div>
        <motion.div
          ref={drawer}
          initial={{ clipPath: "circle(2% at 90% 95%)" }}
          animate={animations[1]}
          className={`   bg-stone-800 absolute left-0 bottom-0   z-[101] 
          h-full w-full transition-all duration-1000 delay-300  flex justify-center items-center `}
        >
          {opnStngs && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: "easeInOut",
              }}
              className="  bg-stone-900 h-[95%] z-[110] w-11/12 flex justify-start items-start flex-col rounded-md overflow-hidden relative  "
            >
              <header className=" flex justify-between items-center w-full py-4 px-4  h-1/6">
                <nav className="flex items-center  gap-x-3">
                  <div className=" h-[50px] w-[50px] rounded-full overflow-hidden ">
                    <img
                      src={user?.pic}
                      alt="user_img"
                      className=" object-cover h-full w-full aspect-square object-top"
                    />
                  </div>
                  <span className=" text-white inline-block text-[18px] sm:text-xl font-normal">
                    {user?.fullName}
                  </span>
                </nav>
                <nav className=" flex gap-x-6 text-white">
                  <FontAwesomeIcon icon={faBell} />
                  {
                    //     // <ul
                    //     //   onClick={handleSelect}
                    //     //   className=" list-none absolute border-[1px] border-stone-600 rounded-lg px-3 py-2 bg-[#1F1F22] z-[1099] right-3"
                    //     // >
                    //     // <span
                    //     //   className=" text-nowrap cursor-pointer flex items-center gap-x-2"
                    //     //   data-name="logout"
                    //     //   onClick={handleSelect}
                    //     // >
                    //     //   <FontAwesomeIcon
                    //     //     icon={faArrowRightFromBracket}
                    //     //     className="h-5"
                    //     //   />
                    //     // </span>
                    //   }
                    // </div>
                  }
                </nav>
              </header>
              <motion.ul
                onClick={drwrOpnr}
                variants={ulVariants}
                initial="hidden"
                animate="show"
                className="   h-full w-full flex justify-start items-center flex-col gap-y-4 relative mt-8"
              >
                {sideBarItems.map((item, idx) => (
                  <>
                    <motion.li
                      id={item.id}
                      key={item.id}
                      onClick={
                        idx === sideBarItems.length - 1 ? handleSelect : null
                      }
                      variants={liVariants}
                      whileHover={
                        idx !== sideBarItems.length - 1 && {
                          backgroundColor: "rgba(253,113,112,1)",
                          transition: { duration: 0.5, ease: "easeInOut" },
                        }
                      }
                      whileTap={
                        idx !== sideBarItems.length - 1 && {
                          backgroundColor: "rgba(253,113,112,1)",
                          transition: { duration: 0.5, ease: "easeInOut" },
                        }
                      }
                      transition={{ duration: 1, ease: "backOut" }}
                      className={`px-4 ${
                        idx === sideBarItems.length - 1
                          ? "text-red-700"
                          : "text-white"
                      } w-auto min-w-[80%]   rounded-lg  shadow-xl bg-stone-800 p-1 py-3 cursor-pointer`}
                    >
                      <FontAwesomeIcon className="h-6 w-6" icon={item.icon} />
                      <span className="ml-4 text-[16px]">{item.name}</span>
                    </motion.li>
                  </>
                ))}
              </motion.ul>
              <AnimatePresence>
                {callDrwr && (
                  <MainDrawer onclick={drwrClsr} childID={callDrwrNum} />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(SideBar);
