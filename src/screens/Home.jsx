import { useToast } from "@chakra-ui/toast";
import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BG from "../components/BG.jsx";
import SideBar from "../components/SideBar.jsx";
import { Context, socketServer } from "../context/StateProvider";
import { io } from "socket.io-client";
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
  } = useContext(Context);

  const navigate = useNavigate();

  let token = JSON.parse(localStorage.getItem("token"));

  // connecting the socket and added an event listeners if someone created chat room
  const initializeSocket = () => {
    // Setup listeners
    socket.current.on("connect", () => {
      if (isReconnect.current) {
        socket.current.emit("reinitiate-chat");
      } else {
        isReconnect.current = true;
      }
      console.log("Socket connected");
    });

    socket.current.on("error", handleSocketError);
  };

  //it'll shows the error occurred in socket connection and navigate to /auth
  const handleSocketError = (error) => {
    toast({
      title: error.name,
      position: "bottom",
      status: "error",
      duration: 3000,
      isClosable: true,
      description: error.message,
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
    const asyncInit = async () => {
      // Validate Auth
      if (token) {
        // Authenticated flow
        socket.current = io(`${socketServer}`, {
          query: { token },
          reconnection: true,
          reconnectionDelay: 1000,
          timeout: 60000,
        });

        // setIsAuthenticated(true);

        await getProfile(token); // wait to get profile info
        // await getAllFriends(token);

        //Socket listener function
        initializeSocket();
      } else {
        // setIsAuthenticated(false);
        navigate("/auth");
      }
    };

    asyncInit()
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});

    return () => {
      socket.current?.off("join-room");
      socket.current?.off("error");
      socket.current?.off("new-message");
      socket.current?.off("room-already");
      socket.current?.off("room-joined");
      socket.current?.off("join-room");
      socket.current?.off("initiate-chat");

      console.log("Called Disconnect");
      socket.current?.disconnect();
      socket.current?.on("disconnect", (id) => {
        console.log(id);
        // toast({
        //   title: `User ${id} left the chat`,
        //   duration: 2000,
        //   status: "info",
        //   position: "bottom",
        // });
      });
    };
  }, []);

  useEffect(() => {
    const online = async () => {
      // console.log("Friends: ", friends);
      if (socket.current && friends?.length > 0) {
        socket.current.emit("call-update-users");

        // console.log("Called ");
        socket.current?.on("update-active-users", hndlUpdtActvs);
      }
    };

    online();

    return () => {
      socket.current?.off("update-active-users");

      socket.current?.off("call-update-users");
    };
  }, [friends?.length]);

  // O

  // if (socket.current) {
  //   console.log("True");
  // }

  function hndlUpdtActvs(arr, callback) {
    let online = friends
      .map((fr) => (arr.includes(fr.friend_id) ? fr.friend_id : null))
      .filter((fr) => fr !== null);

    console.log("Online In Home: ", online);
    console.log("Friends: ", friends);
    console.log("Listening updated Arr: ", arr);

    const isIncludes = online
      .map((user) => (onlineUsers.includes(user) ? true : false))
      .some((item) => item === true);

    // console.log("Is Includes: ", isIncludes);

    !isIncludes && setOnlineUsers(online);

    if (typeof callback === "function") {
      callback({ msg: "Done" });
    }
  }

  return (
    <div className="h-screen w-screen">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.5, delay: 3.3, ease: "easeOut" }}
        className=" flex justify-center items-center absolute h-dvh w-dvw bg-[#1F1F22] z-[999]"
      >
        <div className="flex flex-col items-center justify-center  text-white shadow-lg drop-shadow-lg drop-shadow-purpleGradient">
          <div>
            <FontAwesomeIcon
              icon={faMessage}
              className="  text-white h-[60px] w-[60px] absolute -right-10 -top-10"
            />
            <h1 className=" text-9xl font-bold text-white  uppercase tracking-wider ">
              Blip
            </h1>
          </div>
          <h4>Moments, Not Monologues.</h4>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: 1,
              transformOrigin: "left",
              transition: { duration: 3, ease: "easeInOut" },
            }}
            className=" w-2/3 h-1 rounded-md bg-white mt-4"
          ></motion.div>
        </div>
      </motion.div>
      <div className="flex h-full w-full">
        <SideBar />
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
