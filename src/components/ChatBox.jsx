import { faSmile, faStar } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faChevronLeft,
  faClose,
  faFile,
  faImage,
  faPaperclip,
  faPaperPlane,
  faUserPlus,
  faXmark,
  faStar as filledStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Context, headerOptions, serverUrl } from "../context/StateProvider";
import ChatCard from "./ChatCard";
import { useToast } from "@chakra-ui/toast";
import { useAnimation, motion, delay } from "framer-motion";

const ChatBox = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const toast = useToast();

  let room = useRef();
  let chatRef = useRef();

  let { anotherUser } = state;
  const navigate = useNavigate();

  const {
    fetchChats,
    addToFriends,
    friends,
    onlineUsers,
    socket,
    user,
    setIsAuthenticated,
  } = useContext(Context);
  const [messages, setMessages] = useState([]);
  // const [chat, setChat] = useState({});
  const [message, setMessage] = useState({ text: "", files: [] });
  const [show, setShow] = useState(false);
  const [showfilesDragger, setShowFilesDragger] = useState(false);
  const [docsModal, setDocsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));

  const animations = [
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
  ];

  const inputRef = useRef();
  const filesDragger = useRef();
  const formData = useRef(new FormData());
  const isActive = useRef(null);
  const hasMore = useRef(true);
  const isFetching = useRef(false);
  const next = useRef(0);
  const fetchRef = useRef(null);
  const chatParent = useRef(null);
  const chatPrvsHght = useRef(0);

  let resFiles = [];

  // let token = JSON.parse(localStorage.getItem("token"));

  onlineUsers.includes(anotherUser._id)
    ? (isActive.current = true)
    : (isActive.current = false);

  let timer = useRef();
  const messageHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setMessage((prev) => ({ ...prev, text: e.target.value }));
    }, 400);

    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const chatFetchingHelper = useCallback(() => {
    if (friends.includes(anotherUser)) {
      if (hasMore.current === true) {
        fetchChats(userId, next.current)
          .then((res) => {
            setMessages((prev) => [
              ...res?.chats[0]?.messages[0]?.pgntdRlst,
              ...prev,
            ]);
            isFetching.current = true;

            hasMore.current = res.hasMore;
            next.current = res.next;
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [friends?.length]);

  useEffect(() => {
    chatFetchingHelper();
  }, [userId]);

  // useEffect(() => {
  //   if (chat && chat.messages && (!messages || messages.length === 0)) {
  //     // setMessages(chat?.messages[0]?.pgntdRlst[0]);
  //     setMessages((prev) => [...chat?.messages[0]?.pgntdRlst, ...prev]);
  //   }
  // }, [chat, messages?.length]);

  function handleAddFriend() {
    addToFriends(anotherUser._id);
  }

  const sendMessage = useCallback(
    async (e, message) => {
      e.preventDefault();
      e.stopPropagation();

      if (!message?.text) {
        return toast({
          title: "Message is empty",
          duration: 2000,
          isClosable: true,
          status: "warning",
        });
      }

      const files = [];

      message.files?.forEach((fl) => {
        // console.log("File:", fl);
        files.push({ url: `${user.pic}`, type: `${fl.name.split(".")[1]}` });
      });

      let msgObj = {
        sender_id: user._id,
        receiver_id: anotherUser._id,
        message: { text: message.text, files: files },
      };

      socket.current.emit("send-message", room.current, msgObj);
      setMessage({ text: "", files: [] });
      setShowFilesDragger(false);
      setDocsModal(false);
      inputRef.current.value = "";

      if (msgObj?.message?.files?.length > 0) {
        let res = await fetch(`${serverUrl}/messages/upload-files`, {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
          body: formData.current,
        });

        res = await res.json();
        resFiles = res.files;
        socket.current.emit("files-uploaded");
      }

      // setShow(false);
      formData.current = new FormData();

      console.log("Current Room ID: ", room.current);

      // console.log("Current room: ", room.current);
      // console.log("Message: ", msgObj);

      return resFiles;
    },
    [user]
  );

  useEffect(() => {
    async function initiateChat() {
      // console.log("Chat initiated");
      // console.log("Socket: ",socket.current);
      socket.current?.emit(
        "initiate-chat",
        anotherUser.user + user._id,
        user._id + anotherUser.user,
        anotherUser.user
      );
      room.current = user._id + anotherUser.user;

      socket.current?.once("reinitiate-chat", () => {
        initiateChat();
      });
    }

    // let timer = setTimeout(() => {
    // if (socket.current) {
    // console.log("Clled");
    // }
    initiateChat();
    // }, 2000);

    return () => {
      // clearTimeout(timer);
      socket.current.off("initiate-chat");
      socket.current.off("reinitiate-chat");
    };
  }, [user, socket.current]);

  // console.log("Messages Initialy: ", messages);

  useEffect(() => {
    socket.current?.on("new-message", (msg) => {
      console.log("New Message");
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
      setMessages((prev) => [...prev, msg]);
    });

    socket.current?.on("join-room", (roomID) => {
      toast({
        title: "Enjoy Chatting with your freind",
        status: "info",
        duration: 2000,
        position: "bottom",
        description: roomID,
        isClosable: true,
      });
    });

    socket.current?.on("room-already", (roomID) => {
      toast({
        title: "Enjoy Chatting ",
        status: "info",
        duration: 2000,
        position: "bottom",
        description: roomID,
        isClosable: true,
      });
      socket.current.emit("join-room", roomID);
    });

    socket.current?.on("room-joined", (roomID) => {
      room.current = roomID;
    });

    socket.current?.on("files-uploaded", () => {
      console.log("Files Uploaded");
      const newArr = [...messages];
      newArr[newArr.length - 1].files = resFiles.files;
      setMessages(newArr);
    });

    return () => {
      if (socket.current) {
        // console.log("Abhi zinda hu");
        socket.current?.off("new-message");
        socket.current?.off("room-already");
        socket.current?.off("room-joined");
        socket.current?.off("join-room");
      }
    };
  }, [socket.current]);

  useLayoutEffect(() => {
    if (isFetching.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight - chatPrvsHght.current;
      isFetching.current = false;
    } else {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    chatPrvsHght.current = chatRef.current.scrollHeight;
  }, [messages?.length]);

  useLayoutEffect(() => {
    if (show) {
      // console.log("Called show");
      animations[0].start({
        opacity: 1,
        x: 0,
        transition: { duration: 1, ease: "circInOut", type: "spring" },
      });
      animations[1].start({
        y: 0,
        transition: {
          duration: 1,
          ease: "circInOut",
          type: "spring",
          delay: 1.1,
        },
      });
    } else {
      console.log("Called not show");
      animations[1].start({
        y: "-150%",
        transition: {
          duration: 0.6,
          ease: "circInOut",
          type: "spring",
        },
      });
      animations[0].start({
        opacity: 0,
        x: "100%",
        delay: 0.8,
        transition: { duration: 0.6, ease: "circInOut", type: "spring" },
      });
    }

    if (docsModal) {
      animations[2].start({
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          delay: 0.2,
          ease: "ease-in-out",
          type: "spring",
        },
      });
    } else {
      animations[2].start({
        y: "20%",
        scale: 0,
        transition: {
          duration: 0.4,
          delay: 0.2,
          ease: "ease-in-out",
          type: "spring",
        },
      });
    }

    if (loading) {
      animations[4].start({
        y: "4rem",
        transition: { duration: 0.7, ease: "backOut" },
      });
      animations[5].start({
        rotate: [0, 360],
        transition: { duration: 0.5, repeat: Infinity, ease: "linear" },
      });
    } else {
      animations[5].stop();
      animations[4].start({
        y: 0,
        transition: { duration: 0.5, ease: "backIn" },
      });
    }
  }, [show, docsModal, loading]);

  function handleBack(e) {
    navigate("/");
    socket.current.emit("leave-room", room.current);
  }

  function showOpener(e) {
    e.stopPropagation();
    setShow(true);
  }

  function handleClose(e) {
    e.stopPropagation();
    setShow(false);
  }

  function hndleFileDrgrCls(e) {
    e.stopPropagation();
    setShowFilesDragger(false);
    setMessage((prev) => ({ ...prev, files: [] }));
    console.log("Called");
  }

  async function handleAddToFav(e, action) {
    try {
      let res = await fetch(`${serverUrl}/user/friends/favourites/add`, {
        headers: headerOptions,
        method: "PUT",
        body: JSON.stringify({ friend_id: anotherUser._id, action }),
      });
      res = await res.json();

      if (res.success === true) {
        toast({
          title: `${res.message}`,
          status: "success",
          isClosable: true,
          duration: 2000,
          position: "bottom",
        });
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        localStorage.removeItem("token");
        navigate("/auth");
        setIsAuthenticated(false);
        return;
      }
      return toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "bottom",
      });
    }
    e.stopPropagation();
  }

  let isFav;

  if (friends && friends.length > 0) {
    isFav = friends.some(
      (fr) => fr.friend_id === anotherUser._id && fr.isFavourite
    );
  }

  async function docsModalHandler() {
    setDocsModal(!docsModal);
  }

  function handleFileInput(e) {
    const reader = new FileReader();

    const file = e.target.files[0];

    if (file.type.startsWith("image/")) {
      formData.current.append(`images`, file);
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        setMessage((prev) => ({
          ...prev,
          files: [
            ...prev.files,
            { name: file.name, data: reader.result, file },
          ],
        }));
      };
    } else {
      formData.current.append(`docs`, file);
      setMessage((prev) => ({
        ...prev,
        files: [...prev.files, { name: file.name, data: file.type, file }],
      }));
    }
  }

  async function openFilesDragger(e) {
    // filesDragger.current.style.display = "flex";
    setShowFilesDragger(true);
  }

  async function handleForm(e) {
    e.preventDefault();
    const files = await sendMessage(e, message);

    const newArr = [...messages];
    newArr[newArr.length - 1].files = files;
    setMessages(newArr);
  }

  // console.log("Messages: ", messages);

  useEffect(() => {
    const chatDiv = chatRef.current;
    chatDiv.addEventListener("scroll", scrollHandler);
    return () => {
      chatDiv.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollHandler = async (e) => {
    if (fetchRef.current !== null) {
      clearTimeout(fetchRef.current);
    }
    if (chatRef.current.scrollTop === 0 && !loading) {
      fetchRef.current = setTimeout(() => {
        chatFetchingHelper();
      }, 3000);
      setLoading(true);
    }
  };

  let orgDay;
  return (
    <div
      className=" text-white w-full h-full flex justify-center  flex-col relative z-[99] bg-[#1f1f22] sm:bg-transparent overflow-hidden"
      // style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <header className=" bg-[#1F1F22] w-full flex justify-between items-center h-20 border-b-[1px] border-b-gray-600 sm:border-none relative z-10 ">
        <nav className=" flex justify-between xl:justify-start items-center gap-x-6 h-full overflow-hidden w-5/6 sm:w-3/6 xl:w-1/2">
          <div
            className=" h-full flex justify-end items-center w-[11%]  xl:w-[7%] 2xl:w-[6%]  relative -left-[2px] "
            onClick={handleBack}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="pl-1 absolute z-[99] top-1/2 -translate-y-[0.8rem] right-2 cursor-pointer"
            />
            <div className=" h-full w-full ">
              <svg
                viewBox="0 0 65 143"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{
                        stopColor: "rgba(253,113,112,1)",
                        stopOpacity: 1,
                      }}
                    />
                    <stop
                      offset="100%"
                      style={{
                        stopColor: "rgba(240,80,153,1)",
                        stopOpacity: 1,
                      }}
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0.5 15V4.5V0L4.5 4.5L8.5 10L12.5 15L17 20L22.5909 25.5L26.5909 29L31.6188 32.2494L36.5909 35.5L44 39.5L49.5 42L53.5 44.5L57.5 48L61 51.5L63.5 56L64.5 61V66L63.5 71L62.5 75L59.5 79L56.5 82L52 86L48 90L44 93L39.5 96.5L34 101L29.5 105L24.9528 109.5L19.5 115.5L15 121L10 127.5L4.5 135.5L0.5 143V15Z"
                  fill="url(#gradient)"
                />
              </svg>
            </div>
          </div>

          <div className=" flex items-center">
            <div className=" rounded-full relative  h-[60px] w-[60px]">
              {onlineUsers.includes(anotherUser._id) && (
                <span className=" absolute p-1 rounded-full bg-green-500 -right-2 z-[999]   "></span>
              )}
              <img
                src={anotherUser?.pic}
                alt="chat_user_image"
                className=" w-full h-full object-cover object-center rounded-full"
              />
            </div>
            <div className=" pl-5 text-nowrap">
              <h3 className=" text-2xl md:text-xl lg:text-2xl  font-bold leading-5 ">
                {anotherUser?.fullName}
              </h3>
              <span className=" text-neutral-500 text-[13px] font-normal capitalize leading-3">
                {onlineUsers.includes(anotherUser?._id)
                  ? "Active"
                  : "Not Active"}
              </span>
            </div>
          </div>
        </nav>
        <nav className=" flex justify-end items-center pr-5 gap-x-3 w-1/3 sm:w-1/2">
          <button
            onClick={showOpener}
            className={` sm:hidden relative ${show ? "z-[98]" : "z-[100]"}`}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <motion.div
            initial={{ y: "0%" }}
            animate={animations[1]}
            className=" absolute sm:relative flex  w-screen sm:w-4/6 xl:w-2/4  left-0 top-8 sm:top-0 justify-evenly items-center z-[999]"
          >
            <div className="text-center flex justify-center items-center flex-col gap-y-2">
              {isFav ? (
                <button
                  onClick={(e) => {
                    handleAddToFav(e, "remove");
                  }}
                  className=" py-4 px-4  rounded-full bg-[#27272a] cursor-pointer flex justify-center shadow border-none outline-none"
                >
                  <FontAwesomeIcon icon={filledStar} className=" h-5" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    handleAddToFav(e, "add");
                  }}
                  className=" py-4 px-4  rounded-full bg-[#27272a] cursor-pointer flex justify-center shadow border-none outline-none"
                >
                  <FontAwesomeIcon icon={faStar} className=" h-5" />
                </button>
              )}
              <span className=" text-[14px] sm:hidden text-center break-words word-wrap">
                Add to favourites
              </span>
            </div>
            <div className="text-center flex justify-center items-center flex-col gap-y-2">
              <button
                className="  py-5 px-4 rounded-full bg-[#27272a] cursor-pointer border-none outline-none flex justify-center  shadow"
                disabled={
                  friends?.filter((fr) => fr.friend_id === anotherUser._id)
                    .length > 0
                    ? true
                    : false
                }
                onClick={handleAddFriend}
              >
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className={` h-5 ${
                    friends?.filter((fr) => fr.friend_id === anotherUser._id)
                      .length > 0
                      ? "text-neutral-500"
                      : "text-white"
                  } `}
                />
              </button>
              <span className=" text-[14px] sm:hidden text-center break-words word-wrap">
                Add to friends
              </span>
            </div>
          </motion.div>
        </nav>
        <motion.div
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={animations[0]}
          className=" h-screen w-full absolute md:relative flex sm:hidden justify-center items-center backdrop-blur-md z-[99] top-0 bg-[rgba(0,0,0,0.3)] "
        >
          {" "}
          <button className=" absolute bottom-4">
            <FontAwesomeIcon icon={faXmark} className=" h-8" />
          </button>
        </motion.div>
      </header>
      <div className=" w-full h-full overflow-y-auto" ref={chatParent}>
        <motion.div
          initial={{ y: 0 }}
          animate={animations[4]}
          className="overflow-hidden absolute   px-2 py-2 rounded-md text-slate-400 bg-[#404040]  top-8 right-1/2 flex items-center justify-center -translate-x-[50%] z-[9]"
        >
          <motion.div initial={{ rotate: 0 }} animate={animations[5]}>
            <div className=" rounded-full bg-[#404040] border-[rgba(253,113,112,1)] border-2 h-[25px] w-[25px]">
              {" "}
            </div>
            <div className=" absolute top-4  bg-[#404040]  h-[25px] w-[25px] rounded-full">
              {" "}
            </div>
          </motion.div>
        </motion.div>
        <div
          className=" px-5 py-3 w-full h-full relative flex flex-col gap-y-3 overflow-y-auto"
          ref={chatRef}
        >
          {" "}
          {messages &&
            messages.map((chat) => {
              let date = new Date(chat.createdAt);
              let tempDay = new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(date);

              const showDateHeader = orgDay !== tempDay; // if different, show it
              orgDay = tempDay;

              return (
                <React.Fragment key={chat._id}>
                  <div className="  flex justify-center items-center w-full">
                    {" "}
                    {showDateHeader && (
                      <div className="p-1 px-2 rounded-lg bg-stone-700 text-white text-[10px] font-semibold">
                        {tempDay}
                      </div>
                    )}
                  </div>

                  <ChatCard
                    chat={chat}
                    anotherUser={anotherUser}
                    key={chat._id}
                  />
                </React.Fragment>
              );
            })}
        </div>
      </div>
      <div className=" w-full  flex justify-center items-center mb-2 sm:mb-4 pt-1 sm:pt-3 relative bottom-1 sm:bottom-3 border-t-[1px] md:border-none border-t-gray-600">
        <form
          id="msg_form"
          onSubmit={handleForm}
          className=" flex justify-center items-center w-[90%] sm:w-10/12 gap-x-3 relative"
        >
          <div className=" w-[90%] sm:w-4/5 bg-[#1F1F22] rounded-lg flex justify-center items-center px-2 py-1 shadow-lg md:shadow-sm  shadow-[rgba(255,255,255,0.1)] relative">
            <div
              // initial={{ height: "15vmax" }}
              // animate={{ height: "9vmax" }}
              // transition={{ duration: 2, delay: 2 }}
              className={`${
                message?.files?.length > 0 ? "flex" : "hidden"
              } absolute bg-stone-800 rounded-md left-4 bottom-14 p-2 pt-4   ${
                showfilesDragger ? "w-9/12" : "w-auto"
              }`}
            >
              {/* <div
                ref={filesDragger}
                className={` gap-x-3 gap-y-4 p-3 w-full ${
                  showfilesDragger ? "flex " : "grid"
                }  ${
                  message.files.length > 3 ? "grid-cols-2" : " grid-cols-3"
                } `}
              > */}
              <div
                ref={filesDragger}
                className={` gap-x-3 gap-y-4 p-3 w-full min-w-[37vmax] flex overflow-x-auto`}
              >
                {message?.files?.map((file, idx) => {
                  if (!showfilesDragger && idx <= 3) {
                    if (file.data.startsWith("application/")) {
                      return (
                        <div
                          key={file.name}
                          className="h-[100px] w-[100px] rounded-md text-center bg-emerald-600 text-gray-300 text-[12px] font-medium flex justify-center items-center"
                        >
                          <span>{file.data.split("/")[1].toUpperCase()}</span>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={file.name}
                          className=" flex justify-center items-center h-[100px] w-[100px] relative bg-[rgba(1,1,1,0.8)] rounded-md"
                          onClick={(e) => {
                            if (!showfilesDragger) {
                              openFilesDragger(e);
                            }
                          }}
                        >
                          {!showfilesDragger &&
                            idx === 3 &&
                            message?.files?.length > 4 && (
                              <span className=" bg-[rgba(1,1,1,0.7)] text-gray-400 font-normal text-[14px] absolute ">
                                {message.files.length - (idx + 1)} more
                              </span>
                            )}
                          <img
                            className={` h-full w-full rounded-md ${
                              !showfilesDragger &&
                              idx === 3 &&
                              message?.files?.length > 4 &&
                              "opacity-10"
                            } object-cover object-center`}
                            src={file.data}
                          />
                        </div>
                      );
                    }
                  } else {
                    if (file.data.startsWith("application/")) {
                      return (
                        <div
                          key={file.name}
                          className="h-[100px] w-[100px] rounded-md text-center bg-emerald-600 text-gray-300 text-[12px] font-medium flex justify-center items-center"
                        >
                          <span>{file.data.split("/")[1].toUpperCase()}</span>
                        </div>
                      );
                    } else {
                      return (
                        <div className=" flex justify-center items-center h-[100px] w-[100px] relative bg-[rgba(1,1,1,0.8)] rounded-md">
                          <img
                            key={file.name}
                            className={` h-full w-full rounded-md  object-cover object-center`}
                            src={file.data}
                          />
                        </div>
                      );
                    }
                  }
                })}
              </div>
              <button
                className=" absolute right-2 -top-1 outline-none border-none"
                style={{ outline: "none" }}
                id="closeDragger"
                onClick={hndleFileDrgrCls}
                type="button"
              >
                <FontAwesomeIcon
                  icon={faClose}
                  className=" h-[18px] w-[18px] text-white"
                />
              </button>
            </div>
            <span
              onClick={(e) => {
                console.log("Called Smile");
                e.stopPropagation();
                setLoading(!loading);
              }}
            >
              <FontAwesomeIcon icon={faSmile} className=" text-stone-500" />
            </span>
            <input
              ref={inputRef}
              className="h-[40px] w-full bg-transparent  text-[16px] px-2 outline-none"
              type="text"
              placeholder="send message"
              onChange={messageHandler}
            />
            <div className=" relative">
              <motion.div
                initial={{ y: "20%", scale: 0 }}
                animate={animations[2]}
                className=" flex justify-between items-center text-stone-500 gap-x-4 absolute py-3  p-4 rounded-md bg-stone-800 bottom-12 right-3 shadow-md"
              >
                <div className=" cursor-pointer">
                  <input
                    className=" hidden"
                    id="docs_input"
                    name="docs"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.csv,.ppt,.pptx,.odt,.ods,.odp"
                    onChange={handleFileInput}
                  />
                  <label
                    htmlFor="docs_input"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faFile} />
                    <span className=" text-[12px]">document</span>
                  </label>
                </div>
                <div className=" cursor-pointer">
                  <input
                    className=" hidden"
                    id="image_input"
                    name="image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp"
                    onChange={handleFileInput}
                  />
                  <label
                    htmlFor="image_input"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faImage} />
                    <span className=" text-[12px]">image</span>
                  </label>
                </div>
              </motion.div>
              <span className=" cursor-pointer" onClick={docsModalHandler}>
                <FontAwesomeIcon
                  icon={faPaperclip}
                  className=" text-stone-500"
                />
              </span>
            </div>
          </div>
          <button
            type="submit"
            className=" bg-transparent  outline-none flex justify-center items-center border-none"
            style={{ outline: "none" }}
          >
            <span className=" rounded-full py-0  flex justify-center items-center border-solid border-[rgba(253,113,112,1)] border-[3px] sm:shadow-md shadow-[rgba(253,113,112,1)]">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className=" p-3 rounded-full  m-1"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(253,113,112,1) 0%, rgba(240,80,153,1) 100%)",
                }}
              />
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(ChatBox);
