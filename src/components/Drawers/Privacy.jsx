import { AnimatePresence, motion } from "framer-motion";
import React, { forwardRef, useReducer, useState } from "react";
import Input from "../Input";
import { chngMblNm, chngPass } from "../../functions/APIs";
import { useToast } from "@chakra-ui/toast";

function reducer(state, action) {
  switch (action.type) {
    case "editPass":
      return { ...state, pass: true };
    case "clsPass":
      return { ...state, pass: false };
    case "editMblNm":
      return { ...state, mbl_num: true };
    case "clsMblNm":
      return { ...state, mbl_num: false };

    default:
      break;
  }
}

const Privacy = () => {
  const [state, dispatch] = useReducer(reducer, {
    pass: false,
    mbl_num: false,
  });
  const [pass, setPass] = useState({
    newPass: "",
    cnfrmNewPass: "",
  });
  const [mblNm, setMblNm] = useState(0);

  const toast = useToast();

  const MotionButton = motion.create(Button);

  const hndlChng = (e, input) => {
    const id = e.target.id;
    switch (id) {
      case "newPassInpt":
        setPass((prev) => ({ ...prev, newPass: input }));
        break;
      case "cnfmNewPassInpt":
        setPass((prev) => ({ ...prev, cnfrmNewPass: input }));
        break;
      case "newMblNmInpt":
        setMblNm(input);
        break;

      default:
        break;
    }
  };

  let hndlClck = async (e) => {
    e.stopPropagation();
    const id = e.target.id;
    switch (id) {
      case "chngPassBtn":
        dispatch({ type: "editPass" });
        break;
      case "chngMblNmBtn":
        dispatch({ type: "editMblNm" });
        break;
      case "savePassBtn":
        if (pass.newPass !== pass.cnfrmNewPass) {
          toast({
            title: "Both passwords Should Match!",
            duration: 2000,
            isClosable: true,
            status: "warning",
            position: "top",
          });
          break;
        }
        if (pass.newPass.length <= 6) {
          toast({
            title: "Password Length Must be more then 6 ",
            duration: 2000,
            isClosable: true,
            status: "warning",
            position: "top",
          });
          break;
        }
        if (pass.newPass !== "") {
          const res = await chngPass(pass.newPass);
          toast({
            title: `${res.message}`,
            duration: 2000,
            isClosable: true,
            status: res.success ? "success" : "error",
            position: "top",
          });
        }
        dispatch({ type: "clsPass" });
        break;
      case "svMblNmBtn":
        if (mblNm !== "") {
          toast({
            title: "Empty value can't be set",
            duration: 2000,
            isClosable: true,
            status: "warning",
            position: "top",
          });
          break;
        }
        const res = await chngMblNm(mblNm);
        toast({
          title: `${res.message}`,
          duration: 2000,
          isClosable: true,
          status: res.success ? "success" : "error",
          position: "top",
        });

        dispatch({ type: "clsMblNm" });
        break;
      case "cnlChngPassBtn":
        dispatch({ type: "clsPass" });
        break;
      case "cnlChngMblNmBtn":
        dispatch({ type: "clsMblNm" });
        break;

      default:
        break;
    }
  };

  let stopCopy_Cut = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full p-4 text-white  bg-stone-900" onClick={hndlClck}>
      <AnimatePresence>
        {state.pass && (
          <motion.div
            initial={{ y: "10%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              ease: "easeInOut",
            }}
            exit={{ y: "-10%", opacity: 0 }}
            className=" relative w-full flex justify-between -top- z-10 bg-stone-900"
          >
            <Button
              children="Cancel"
              id="cnlChngPassBtn"
              key="cnlChngPassBtn"
              classData="border-none h-full  px-2 text-[16px] rounded-md bg-neutral-700"
            />
            <Button children="Update" id="savePassBtn" key="savePassBtn" />
          </motion.div>
        )}
      </AnimatePresence>
      <MotionButton
        whileHover={{
          backgroundColor: "rgba(253,113,112,1)",
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        whileTap={{
          backgroundColor: "rgba(253,113,112,1)",
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        transition={{ duration: 1, ease: "backOut" }}
        children="Change Password"
        key="chngPassBtn"
        id="chngPassBtn"
        classData="shadow-xl rounded-md text-base border-solid bg-stone-800  my-2 py-2 cursor-pointer w-full relative z-10"
      />

      <AnimatePresence>
        {state.pass && (
          <motion.div className=" flex justify-center flex-col gap-y-3 mt-2 relative z-10 bg-stone-900">
            <Input
              id="newPassInpt"
              onChange={hndlChng}
              placeholder="New Password"
              type="password"
              classData=" w-full border-[1px] border-solid border-neutral-700 placeholder:text-neutral-600  bg-transparent rounded-md px-1  outline-none text-[16px] py-1"
            />
            <Input
              id="cnfmNewPassInpt"
              onChange={hndlChng}
              placeholder="Confirm New Password"
              type="password"
              classData=" w-full border-[1px] border-solid border-neutral-700 placeholder:text-neutral-600  bg-transparent rounded-md px-1 outline-none text-[16px] py-1"
            />
          </motion.div>
        )}
        {state.mbl_num && (
          <motion.div
            initial={{ y: "10%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              ease: "easeInOut",
            }}
            exit={{ y: "10%", opacity: 0 }}
            className=" relative w-full flex justify-between  z-10 bg-stone-900"
          >
            <Button
              children="Cancel"
              id="cnlChngMblNmBtn"
              key="cnlChngMblNmBtn"
              classData="border-none h-full  px-2 text-[16px] rounded-md bg-neutral-700"
            />
            <Button children="Update" id="svMblNmBtn" key="svMblNmBtn" />
          </motion.div>
        )}
      </AnimatePresence>
      <MotionButton
        whileHover={{
          backgroundColor: "rgba(253,113,112,1)",
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        whileTap={{
          backgroundColor: "rgba(253,113,112,1)",
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        transition={{ duration: 1, ease: "backOut" }}
        children="Change Mobile Number"
        key="chngMblmNBtn"
        id="chngMblNmBtn"
        classData="shadow-xl rounded-md text-base border-solid bg-stone-800  my-2  py-2 cursor-pointer w-full relative z-10"
      />

      <AnimatePresence>
        {state.mbl_num && (
          <motion.div className=" flex justify-center flex-col gap-y-3 mt-2 relative z-10 bg-stone-900">
            <Input
              id="newMblNmInpt"
              onChange={hndlChng}
              maxLength={13}
              placeholder="New Mobile Number"
              type="text"
              classData=" w-full border-[1px] border-solid border-neutral-700 placeholder:text-neutral-600  bg-transparent rounded-md px-1  outline-none text-[16px] py-1"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <p
        className=" text-base text-neutral-600 text-center absolute bottom-12 px-2 "
        onCopy={stopCopy_Cut}
        onCut={stopCopy_Cut}
      >
        **Note:- Till Now we don't have Implement such kind of secure
        functionality on changing Password and Mobile Number. We have just
        Implemnted very simple Updation Anamoly where you can just simply click
        and update your Password or Mobile Number. But, we give assurance that
        in upcoming future we'll implenment a Strong and secure Anamoly for
        updation of both of these things. So tilll then please Co-operate with
        us <br />
        <br /> <span className="text-neutral-400">~~Thank You Team Blip</span>
      </p>
    </div>
  );
};

export default Privacy;

const Button = forwardRef(
  (
    {
      children,
      id,
      disabled = false,
      classData = `border-none h-full  px-2 text-[16px] rounded-md bg-pinkGradient`,
    },
    ref
  ) => {
    return (
      <button
        id={id}
        ref={ref}
        disabled={disabled}
        className={`${classData}`}
        style={{ outline: "none", border: "none" }}
      >
        {children}
      </button>
    );
  }
);
