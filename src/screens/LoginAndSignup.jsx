import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useAnimation } from "framer-motion";
import React, { Suspense, useCallback, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { Context } from "../context/StateProvider";

const LoginAndSignup = ({ Children }) => {
  const { isLogin, setIsLogin } = useContext(Context);

  const log_SignUp_Animation = useAnimation();
  const containerAnimation = useAnimation();

  let path = useLocation();
  path = path.pathname.split("/");

  const log_SignUp_Initial = {
    x: "-49%",
  };

  async function innerWidthCalc() {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  async function innerWidthChecker() {
    let { width, height } = await innerWidthCalc();

    ////("InnerWidth: ", width);

    if (width > 1280) {
      if (isLogin) {
        // setCurrMeasures({ height: 30, width: 30 });
        handleAnimation(35, 30);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(40, 40);
      }
    } else if (width <= 1280 && width > 1024) {
      if (isLogin) {
        handleAnimation(40, 30);
      } else {
        handleAnimation(50, 35);
      }
    } else if (width <= 1024 && width > 915) {
      if (isLogin) {
        let hght = height < 1000 ? 54 : 40;
        let wght = height < 1000 ? 40 : 30;
        handleAnimation(hght, wght);
      } else {
        let hght = height < 1000 ? 70 : 55;
        handleAnimation(hght, 30);
      }
    } else if (width <= 915 && width > 800) {
      if (isLogin) {
        let hght = height > 1200 ? 40 : 45;
        handleAnimation(hght, 30);
      } else {
        let hght = height > 1200 ? 55 : 60;
        handleAnimation(hght, 28);
      }
    } else if (width <= 800 && width > 600) {
      if (isLogin) {
        handleAnimation(50, 30);
      } else {
        handleAnimation(70, 30);
      }
    } else if (width <= 600 && width > 414) {
      if (isLogin) {
        handleAnimation(70, 45);
      } else {
        let hght = height < 720 ? 80 : 101;
        let wght = height < 720 ? 40 : 50;
        handleAnimation(hght, wght);
      }
    } else if (width <= 414 && width >= 390) {
      if (isLogin) {
        let hght = height < 750 ? 69 : 60;
        handleAnimation(hght, 40);
      } else {
        let hght = height < 750 ? 100 : height > 750 && height < 850 ? 85 : 81;
        handleAnimation(hght, 40);
      }
    } else if (width <= 375 && width > 360) {
      if (isLogin) {
        let hght = height > 700 ? (height > 800 ? 63 : 50) : 76;
        // setCurrMeasures({ height: 35, width: 45 });
        handleAnimation(hght, 43);
      } else {
        let hght = height > 700 ? 90 : 108;
        let wght = height > 700 ? 40 : 45;
        handleAnimation(hght, wght);
      }
    } else if (width <= 360 && width > 350) {
      if (isLogin) {
        let hght = height > 700 ? 68 : 80;
        handleAnimation(hght, 43);
      } else {
        let hght = height > 700 ? 98 : 116;
        handleAnimation(hght, 43);
      }
    } else if (width < 350 && width > 320) {
      if (isLogin) {
        // setCurrMeasures({ height: 35, width: 45 });
        handleAnimation(58, 35);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(83, 35);
      }
    } else {
      if (isLogin) {
        // setCurrMeasures({ height: 43, width: 63 });
        handleAnimation(80, 40);
      } else {
        handleAnimation(112, 40);
      }
    }
  }

  useEffect(() => {
    window.addEventListener("resize", widthHandler);

    innerWidthChecker();

    return () => {
      window.removeEventListener("resize", widthHandler);
    };
  }, [isLogin]);

  const handleAnimation = (height, width) => {
    if (isLogin) {
      containerAnimation.start({
        height: `${height}vmax`,
        width: `${width}vmax`,
        transition: {
          duration: 1,
          ease: "easeInOut",
          type: "spring",
          delay: 0.9,
        },
      });

      log_SignUp_Animation.start({ x: "-49%" });
    } else {
      containerAnimation.start({
        height: `${height}vmax`,
        width: `${width}vmax`,
        transition: {
          duration: 1,
          ease: "easeInOut",
          type: "spring",
          delay: 1.1,
        },
      });
      log_SignUp_Animation.start({ x: "49%" });
    }
  };

  const widthHandler = () => {
    innerWidthChecker();
  };

  let login = useCallback((e) => {
    e.stopPropagation();
    setIsLogin(true);
  }, []);

  let signUp = useCallback((e) => {
    e.stopPropagation();
    setIsLogin(false);
  }, []);

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
          layout
          className={`bg-white rounded-lg w-full absolute md:relative flex justify-start items-center flex-col  ${
            isLogin ? "gap-y-4" : "gap-y-0"
          } overflow-hidden pb-6 relative w-0 xl:w-[30vmax]`}
        >
          <div className=" relative flex justify-center items-center py-12  bg-neutral-700  w-full self-start">
            <div className=" relative text-center">
              <FontAwesomeIcon
                icon={faMessage}
                className="  text-white h-[30px] w-[30px] absolute -right-5 -top-5"
              />
              <h1 className=" text-5xl font-bold text-white  uppercase tracking-[0.5rem] sm:tracking-wider ">
                Blip
              </h1>

              <span className=" flex sm:hidden  text-[14px] sm:text-[12px] text-white leading-3 tracking-wide">
                Moments, Not Monologues.
              </span>
            </div>
          </div>
          <div
            className={` px-4  md:px-6  pb-2 w-full   flex justify-center items-center flex-col  md:relative  ${
              isLogin ? "gap-y-4" : "gap-y-0"
            }  h-4/6 `}
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
              delay: 0.2,
              ease: "easeInOut",
              type: "spring",
            }}
            className=" absolute bg-purpleGradient  py-5 w-1/2 rounded-full mx-1"
          ></motion.div>
          <button
            style={{ outline: "none" }}
            type="button"
            onClick={login}
            className={` border-none  mr-2 py-0 w-1/2 bg-transparent ${
              isLogin ? "text-white" : "text-black"
            } text-[17px] font-medium relative z-10 text-center text-nowrap`}
          >
            Log in{" "}
          </button>
          <button
            style={{ outline: "none" }}
            type="button"
            onClick={signUp}
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
