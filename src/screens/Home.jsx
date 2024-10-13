import { useToast } from "@chakra-ui/toast";
import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Loader from "../components/Loader";
import { Context } from "../context/StateProvider";

const Home = () => {
  const SideBar = lazy(() => import("../components/SideBar"));
  const BG = lazy(() => import("../components/BG"));
  const toast = useToast();

  let {
    setIsAuthenticated,
    friends,
    getAllFriends,
    getProfile,
    setOnlineUsers,
    socket,
    onlineUsers,
  } = useContext(Context);

  const navigate = useNavigate();

  let token = JSON.parse(localStorage.getItem("token"));
  const [localOnline, setLocalOnline] = useState([]);

  const initializeSocket = () => {
    socket.current = io("http://localhost:3000", { query: { token } });
    // Setup listeners
    socket.current.on("connect", () => {
      console.log("Socket connected");
    });
    socket.current.on("update-active-users", (arr) => {
      console.log("Listening updated users");
      setLocalOnline(arr);
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
    console.log("Useffect called Again");
    socket.current = io("http://localhost:3000", { query: { token } });

    const asyncInit = async () => {
      // Validate Auth
      if (token) {
        // Authenticated flow

        // setIsAuthenticated(true);

        //Get init info
        await getProfile(); // wait get profile info
        await getAllFriends();

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
        socket.current.off("update-active-users");
        socket.current.off("join-room");
        socket.current.off("error");
        socket.current.disconnect();
        socket.current.on("disconnect", (id) => {
          toast({
            title: `User ${id} left the chat`,
            duration: 2000,
            status: "info",
            position: "bottom",
          });
        });
      }
    };
  }, []);

  useEffect(() => {
    const online = async () => {
      if (friends.length > 0) {
        // console.log("Friends: ", friends);
        // console.log("Local Friends: ", localOnline);

        let users = friends.filter((fr) => localOnline.includes(fr.friend_id));
        setOnlineUsers(users.map((fr) => fr.friend_id));
        // console.log("This one is called");
        // console.log("Online: ", users);
        // console.log("Friends: ", friends);
        // console.log("Local Online: ", localOnline);
      }
    };

    online();
  }, [friends.length, localOnline]);

  // console.log(onlineUsers);

  // online();
  console.log("Home Rendered");
  // console.log("Friends in Home: ", friends);

  // if (loading) {
  //   return <Loader />;
  // }
  // console.log(loading);

  return (
    <div className="h-screen w-screen">
      <div className="flex h-full w-full">
        <Suspense fallback={<Loader />}>
          <SideBar />
        </Suspense>
        <div className=" h-full w-full bg-[#1F1F22]">
          <div className=" absolute  h-full overflow-hidden w-full">
            <Suspense fallback={<Loader />}>
              <BG />
            </Suspense>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);
