import React, { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";

const Loader = () => {
  let loaderRef = useRef();

  return (
    <motion.div
      initial={{ y: 0 }}
      transition={{ duration: 2, ease: "backOut", type: "spring" }}
      exit={{ y: "-100%" }}
      className=" h-screen w-screen justify-center items-center flex bg-[#1F1F22] font-extrabold text-7xl uppercase text-white tracking-wide"
    >
      <div className="flex relative" ref={loaderRef}>
        Loading...{" "}
        <div
          className=" absolute h-20 w-24 bg-[#1f1F22] -right-4 coverDiv"
          ref={loaderRef}
        ></div>
      </div>
    </motion.div>
  );
};

export default Loader;
