import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useCallback, useState } from "react";

const HelpAndFeedback = () => {
  const [edit, setEdit] = useState({ fdbck: false, qutn: false });
  const [fdbck, setFdbck] = useState("");
  const [qutn, setQutn] = useState("");

  const MotionButton = motion.create(Button);

  const hndlChng = useCallback((e) => {
    const id = e.target.id;
  }, []);

  const hndlClick = useCallback(
    (e) => {
      e.stopPropagation();

      const id = e.target.id;
      // alert(id);
      switch (id) {
        case "askQutnBtn":
          setEdit((prev) => ({ ...prev, fdbck: false }));
          setEdit((prev) => ({ ...prev, qutn: true }));
          break;
        case "addFdbckBtn":
          setEdit((prev) => ({ ...prev, qutn: false }));
          setEdit((prev) => ({ ...prev, fdbck: true }));
          break;

        default:
          break;
      }
    },
    [edit.fdbck, edit.qutn]
  );

  return (
    <div
      className=" w-full flex items-center flex-col  rounded-md gap-y-5  cursor-pointer  text-wrap text-white  "
      onClick={hndlClick}
    >
      <div className="bg-stone-800 w-10/12 rounded-md p-2 text-center ">
        <p className=" text-sm mt-2 text-neutral-500">
          **Note:- We don't have functionality of Chatting with us or sending
          E-mail for Help. But, we have Implement Ask Question and Add Feedback
          Functionality. So, yoou ask your Questions and Give us Feedback so we
          can improve Ourselves.
          <br />
          <br />
          <span className=" text-neutral-400">
            ~~~Thank You Team Blip(Chat App)
          </span>
        </p>
      </div>
      <div className=" w-11/12 flex justify-between">
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
          children="Add Feedback"
          id="addFdbckBtn"
          classData=" border-none h-full  px-2 p-3 text-[16px] rounded-md bg-neutral-700"
        />
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
          children="Ask Question"
          id="askQutnBtn"
          classData="border-none h-full  px-2 p-3 text-[16px] rounded-md bg-neutral-700"
        />
      </div>
      <AnimatePresence>
        {edit.fdbck && (
          <motion.div
            initial={{ y: "10%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              ease: "easeInOut",
            }}
            exit={{ y: "-10%", opacity: 0 }}
            className="w-11/12 flex justify-center flex-col  items-end gap-y-4"
          >
            <textarea
              className=" border-[1px] border-neutral-700 border-solid rounded-md outline-none w-full bg-transparent text-base p-1  "
              id="fdbckFld"
              key="fdbckFld"
              rows={5}
              placeholder="Give us Your Feedback!"
              style={{ scrollbarWidth: "none" }}
            />
            <Button
              children="Submit Feedback"
              id="sbmtFdbckBtn"
              key="sbmtFdbckBtn"
            />
          </motion.div>
        )}
        {edit.qutn && (
          <motion.div
            initial={{ y: "10%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              ease: "easeInOut",
            }}
            exit={{ y: "-10%", opacity: 0 }}
            className="w-11/12 flex justify-center flex-col  items-end gap-y-4"
          >
            <textarea
              className=" border-[1px] border-neutral-700 border-solid rounded-md outline-none w-full bg-transparent text-base p-1 "
              id="qutnFld"
              key="qutnFld"
              rows={5}
              style={{ scrollbarWidth: "none" }}
              placeholder="Write Down Your Question"
            />
            <Button
              children="Post Your Question"
              id="sbmtFdbckBtn"
              key="sbmtFdbckBtn"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpAndFeedback;

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
