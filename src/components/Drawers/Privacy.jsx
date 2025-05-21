import React from "react";
import { motion } from "framer-motion";
const Privacy = () => {
  return (
    <div className="w-full p-4 text-white ">
      <motion.div
        whileHover={{
          backgroundColor: "rgba(253,113,112,1)",
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        whileTap={{
          backgroundColor: "rgba(253,113,112,1)",
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        transition={{ duration: 1, ease: "backOut" }}
        className=" w-full flex items-centershadow-xl rounded-md text-base border-solid bg-stone-800  my-4 p-1 cursor-pointer"
      >
        <span className="  text-center p-1 pl-2  ">Change Password</span>
      </motion.div>
      <motion.div
        whileHover={{
          backgroundColor: "rgba(253,113,112,1)",
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        whileTap={{
          backgroundColor: "rgba(253,113,112,1)",
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        className=" w-full flex items-centershadow-xl rounded-md text-base border-solid bg-stone-800  my-4 p-1 cursor-pointer"
      >
        <span className="  text-center p-1 pl-2  ">Change Mobile Number</span>
      </motion.div>
    </div>
  );
};

export default Privacy;
