import { useToast } from "@chakra-ui/toast";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BG from "../components/BG.jsx";
import SideBar from "../components/sidebar/SideBar.jsx";
import { Context, socketServer } from "../context/StateProvider";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const toast = useToast();

  let {
    friends,
    getProfile,
    setOnlineUsers,
    onlineUsers,
    socket,
    isReconnect,
    user,
  } = useContext(Context);

  const navigate = useNavigate();

  const loaderRef = useRef(null);

  let token = JSON.parse(localStorage.getItem("token"));

  // connecting the socket and added an event listeners if someone created chat room
  const initializeSocket = async () => {
    // Setup listeners
    socket.current?.on("connect", () => {
      if (isReconnect.current) {
        socket.current.emit("reinitiate-chat");
      } else {
        isReconnect.current = true;
      }
      ////("Socket connected");
    });

    socket.current?.on("error", handleSocketError);
  };

  //it'll shows the error occurred in socket connection and navigate to /auth
  const handleSocketError = (error) => {
    toast({
      title: "Kindly Login First",
      position: "bottom",
      status: "error",
      duration: 3000,
      isClosable: true,
      // description: error.message,
    });
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      localStorage.removeItem("token");
      navigate("/auth");
      // setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }

    let ldrTmout;
    // Authenticated flow

    // if (socket.current === null) {
    socket.current = io(`${socketServer}`, {
      query: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      timeout: 60000,
    });
    // }

    ////("Happening");
    ////("Socket: ", socket.current);

    const removeLoader = () => {
      if (ldrTmout) clearTimeout(ldrTmout);
      ldrTmout = setTimeout(() => {
        if (loaderRef.current) {
          loaderRef.current.remove();
        }
      }, 5000);
    };

    removeLoader();

    const asyncInit = async () => {
      // Validate Auth

      await initializeSocket();
      // setIsAuthenticated(true);

      await getProfile(token); // wait to get profile info
      // await getAllFriends(token);

      //Socket listener function
    };

    asyncInit()
      .catch((err) => {
        //(err);
      })
      .finally(() => {});

    socket.current?.on("disconnect", (id) => {
      ////(id);
      // toast({
      //   title: `User ${id} left the chat`,
      //   duration: 2000,
      //   status: "info",
      //   position: "bottom",
      // });
    });

    return () => {
      // //("Home Unmounted");
      clearTimeout(ldrTmout);
      socket.current?.off("join-room");
      socket.current?.off("error");
      socket.current?.off("new-message");
      socket.current?.off("room-already");
      socket.current?.off("room-joined");
      socket.current?.off("join-room");
      socket.current?.off("initiate-chat");

      ////("Called Disconnect");
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket.current && friends?.length > 0) {
      // //("called");
      socket.current?.emit("call-update-users");
      socket.current?.on("update-active-users", hndlUpdtActvs);
    }

    return () => {
      // //("Home Unmounted 2");

      socket.current?.off("call-update-users");
      socket.current?.off("update-active-users");
    };
  }, [friends?.length]);

  //  Baackground message issue

  const hndlUpdtActvs = useCallback(
    (arr, callback) => {
      let online = friends
        .map((fr) => (arr.includes(fr.friend_id) ? fr.friend_id : null))
        .filter((fr) => fr !== null);

      // //("Online In Home: ", online);
      // //("Friends: ", friends);
      // //("Listening updated Arr: ", arr);

      const isIncludes = online
        .map((user) => (onlineUsers.includes(user) ? true : false))
        .some((item) => item === true);

      // ////("Is Includes: ", isIncludes);

      !isIncludes && setOnlineUsers(online);

      if (typeof callback === "function") {
        callback({ msg: "Done" });
      }
    },
    [friends?.length, onlineUsers?.length]
  );

  //("Home Rendered");

  return (
    <div className="h-dvh w-dvw">
      <motion.div
        ref={loaderRef}
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.5, delay: 4, ease: "easeOut" }}
        className=" flex justify-center items-center absolute h-dvh w-dvw bg-[#1F1F22] z-[999]"
      >
        <div className="flex flex-col items-center justify-center  text-white relative   ">
          <div>
            <FontAwesomeIcon
              icon={faMessage}
              className="  text-white h-[40px] w-[40px] sm:h-[60px] sm:w-[60px] absolute right-2 -top-8 sm:-right-10 sm:-top-10"
            />
            <h1 className=" text-7xl sm:text-9xl font-bold text-white  uppercase tracking-wider ">
              Blip
            </h1>
          </div>
          <h4>Moments, Not Monologues.</h4>
          <div className=" w-2/3 h-1 rounded-md bg-gray-600 mt-4 relative overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                transition: { duration: 3, ease: "easeInOut" },
              }}
              style={{
                transformOrigin: "left",
              }}
              className=" w-full h-1 rounded-md bg-white absolute"
            ></motion.div>
          </div>
        </div>
      </motion.div>
      <div className="flex h-full w-full">
        <SideBar user={user} />
        {/* </Suspense> */}
        <div className=" h-full  w-full bg-[#1F1F22] relative ">
          <div className=" absolute   h-full overflow-hidden w-full">
            <BG />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);
