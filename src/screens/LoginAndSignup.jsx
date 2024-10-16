import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useAnimation } from "framer-motion";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { Context } from "../context/StateProvider";

const LoginAndSignup = ({ Children }) => {
  const { isLogin, setIsLogin } = useContext(Context);
  const [currWidth, setCurrWidth] = useState(0);
  const [currHeight, setCurrHeight] = useState(0);
  const [innerWidth, setinnerWidth] = useState(window.innerWidth);

  const log_SignUp_Animation = useAnimation();
  const containerAnimation = useAnimation();

  let path = useLocation();
  path = path.pathname.split("/");

  const log_SignUp_Initial = {
    x: "-49%",
  };

  useEffect(() => {
    window.addEventListener("resize", widthHandler);

    if (innerWidth > 1280) {
      if (isLogin) {
        setCurrWidth(30);
        setCurrHeight(30);
      } else {
        setCurrWidth(85);
        setCurrHeight(100);
      }
    } else if (innerWidth <= 1280 && innerWidth > 1024) {
      if (isLogin) {
        setCurrHeight(35);
        setCurrWidth(30);
      } else {
        setCurrWidth(85);
        setCurrHeight(100);
      }
    } else if (innerWidth <= 1024 && innerWidth > 915) {
      if (isLogin) {
        setCurrHeight(35);
        setCurrWidth(25);
      } else {
        setCurrWidth(85);
        setCurrHeight(100);
      }
    } else if (innerWidth <= 915 && innerWidth > 800) {
      if (isLogin) {
        setCurrHeight(40);
        setCurrWidth(30);
      } else {
        setCurrWidth(85);
        setCurrHeight(100);
      }
    } else if (innerWidth <= 800 && innerWidth > 600) {
      if (isLogin) {
        setCurrHeight(35);
        setCurrWidth(25);
      } else {
        setCurrWidth(85);
        setCurrHeight(100);
      }
    } else if (innerWidth <= 600 && innerWidth >= 414) {
      if (isLogin) {
        setCurrWidth(35);
        setCurrHeight(45);
      } else {
        setCurrWidth(85);
        setCurrHeight(100);
      }
    } else {
      if (isLogin) {
        setCurrWidth(43);
        setCurrHeight(63);
      } else {
        setCurrWidth(85);
        setCurrHeight(100);
      }
    }

    return () => {
      window.removeEventListener("resize", widthHandler);
    };
  }, [innerWidth, isLogin]);

  useEffect(() => {
    handleAnimation();
  }, [isLogin, currWidth, currHeight]);

  const handleAnimation = () => {
    if (isLogin) {
      console.log(currWidth);

      containerAnimation.start({
        height: `${currHeight}vmax`,
        width: `${currWidth}vmax`,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
          type: "spring",
          // delay: 0.5,
        },
      });

      log_SignUp_Animation.start({ x: "-49%" });
    } else {
      containerAnimation.start({
        height: `${currHeight}%`,
        width: `${currWidth}%`,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
          type: "spring",
          delay: 1.1,
        },
      });
      log_SignUp_Animation.start({ x: "49%" });
    }
  };

  const widthHandler = () => {
    console.log("Clled resize");
    setinnerWidth(window.innerWidth);
  };

  console.log("Window innerWidth: ", innerWidth);
  return (
    <div className=" h-full md:w-full  flex justify-center items-center ">
      <div
        className={`flex  justify-center items-center flex-col absolute md:relative  w-11/12  ${
          !isLogin ? "top-8 mb-6 py-6" : "xl:w-3/5 2xl:w-2/5"
        }`}
      >
        <motion.div
          initial={{ height: "9.4vmax", width: "30vmax" }}
          animate={containerAnimation}
          className={`bg-white rounded-lg w-full absolute md:relative flex justify-start items-center flex-col  ${
            isLogin ? "gap-y-4" : "gap-y-0"
          } overflow-hidden pb-6 relative w-0 xl:w-[30vmax]`}
        >
          <motion.div className=" relative flex justify-center items-center py-12  bg-neutral-700  w-full self-start">
            <div className=" relative text-center">
              <FontAwesomeIcon
                icon={faMessage}
                className="  text-white h-[30px] w-[30px] absolute -right-5 -top-5"
              />
              <h1 className=" text-5xl font-bold text-white  uppercase tracking-[0.5rem] sm:tracking-wider ">
                Blip
              </h1>

              <span className=" flex sm:hidden  text-[11px] sm:text-[12px] text-white leading-3 tracking-wide">
                Moments, Not Monologues.
              </span>
            </div>
          </motion.div>
          <div
            className={` px-4  md:px-6  pb-2 w-full   flex justify-center items-center flex-col absolute md:relative  ${
              isLogin ? "gap-y-4" : "gap-y-0"
            } relative  h-4/6`}
          >
            {
              <Suspense fallback={<Loader />}>
                <Children />
              </Suspense>
            }
          </div>
        </motion.div>

        <div className=" flex justify-evenly items-center  bg-white rounded-full py-2 px-5 mt-6 gap-x-2 w-full xl:w-4/6 relative">
          <motion.div
            initial={log_SignUp_Initial}
            animate={log_SignUp_Animation}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
              type: "spring",
            }}
            className=" absolute bg-purpleGradient  py-5 w-1/2 rounded-full mx-1"
          ></motion.div>
          <button
            style={{ outline: "none" }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLogin(true);
            }}
            className={` border-none  mr-2 py-0 w-1/2 bg-transparent ${
              isLogin ? "text-white" : "text-black"
            } text-[17px] font-medium relative z-10 text-center text-nowrap`}
          >
            Log in{" "}
          </button>
          <button
            style={{ outline: "none" }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLogin(false);
            }}
            className={` border-none  mr-2 py-0 w-1/2 bg-transparent ${
              !isLogin ? "text-white" : "text-black"
            } text-[17px] font-medium relative z-10 text-center flex-nowrap text-nowrap`}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoginAndSignup);
