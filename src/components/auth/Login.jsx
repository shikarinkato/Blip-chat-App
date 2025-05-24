import { useToast } from "@chakra-ui/toast";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../../context/StateProvider";
import Input from "../Input";
import SocialLogin from "./SocialLogin";
const Login = () => {
  const { login, loginOAuth } = useContext(Context);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // let animations = [useAnimation(), useAnimation(), useAnimation()];

  let path = useLocation();
  path = path.pathname.split("/");

  // function handleAnimations() {
  //   // if (isLogin) {
  //   //   animations[0].start({
  //   //     x: 0,
  //   //     transition: {
  //   //       duration: 1.2,
  //   //       type: "spring",
  //   //       ease: "easeInOut",
  //   //       delay: 1.7,
  //   //     },
  //   //   });
  //   //   animations[1].start({
  //   //     y: 0,
  //   //     opacity: 1,
  //   //     transition: {
  //   //       duration: 0.8,
  //   //       ease: "easeInOut",
  //   //       type: "spring",
  //   //       delay: 1.8,
  //   //     },
  //   //   });
  //   //   animations[2].start({
  //   //     y: 0,
  //   //     opacity: 1,
  //   //     transition: {
  //   //       duration: 0.8,
  //   //       ease: "easeInOut",
  //   //       type: "spring",
  //   //       delay: 1.8,
  //   //     },
  //   //   });
  //   // } else {
  //   //   animations[0].start({
  //   //     x: "-100%",
  //   //     transition: {
  //   //       duration: 1.2,
  //   //       type: "spring",
  //   //       ease: "easeInOut",
  //   //       delay: 1.7,
  //   //     },
  //   //   });
  //   //   animations[1].start({
  //   //     y: 0,
  //   //     opacity: 1,
  //   //     transition: {
  //   //       duration: 0.8,
  //   //       ease: "easeInOut",
  //   //       type: "spring",
  //   //       delay: 1.8,
  //   //     },
  //   //   });
  //   //   animations[2].start({
  //   //     y: 0,
  //   //     opacity: 1,
  //   //     transition: {
  //   //       duration: 0.8,
  //   //       ease: "easeInOut",
  //   //       type: "spring",
  //   //       delay: 1.8,
  //   //     },
  //   //   });
  //   // }
  // }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      if (!formData.email || !formData.password) {
        return toast({
          title: "Required fields are Missing",
          status: "warning",
          description: "Check before proceeding",
          isClosable: true,
          duration: 2000,
          position: "bottom",
        });
      }

      ////(loading);

      let isEmail = formData.email.includes("@");

      if (isEmail) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(formData.email)) {
          return toast({
            title: "Invalid E-mail format",
            status: "warning",
            description: "Please enter a valid E-mail format",
            isClosable: true,
            duration: 2000,
            position: "bottom",
          });
        }
      }
      if (formData.password.length < 6) {
        return toast({
          title: "Password too short",
          status: "warning",
          description: "Password length should equal or more then 6",
          isClosable: true,
          duration: 2000,
          position: "bottom",
        });
      }

      await login(formData.email, formData.password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full  ">
      <AnimatePresence>
        <div className=" w-full  mt-4">
          <SocialLogin handleClick={loginOAuth} />
        </div>
      </AnimatePresence>
      <motion.form
        initial={{ opacity: 1, height: "55%", width: "100%" }}
        animate={{ opacity: 1, height: "100%", width: "100%" }}
        transition={{ duration: 1, delay: 1 }}
        exit={{ opacity: 0, height: 0 }}
        // layout
        onSubmit={handleLogin}
        className="  flex justify-center items-center flex-col gap-y-4 md:gap-y-5 lg:gap-y-7 xl:gap-y-5 2xl:gap-y-6   w-full mt-9"
      >
        <motion.div
          initial={{
            opacity: 0,
            x: "-100%",
          }}
          animate={{
            x: 0,
            opacity: 1,
            transition: {
              duration: 1.2,
              type: "spring",
              ease: "easeInOut",
              delay: 1.5,
            },
          }}
          exit={{
            opacity: 0,
            x: "-100%",
            transition: {
              duration: 1.2,
              type: "spring",
              ease: "easeInOut",
              delay: 1,
            },
          }}
          className=" w-full border-[1px] border-stone-700 rounded-full "
        >
          <Input
            value={formData.email}
            type={"text"}
            placeholder="email or username,mobilenumber"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                email: e,
              }));
            }}
          />
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            x: "-100%",
          }}
          animate={{
            x: 0,
            opacity: 1,
            transition: {
              duration: 1.2,
              type: "spring",
              ease: "easeInOut",
              delay: 1.5,
            },
          }}
          exit={{
            opacity: 0,
            x: "-100%",
            transition: {
              duration: 1.2,
              type: "spring",
              ease: "easeInOut",
              delay: 1,
            },
          }}
          className=" w-full border-[1px] border-stone-700 rounded-full "
        >
          <Input
            value={formData.password}
            type={"password"}
            placeholder="password"
            height="30px"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                password: e,
              }));
            }}
          />
        </motion.div>
        <motion.button
          initial={{
            opacity: 0,
            x: "-100%",
          }}
          animate={{
            x: 0,
            opacity: 1,
            transition: {
              duration: 1.2,
              type: "spring",
              ease: "easeInOut",
              delay: 1.5,
            },
          }}
          exit={{
            opacity: 0,
            x: "-100%",
            transition: {
              duration: 1.2,
              type: "spring",
              ease: "easeInOut",
              delay: 1.2,
            },
          }}
          disabled={loading ? true : false}
          type="submit"
          className="bg-purple-700 w-full px-4 py-2 text-white rounded-md text-xl font-bold border-none outline-none"
          style={{ outline: "none" }}
        >
          {loading ? "Loading..." : "Log in"}
        </motion.button>
      </motion.form>
      <motion.h6
        initial={{
          opacity: 0,
          x: "-100%",
        }}
        animate={{
          x: 0,
          opacity: 1,
          transition: {
            duration: 1.2,
            type: "spring",
            ease: "easeInOut",
            delay: 1.5,
          },
        }}
        exit={{
          opacity: 0,
          x: "-100%",
          transition: {
            duration: 1.2,
            type: "spring",
            ease: "easeInOut",
            delay: 1.3,
          },
        }}
        className=" text-[18px] mt-4   xsm:text-[16px] md:text-[18px] lg:text-[20px]  2xl:text-[18px] text-center font-normal   w-full"
      >
        Welcome back! Log in and continue your chat adventures
      </motion.h6>
    </div>
  );
};

export default Login;
