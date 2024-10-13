import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Suspense, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MovingBG from "../components/MovingBG";
import { Context } from "../context/StateProvider";

const AuthScreens = () => {
  const navigate = useNavigate();
  const { isLogin, isAuthenticated } = useContext(Context);

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      if (isLogin) {
        console.log("Called");
        navigate("/auth/login");
      } else {
        navigate("/auth/signup");
      }
    } else {
      navigate("/");
    }
  }, [isLogin, isAuthenticated]);

  return (
    <div className=" relative flex items-center justify-center h-screen w-screen overflow-hidden">
      <div className=" flex justify-center items-center h-full w-full md:w-1/2 relative">
        <div className=" hidden md:flex flex-col items-center justify-center absolute left-1/2  top-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] text-white shadow-lg drop-shadow-lg drop-shadow-purpleGradient">
          <div>
            <FontAwesomeIcon
              icon={faMessage}
              className="  text-white h-[60px] w-[60px] absolute -right-10 -top-10"
            />
            <h1 className=" text-9xl font-bold text-white  uppercase tracking-wider ">
              Blip
            </h1>
          </div>
          <h4>Moments, Not Monologues.</h4>
        </div>
        <MovingBG />
      </div>
      <div className=" h-full w-full   md:w-1/2 absolute sm:relative overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthScreens;
