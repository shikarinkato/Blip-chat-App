import { faCamera, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useAnimation } from "framer-motion";
import React, { useContext, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CLOUDINARY_URL,
  Context,
  REACT_APP_CLOUDINARY_UPLOAD_PRESET,
} from "../context/StateProvider";
import Input from "./Input";
import { useToast } from "@chakra-ui/toast";

const SignUp = () => {
  const toast = useToast();
  let animations = [
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
  ];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userName: "",
    password: "",
    pic: "",
  });
  const navigate = useNavigate();
  let path = useLocation();
  path = path.pathname.split("/");

  const { isLogin, signUp, setIsLogin } = useContext(Context);

  function handleAnimations() {
    if (isLogin) {
      animations[0].start({
        scale: 0,
        transition: {
          duration: 1.2,
          type: "spring",
          ease: "easeInOut",
          delay: 0.5,
        },
      });
    } else {
      animations[0].start({
        scale: 1,
        transition: {
          duration: 1.2,
          type: "spring",
          ease: "easeInOut",
          delay: 1.7,
        },
      });
      animations[1].start({
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
          type: "spring",
          delay: 1.8,
        },
      });
      animations[2].start({
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
          type: "spring",
          delay: 1.8,
        },
      });
      animations[3].start({
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
          type: "spring",
          delay: 1.8,
        },
      });
      animations[4].start({
        x: 0,
        opacity: 1,
        display: "flex",
        transition: {
          duration: 0.8,
          ease: "easeInOut",
          type: "spring",
          delay: 1.8,
        },
      });
    }
  }

  useLayoutEffect(() => {
    handleAnimations();
  }, [isLogin]);

  async function handleImageUpload(e) {
    setLoading(true);
    try {
      let pics = e.target.files[0];
      if (pics === undefined) {
        toast({
          title: "Please Select an Image",
          duration: 2000,
          status: "warning",
          position: "bottom",
          isClosable: true,
        });
        return;
      }

      if (!pics || !pics.type.startsWith("image/")) {
        toast({
          title: "Please Upload an Image",
          duration: 2000,
          status: "warning",
          position: "bottom",
          isClosable: true,
        });
        return;
      }

      let dataForm = new FormData();
      dataForm.append("file", pics);
      dataForm.append("upload_preset", REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      // dataForm.append("cloud_nmae", REACT_APP_CLOUDINARY_UPLOAD_PRESET);

      let res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: dataForm,
      });

      res = await res.json();
      setFormData((prev) => ({ ...prev, pic: res.url }));
    } catch (error) {
      return toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  }

  async function changeUsername(e) {
    setFormData((prev) => ({ ...prev, userName: e }));
  }
  async function changefullName(e) {
    setFormData((prev) => ({ ...prev, fullName: e }));
  }
  async function changePassword(e) {
    setFormData((prev) => ({ ...prev, password: e }));
  }
  async function changeEmail(e) {
    setFormData((prev) => ({ ...prev, email: e }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
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

      if (formData.password.length < 6) {
        return toast({
          title: `${
            formData.password.length <= 3
              ? "Password is too short."
              : "Password is short."
          }`,
          status: "warning",
          description: "Password length should be equal to or more than 6",
          isClosable: true,
          duration: 2000,
          position: "bottom",
        });
      }

      let res = await signUp(formData);

      if (res.success === true) {
        toast({
          title: `${res.message}`,
          status: "success",
          isClosable: true,
          duration: 2000,
          position: "bottom",
        });
        setFormData({
          fullName: "",
          email: "",
          userName: "",
          password: "",
          pic: "",
        });
        setIsLogin(true);
        return;
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      return toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  }

  // console.log(formData);

  return (
    <div className=" flex flex-col  py-3 w-full text-center justify-center items-center pt-8 lg:pt-8">
      <form
        // initial={{ display: "none" }}
        // animate={{
        //   display: "flex",
        // }}
        // transition={{
        //   duration: 0.8,
        //   ease: "circInOut",
        //   type: "spring",
        //   delay: 1.5,
        // }}
        // layout
        className=" flex flex-col justify-start items-center gap-y-5 sm:gap-y-4 w-full  "
        onSubmit={handleSubmit}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={animations[0]}
          exit={{ translateX: "100%" }}
          // layout
          className="profile_pic flex h-24 w-24 cursor-pointer rounded-full overflow-hidden "
        >
          <input
            type="file"
            accept="image/*"
            name="dp_image"
            id="dp_image"
            className=" hidden"
            onChange={handleImageUpload}
          />
          {formData.pic === null || formData.pic === "" ? (
            <label
              htmlFor="dp_image"
              className=" h-full w-full bg-neutral-600 rounded-full flex justify-center items-center cursor-pointer"
            >
              <FontAwesomeIcon icon={faCamera} className=" text-neutral-800" />
            </label>
          ) : (
            <img className="" src={formData.pic} />
          )}
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={animations[1]}
          exit={{ translateX: "100%" }}
          layout
          className=" flex  gap-4 pt-3 flex-col xl:flex-row w-full"
        >
          <div className=" border-[1px] border-stone-700 rounded-full w-full">
            <Input
              value={formData.fullName}
              type="text"
              placeholder="fullname"
              height="30px"
              onChange={changefullName}
            />
          </div>
          <div className=" border-[1px] border-stone-700 rounded-full w-full">
            <Input
              value={formData.email}
              type="email"
              placeholder="email"
              height="30px"
              onChange={changeEmail}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={animations[2]}
          className="flex  gap-4 flex-col xl:flex-row w-full"
        >
          <div className=" border-[1px] border-stone-700 rounded-full w-full">
            <Input
              value={formData.userName}
              type={"text"}
              placeholder="username"
              height="30px"
              onChange={changeUsername}
            />
          </div>
          <div className=" border-[1px] border-stone-700 rounded-full w-full">
            <Input
              value={formData.password}
              type={"password"}
              placeholder="password"
              height="30px"
              onChange={changePassword}
            />
          </div>
        </motion.div>
        <motion.button
          initial={{ y: "50%", opacity: 0 }}
          animate={animations[3]}
          type="submit"
          disabled={loading ? true : false}
          className="bg-purple-700 w-full px-4 py-1 text-white rounded-md text-xl font-bold border-none 2xl:py-2"
        >
          {loading ? "Loading..." : "Sign up"}
        </motion.button>
      </form>
      <motion.h6
        initial={{ y: "50%", opacity: 0 }}
        animate={animations[4]}
        className="text-[14px] sm:text-[15px] xl:text-[16px] 2xl:text-[18px] text-center font-normal   bottom-1"
      >
        Join the party! Sign up and start chatting with awesome people!
      </motion.h6>
    </div>
  );
};

export default SignUp;
