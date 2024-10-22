import { faSmile, faStar } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faChevronLeft,
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
import {
  Context,
  headerOptions,
  serverUrl,
  socketServer,
} from "../context/StateProvider";
import ChatCard from "./ChatCard";
import { useToast } from "@chakra-ui/toast";
import { useAnimation, motion } from "framer-motion";

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
  const [chat, setChat] = useState({});
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const inputRef = useRef();

  const animations = [useAnimation(), useAnimation()];

  let isActive = useRef(null);

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
      setInput(e.target.value);
    }, 400);

    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    fetchChats(userId)
      .then((res) => {
        setChat(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  useEffect(() => {
    if (chat && (!messages || messages.length === 0)) {
      setMessages(chat.allMessages);
    }
  }, [chat, messages?.length]);

  function handleAddFriend() {
    addToFriends(anotherUser._id);
  }

  function sendMessage(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!input) {
      return toast({
        title: "Message is empty",
        duration: 2000,
        isClosable: true,
        status: "warning",
      });
    }

    let msgObj = {
      sender_id: user._id,
      receiver_id: anotherUser._id,
      message: input,
    };
    setInput("");

    socket.current.emit("send-message", room.current, msgObj);
    // console.log("called");
    // console.log("Current room: ", room.current);
    // console.log("Message: ", msgObj);
    inputRef.current.value = "";
  }

  useEffect(() => {
    async function initiateChat() {
      // console.log("Chat initiated");
      socket.current.emit(
        "initiate-chat",
        anotherUser.user + user._id,
        user._id + anotherUser.user,
        anotherUser.user
      );
      room.current = user._id + anotherUser.user;
    }

    // let timer = setTimeout(() => {
    if (socket.current) {
      // console.log("Clled");
    }
    initiateChat();
    // }, 2000);

    return () => {
      // clearTimeout(timer);
      socket.current.off("initiate-chat");
    };
  }, [user]);

  useEffect(() => {
    if (socket.current !== null) {
      socket.current.on("new-message", (msg) => {
        // console.log("New Message");
        setMessages((prev) => [...prev, msg]);
      });

      socket.current.on("join-room", (roomID) => {
        toast({
          title: "Enjoy Chatting with your freind",
          status: "info",
          duration: 2000,
          position: "bottom",
          description: roomID,
          isClosable: true,
        });
      });

      socket.current.on("room-already", (roomID) => {
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

      socket.current.on("room-joined", (roomID) => {
        room.current = roomID;
      });
    }

    return () => {
      if (socket.current) {
        // console.log("Abhi zinda hu");
        socket.current.off("new-message");
        socket.current.off("room-already");
        socket.current.off("room-joined");
        socket.current.off("join-room");
      }
    };
  }, [socket.current]);

  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useLayoutEffect(() => {
    let width = window.innerWidth;
    if (width < 640) {
      if (show) {
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
    }
  }, [show]);

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

  // console.log(messages);

  // console.log("Current Room: ", room.current);

  return (
    <div
      className=" text-white w-full h-full flex justify-center  flex-col relative z-[99] bg-[#1f1f22] sm:bg-transparent overflow-hidden"
      // style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <header className=" bg-[#1F1F22] w-full flex justify-between items-center h-20 border-b-[1px] border-b-gray-600 sm:border-none ">
        <nav className=" flex justify-between xl:justify-start items-center gap-x-6 h-full overflow-hidden w-5/6 xl:w-1/2">
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
        <nav className=" flex justify-end items-center pr-5 gap-x-3 w-1/2">
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
      <div className=" w-full h-full overflow-y-auto">
        <div
          className=" px-5 py-3 w-full h-full relative flex flex-col gap-y-3 overflow-y-auto"
          ref={chatRef}
        >
          {messages &&
            messages.map((chat) => (
              <ChatCard chat={chat} anotherUser={anotherUser} key={chat._id} />
            ))}
        </div>
      </div>
      <div className=" w-full  flex justify-center items-center mb-2 sm:mb-4 pt-1 sm:pt-3 relative bottom-1 sm:bottom-3 border-t-[1px] md:border-none border-t-gray-600">
        <form
          onSubmit={sendMessage}
          className=" flex justify-center items-center w-[90%] sm:w-10/12 gap-x-3"
        >
          <div className=" w-[90%] sm:w-4/5 bg-[#1F1F22] rounded-lg flex justify-center items-center px-2 py-1 shadow-lg md:shadow-sm  shadow-[rgba(255,255,255,0.1)]">
            <span>
              <FontAwesomeIcon icon={faSmile} className=" text-stone-500" />
            </span>
            <input
              ref={inputRef}
              className="h-[40px] w-full bg-transparent  text-[16px] px-2 outline-none"
              type="text"
              placeholder="send message"
              onChange={messageHandler}
            />
            <span>
              <FontAwesomeIcon icon={faPaperclip} className=" text-stone-500" />
            </span>
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
