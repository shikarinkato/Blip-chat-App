import { useToast } from "@chakra-ui/toast";
import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BG from "../components/BG.jsx";
import SideBar from "../components/SideBar.jsx";
import { Context, socketServer } from "../context/StateProvider";
import { io } from "socket.io-client";

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

    socket.current.on("join-room", (roomID) => {
      toast({
        title: "Enjoy Chatting with your friend",
        status: "info",
        duration: 2000,
        position: "bottom",
      });
    });

    socket.current.on("error", (error) => {
      handleSocketError(error);
    });
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
      if (socket.current) {
        socket.current.off("join-room");
        socket.current.off("error");
        socket.current.off("new-message");
        socket.current.off("room-already");
        socket.current.off("room-joined");
        socket.current.off("join-room");
        socket.current.off("initiate-chat");

        console.log("Called Disconnect");
        socket.current.disconnect();
        socket.current.on("disconnect", (id) => {
          console.log(id);
          // toast({
          //   title: `User ${id} left the chat`,
          //   duration: 2000,
          //   status: "info",
          //   position: "bottom",
          // });
        });
      }
    };
  }, []);

  useEffect(() => {
    const online = async () => {
      // console.log("Friends: ", friends);
      if (socket.current && friends?.length > 0) {
        // console.log("Called");
        // if (onlineUsers.length <= 0) {
        // }
        socket.current.emit("call-update-users");

        // console.log("Online Users: ", onlineUsers);
        socket.current.once("update-active-users", (arr, callback) => {
          // console.log("Listening updated users: ", arr);
          let online = friends
            .map((fr) => (arr.includes(fr.friend_id) ? fr.friend_id : null))
            .filter((fr) => fr !== null);

          // console.log("Online In Home: ", online);
          // console.log("Friends: ", friends);

          const isIncludes = online
            .map((user) => (onlineUsers.includes(user) ? true : false))
            .some((item) => item === true);

          // console.log("Is Includes: ", isIncludes);

          !isIncludes && setOnlineUsers(online);

          if (typeof callback === "function") {
            callback({ msg: "Done" });
          }
        });
      }
    };

    online();

    return () => {
      if (socket.current) {
        socket.current.off("call-update-users");
        socket.current.off("update-active-users");
      }
    };
  }, [friends?.length]);

  // if (socket.current) {
  //   console.log("True");
  // }

  return (
    <div className="h-screen w-screen">
      <div className="flex h-full w-full">
        {/* <Suspense
          fallback={
            <div className=" flex flex-col justify-start items-start h-full md:w-4/6 lg:w-6/12 xl:w-2/6 px-1 relative 2xl:min-w-[25vmax]">
              
              
             
            </div>
          }
        > */}
        <SideBar />
        {/* </Suspense> */}
        <div className=" h-full w-full bg-[#1F1F22]">
          <div className=" absolute  h-full overflow-hidden w-full">
            <BG />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);
