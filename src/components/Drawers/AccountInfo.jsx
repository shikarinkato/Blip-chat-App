import { useToast } from "@chakra-ui/toast";
import { faPen, faX } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faUserPen } from "@fortawesome/free-solid-svg-icons/faUserPen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Context } from "../../context/StateProvider";
import useDebounce from "../../custom/useCallbackedDebounce";
import { readFile } from "../../functions/Methods";
import { AnimatePresence, motion } from "framer-motion";
import { updtPicAndFname, updtUsrNm } from "../../functions/APIs";
import Timer from "../utility/Timer";
import { form, time } from "framer-motion/client";

function reducer(state, action) {
  switch (action.type) {
    case "emlOtp":
      return { eml: "otpPndng" };
    case "sndOtp":
      return { eml: "otpSnt" };
    case "sbmtOtp":
      return { eml: true };
    case "sbmtEml":
      return { eml: false };
    case "close":
      return { eml: false };

    default:
      return { eml: false };
  }
}

const AccountInfo = ({ closeAll }) => {
  const [state, dispatch] = useReducer(reducer, { eml: false });

  const [edit, setEdit] = useState({
    fName_pic: false,
    uName: false,
  });

  const [otp, setOTP] = useState(0);
  const [newEml, setNewEml] = useState("");
  const [otpTime, setOTPTime] = useState(60);

  const [userDetails, setUserDetails] = useState({
    pic: "",
    userName: "",
    fullName: "",
    email: "",
  });

  const fNmRef = useRef("");
  const fNameRef = useRef(null);
  const usrNmRef = useRef("");
  const uNameRef = useRef(null);
  const emlRef = useRef("");
  const emailRef = useRef(null);

  const uNmBtnRef = useRef(null);
  const emlBtnRef = useRef(null);
  const rsndBtnRef = useRef(null);

  const MotionIcon = motion.create(FontAwesomeIcon);
  const MotionInput = motion.create(Input);

  const formData = useRef(new FormData());
  const { user, setUser } = useContext(Context);

  const toast = useToast();

  const fNameDbnc = useDebounce(
    useCallback((e) => {
      setUserDetails((prev) => ({ ...prev, fullName: e.value }));
    }, []),
    400
  );

  const uNameDbnc = useDebounce(
    useCallback((e) => {
      setUserDetails((prev) => ({ ...prev, userName: e.value }));
    }, []),
    1000,
    "uName"
  );

  const emlDbnc = useDebounce(
    useCallback((e) => {
      setUserDetails((prev) => ({ ...prev, email: e.value }));
    }, []),
    400
  );

  const otpDbnc = useDebounce(
    useCallback((e) => {
      setOTP(e.value);
    }, []),
    400
  );

  const newEmlDbnc = useDebounce(
    useCallback((e) => {
      setNewEml(e.value);
    }, []),
    400
  );

  useEffect(() => {
    if (user) {
      setUserDetails({
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        pic: user.pic,
      });

      fNmRef.current = user.fullName;
      usrNmRef.current = user.userName;
      emlRef.current = user.email;
    }
  }, [user]);

  const setInputs = useCallback(() => {
    // ("Setting Inputs");
    if (fNameRef.current) {
      fNameRef.current.value = fNmRef.current;
    }
    if (uNameRef.current) {
      uNameRef.current.value = usrNmRef.current;
    }
    if (emailRef.current) {
      emailRef.current.value = emlRef.current;
    }
  }, [fNameRef, emailRef, uNameRef]);

  useEffect(() => {
    setInputs();
  }, [edit.fName_pic, edit.uName, state.eml]);

  useLayoutEffect(() => {
    let timer;
    if (state.eml === "otpPending") {
      timer = setTimeout(() => {
        rsndBtnRef.current.disabled = false;
      }, 60 * 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [rsndBtnRef, state.eml]);

  let editUser = (e) => {
    e.stopPropagation();
    setUserDetails((prev) => ({ ...prev, fullName: user.fullName }));
    setUserDetails((prev) => ({ ...prev, pic: user.pic }));
    formData.current.delete("pic");
    setEdit((prev) => ({ ...prev, fName_pic: !prev.fName_pic }));
  };

  const hndlChng = useCallback(async (e) => {
    e.stopPropagation();
    // e.preventDefault();

    const id = e.target.id;
    switch (id) {
      case "pic":
        let file = e.target.files[0];
        if (formData.current.has("pic")) {
          formData.current.set("pic", file);
        } else {
          formData.current.append("pic", file);
        }
        file = await readFile(file);
        setUserDetails((prev) => ({ ...prev, pic: file }));
        break;
      case "fullName":
        fNameDbnc(e.target);
        break;
      case "userName":
        const res = await uNameDbnc(e.target);
        toast({
          title: `${res.message}`,
          duration: 2000,
          isClosable: true,
          status: res.success === true ? "success" : "warning",
        });
        break;
      case "email":
        emlDbnc(e.target);
        break;
      case "otpInput":
        // e.target.value.length < 6

        otpDbnc(e.target);
        // : toast({ title: "OTP shouldn't be more then 6 Digits" });
        break;
      case "newEmlInpt":
        newEmlDbnc(e.target);
        break;
      default:
        toast({
          title: "No Input for Change",
          duration: 2000,
          isClosable: true,
          status: "warning",
        });
        break;
    }
  }, []);

  const edtUnm_eml = useCallback(
    async (e) => {
      e.stopPropagation();
      const id = e.target.id;

      switch (id) {
        case "uNameBtn":
          setEdit((prev) => ({ ...prev, uName: true }));
          dispatch({ type: "close" });
          break;
        case "uNmUpdtBtn":
          if (userDetails.userName !== user.userName) {
            const res = await updtUsrNm(userDetails.userName);
            toast({
              title: `${res.message}`,
              duration: 2000,
              position: "top",
              status: res.success ? "success" : "error",
              isClosable: true,
            });
            setUser(res.fndUsr);
          }
          toast({
            title: "Old Username can't be set as New One",
            duration: 2000,
            position: "top",
            status: "warning",
            isClosable: true,
          });
          setEdit((prev) => ({ ...prev, uName: false }));

          break;
        case "emlBtn":
          dispatch({ type: "emlOtp" });
          setEdit((prev) => ({ ...prev, uName: false }));
          break;
        case "sndOtpBtn":
          dispatch({ type: "sndOtp" });
          setEdit((prev) => ({ ...prev, uName: false }));
          break;
        case "rsndOtpBtn":
          setOTPTime(60);
          break;
        case "sbmtOtpBtn":
          dispatch({ type: "sbmtOtp" });
          break;
        case "updtEmlBtn":
          dispatch({ type: "sbmteml" });
          break;
        case "cnluNmUpdtBtn":
          setEdit((prev) => ({ ...prev, uName: false }));
          break;
        case "cnlEmlUpdtBtn":
          dispatch({ type: "close" });
          break;
      }
    },
    [userDetails.userName]
  );

  const updtFNm_Pic = useCallback(
    async (e) => {
      e.stopPropagation();
      if (userDetails.fullName !== user.fullName) {
        formData.current.has("fName")
          ? formData.current.set("fName", userDetails.fullName)
          : formData.current.append("fName", userDetails.fullName);
      }
      if (formData.current.has("pic") || formData.current.has("fName")) {
        const res = await updtPicAndFname(formData.current);
        setUser(res.user);
        toast({
          title: `${res.message}`,
          status: res.success ? "success" : "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
      editUser(e);
    },
    [userDetails.fullName, user?.fullName]
  );

  return (
    <div className="text-white flex justify-start items-center">
      <div className=" w-full relative">
        {edit.fName_pic && (
          <button
            onClick={updtFNm_Pic}
            style={{ outline: "none" }}
            className=" outline-none border-none  px-1 absolute -top-1 left-5 cursor-pointer bg-green-700 text-white"
          >
            <FontAwesomeIcon icon={faCheck} className=" h-4 w-8 self-center" />
          </button>
        )}
        <button
          style={{ outline: "none" }}
          className={` outline-none  absolute -top-1 right-5 cursor-pointer border-none  ${
            edit.fName_pic && "bg-red-600  px-1 "
          } `}
        >
          <FontAwesomeIcon
            onClick={editUser}
            icon={edit.fName_pic ? faX : faUserPen}
            className={`${edit.fName_pic ? "h-4 w-8" : "h-7 w-7"}  self-center`}
          />
        </button>
        <div className="flex justify-center items-center flex-col gap-y-3 w-full py-8 border-b-2 border-solid border-b-stone-700">
          <div className=" h-20 w-20 rounded-full flex justify-center items-center relative">
            {edit.fName_pic && (
              <>
                <input
                  type="file"
                  name="user_pic"
                  id="pic"
                  className=" hidden"
                  accept="image/*"
                  onChange={hndlChng}
                />
                <label
                  htmlFor="pic"
                  className=" absolute -right-5 -top-3 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPen} />
                </label>
              </>
            )}
            <img
              src={userDetails?.pic}
              className=" object-cover object-center h-full w-full rounded-full"
            />
          </div>
          {edit.fName_pic ? (
            <div className="rounded-md border-[1px] border-stone-700 border-solid overflow-hidden">
              <Input
                inputRef={fNameRef}
                id="fullName"
                onchange={hndlChng}
                type="text"
              />
            </div>
          ) : (
            <span>{userDetails?.fullName}</span>
          )}
        </div>
        <div
          className=" flex justify-center items-center w-full flex-col gap-y-4 mt-4 px-4"
          onClick={edtUnm_eml}
        >
          <div className=" w-full text-base relative">
            <AnimatePresence>
              {edit.uName && (
                <motion.div
                  initial={{ y: "-10%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
                  exit={{ y: "-10%", opacity: 0 }}
                  className="relative z-10 -top-2 flex w-full justify-between px-4"
                >
                  <button
                    id="cnluNmUpdtBtn"
                    className=" border-none h-full px-2 rounded-md bg-neutral-700 text-white"
                    style={{ outline: "none" }}
                  >
                    Cancel
                  </button>
                  <button
                    id="uNmUpdtBtn"
                    className=" border-none h-full px-2   rounded-md bg-pinkGradient"
                    style={{ outline: "none" }}
                  >
                    Save
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className=" flex items-center border-[1px] border-stone-700 border-solid shadow-xl rounded-md overflow-hidden relative">
              <span className=" bg-stone-700 pr-2 rounded-tl-md rounded-bl-md text-center p-1 pl-2  ">
                UserName:{" "}
              </span>
              {edit.uName ? (
                <Input
                  inputRef={uNameRef}
                  id="userName"
                  onchange={hndlChng}
                  type="text"
                />
              ) : (
                <>
                  <span className="block  px-2 py-1 rounded-md ">
                    {userDetails?.userName}
                  </span>
                  {!edit.uName && (
                    <button
                      ref={uNmBtnRef}
                      id="uNameBtn"
                      className=" absolute border-none rounded-none h-full bg-stone-700 right-0 px-3"
                      style={{ outline: "none" }}
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className=" w-full  relative text-center">
            <AnimatePresence>
              {state.eml == "otpPndng" ? (
                <motion.button
                  initial={{ y: "-10%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
                  exit={{ y: "-10%", opacity: 0 }}
                  id="sndOtpBtn"
                  className=" relative border-none h-full -top-2 left-[35%] px-2 text-[16px]  z-10 rounded-md bg-pinkGradient"
                  style={{ outline: "none" }}
                >
                  Send OTP
                </motion.button>
              ) : (
                state.eml === "otpSnt" && (
                  <motion.div
                    initial={{ y: "10%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1,
                      ease: "easeInOut",
                    }}
                    exit={{ y: "-10%", opacity: 0 }}
                    className=" relative w-full flex justify-between -top-2"
                  >
                    <button
                      id="rsndOtpBtn"
                      ref={rsndBtnRef}
                      disabled={true}
                      className=" border-none h-full  px-2 text-[16px]  z-10 rounded-md bg-pinkGradient"
                      style={{ outline: "none" }}
                    >
                      Resend OTP
                    </button>
                    <button
                      id="sbmtOtpBtn"
                      className="border-none h-full  px-2 text-[16px]  z-10 rounded-md bg-pinkGradient"
                      style={{ outline: "none" }}
                    >
                      Submit
                    </button>
                  </motion.div>
                )
              )}
              {state.eml === true && (
                <motion.div
                  initial={{ y: "10%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1,
                    ease: "easeInOut",
                  }}
                  exit={{ y: "-10%", opacity: 0 }}
                  className=" relative w-full flex justify-end -top-2"
                >
                  <button
                    id="updtEmlBtn"
                    className="border-none h-full  px-2 text-[16px]  z-10 rounded-md bg-pinkGradient"
                    style={{ outline: "none" }}
                  >
                    Update Email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className=" flex items-center text-[16px]  border-[1px] border-stone-700 border-solid shadow-xl rounded-md overflow-hidden relative">
              <span className=" bg-stone-700 pr-2 rounded-tl-md rounded-bl-md text-center  pl-2 py-1  ">
                Email:
              </span>{" "}
              <>
                <span className="block  px-2 rounded-md">
                  {userDetails?.email}
                </span>

                <button
                  ref={emlBtnRef}
                  id="emlBtn"
                  className=" absolute border-none rounded-none h-full bg-stone-700 right-0 px-3"
                  style={{ outline: "none" }}
                >
                  Edit
                </button>
              </>
            </div>
            <AnimatePresence>
              {state.eml === "otpSnt" && (
                <motion.div
                  initial={{ y: "-10%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1,
                    ease: "easeInOut",
                  }}
                  exit={{ y: "-10%", opacity: 0 }}
                  className=" w-full  mt-1 text-center"
                >
                  <Timer time={otpTime} content="Resend OTP in: " />
                  <Input
                    placeHolder="Enter OTP"
                    id="otpInput"
                    onchange={hndlChng}
                    inputRef={null}
                    type="text"
                    key="otpInput"
                  />
                </motion.div>
              )}

              {state.eml === true && (
                <motion.div
                  initial={{ y: "-10%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1,
                    ease: "easeInOut",
                  }}
                  exit={{ y: "-10%", opacity: 0 }}
                  className=" w-full  mt-3 text-center relative -left-2"
                >
                  <Input
                    placeHolder="Enter your New Email"
                    id="newEmlInpt"
                    onchange={hndlChng}
                    inputRef={null}
                    type="email"
                    key="newEmlInpt"
                  />
                </motion.div>
              )}

              {state.eml && (
                <MotionIcon
                  initial={{ y: "-10%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "backInOut" }}
                  exit={{ y: "-10%", opacity: 0 }}
                  id="cnlEmlUpdtBtn"
                  icon={faX}
                  className=" h-5 w-5 rounded-full bg-neutral-700 p-3 mt-2 cursor-pointer"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ data, type, onchange, id, inputRef, placeHolder = "" }) => {
  return (
    <input
      ref={inputRef}
      id={id}
      onChange={onchange}
      value={data}
      placeholder={placeHolder}
      type={type}
      maxLength={id === "otpInput" ? 6 : 50}
      className={`${
        (id === "fullname" || id === "otpInput" || id === "newEmlInpt") &&
        "border-[1px] border-stone-700 rounded-md pl-2 "
      }   bg-transparent outline-none mx-2 w-full placeholder:text-gray-300 placeholder:text-[15px] overflow-hidden`}
    />
  );
};

export default AccountInfo;
