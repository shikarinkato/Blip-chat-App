import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useAnimation } from "framer-motion";
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { Context } from "../context/StateProvider";

const LoginAndSignup = ({ Children }) => {
  const { isLogin, setIsLogin } = useContext(Context);
  // const [currMeasures, setCurrMeasures] = useState({ height: 10, width: 30 });
  // const [innerWidth, setinnerWidth] = useState(window.innerWidth);

  const log_SignUp_Animation = useAnimation();
  const containerAnimation = useAnimation();

  let path = useLocation();
  path = path.pathname.split("/");

  const log_SignUp_Initial = {
    x: "-49%",
  };

  async function innerWidthCalc() {
    // //console.log(window.innerWidth);
    return window.innerWidth;
  }

  async function innerWidthChecker() {
    let width = await innerWidthCalc();

    //console.log("InnerWidth: ", width);

    if (width > 1280) {
      if (isLogin) {
        // setCurrMeasures({ height: 30, width: 30 });
        handleAnimation(30, 30);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(35, 40);
      }
    } else if (width <= 1280 && width > 1024) {
      if (isLogin) {
        // setCurrMeasures({ height: 35, width: 30 });
        handleAnimation(35, 30);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(50, 35);
      }
    } else if (width <= 1024 && width > 915) {
      if (isLogin) {
        // setCurrMeasures({ height: 35, width: 25 });
        handleAnimation(40, 30);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(45, 30);
      }
    } else if (width <= 915 && width > 800) {
      if (isLogin) {
        // setCurrMeasures({ height: 40, width: 30 });
        handleAnimation(40, 30);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(55, 30);
      }
    } else if (width <= 800 && width > 600) {
      if (isLogin) {
        // setCurrMeasures({ height: 35, width: 25 });
        handleAnimation(40, 30);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(60, 35);
      }
    } else if (width <= 600 && width >= 414) {
      if (isLogin) {
        // setCurrMeasures({ height: 35, width: 45 });
        handleAnimation(45, 45);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(70, 40);
      }
    } else if (width <= 414 && width > 390) {
      if (isLogin) {
        // setCurrMeasures({ height: 35, width: 45 });
        handleAnimation(45, 40);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(70, 40);
      }
    } else {
      if (isLogin) {
        // setCurrMeasures({ height: 43, width: 63 });
        handleAnimation(60, 45);
      } else {
        // setCurrMeasures({ height: 85, width: 100 });
        handleAnimation(85, 45);
      }
    }
  }

  useEffect(() => {
    window.addEventListener("resize", widthHandler);

    // //console.log("InnerWidth: ", innerWidth);
    // //console.log("IsLogin: ", isLogin);
    innerWidthChecker();

    return () => {
      window.removeEventListener("resize", widthHandler);
    };
  }, [isLogin]);

  // useEffect(() => {
  //   // handleAnimation();

  //   // //console.log("Width: ", currMeasures.width);
  //   // //console.log("Height: ", currMeasures.height);

  // }, [isLogin, currMeasures.width, currMeasures.height]);

  const handleAnimation = (height, width) => {
    // //console.log("Height: ", height);
    // //console.log("Width: ", width);
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
    // //console.log("InnerWidth in LoginandSignup: ", window.innerWidth);
  };

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

              <span className=" flex sm:hidden  text-[11px] sm:text-[12px] text-white leading-3 tracking-wide">
                Moments, Not Monologues.
              </span>
            </div>
          </div>
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
