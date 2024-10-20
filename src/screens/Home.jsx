import { useToast } from "@chakra-ui/toast";
import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Loader from "../components/Loader";
import { Context, serverUrl, socketServer } from "../context/StateProvider";

const Home = () => {
  const SideBar = lazy(() => import("../components/SideBar"));
  const BG = lazy(() => import("../components/BG"));
  const toast = useToast();

  let { getAllFriends, getProfile, setOnlineUsers, socket, user, onlineUsers } =
    useContext(Context);

  const navigate = useNavigate();
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  let token = JSON.parse(localStorage.getItem("token"));

  const initializeSocket = () => {
    // Setup listeners
    socket.current.on("connect", () => {
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
    // console.log("Useffect called Again");
    socket.current = io(`${socketServer}`, { query: { token } });

    const asyncInit = async () => {
      if (socket.current) {
        setIsSocketConnected(true);
      }
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
        socket.current.off("join-room");
        socket.current.off("error");
        socket.current.off("update-active-users");
        socket.current.off("call-update-users");
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
  }, [token]);

  useEffect(() => {
    const online = async () => {
      let friends = user?.friends;
      if (socket.current && friends?.length > 0) {
        socket.current.emit("call-update-users");
        console.log("Trigerred:", socket.current);
        socket.current.on("update-active-users", (arr, callback) => {
          console.log("Listening updated users: ", arr);
          let online = friends
            .map((fr) => (arr.includes(fr.friend_id) ? fr.friend_id : null))
            .filter((fr) => fr !== null);

          setOnlineUsers(online.length > 0 ? online : []);

          if (typeof callback === "function") {
            callback({ msg: "Done" });
          }
        });
      }
    };

    online();

    return () => {
      if (socket.current) {
        socket.current.off("update-active-users");
        socket.current.off("call-update-users");
      }
      setOnlineUsers([]);
    };
  }, [user?.friends?.length, isSocketConnected]);

  console.log(isSocketConnected);

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
