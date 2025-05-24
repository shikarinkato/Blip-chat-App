import { useToast } from "@chakra-ui/toast";
import React, {
  createContext,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
export let Context = createContext();
import { io } from "socket.io-client";

//extrcting the token
let token = JSON.parse(localStorage.getItem("token"));

export let serverUrl;
// serverUrl = "http://localhost:3000/api/v2";
serverUrl = "https://blip-chat-backend.onrender.com/api/v2";

export let socketServer;
// socketServer = "http://localhost:3000";
socketServer = "https://blip-chat-backend.onrender.com";
export let headerOptions = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

function StateProvider({ children }) {
  let toast = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [friends, setFriends] = useState([]);
  const [user, setUser] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [backgroundMsgs, setBackgroundMsgs] = useState([]);

  let socket = useRef(null);
  let isReconnect = useRef(false);

  const value = useMemo(
    () => ({
      isLogin,
      setIsLogin,
      isAuthenticated,
      setIsAuthenticated,
      friends,
      setFriends,
      user,
      setUser,
      onlineUsers,
      setOnlineUsers,
      backgroundMsgs,
      setBackgroundMsgs,
      socket,
    }),
    [
      isLogin,
      isAuthenticated,
      friends,
      user,
      onlineUsers,
      backgroundMsgs,
      socket.current,
    ]
  );

  const login = async (email, password) => {
    try {
      let res = await fetch(`${serverUrl}/user/login`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_Usrnme_mobile: email, password }),
      });

      let data = await res.json();

      if (data.success === true) {
        localStorage.setItem("token", JSON.stringify(data.token));
        setIsAuthenticated(true);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      return toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "bottom",
      });
    }
  };

  const loginOAuth = async (type) => {
    try {
      // alert(type);
      // let res = await fetch(`${serverUrl}/user/oauth/login?&type=${type}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email_Usrnme_mobile: email, password }),
      // });

      window.location.href = `${serverUrl}/user/oauth/login?type=${type}`;

      // let data = await res.json();

      // if (data.success === true) {
      // localStorage.setItem("token", JSON.stringify(data.token));
      // setIsAuthenticated(true);
      // } else {
      //   throw new Error(data.message);
      // }
    } catch (error) {
      return toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "bottom",
      });
    }
  };

  const signUp = async (userData) => {
    try {
      let res = await fetch(`${serverUrl}/user/register`, {
        method: "POST",
        body: userData.current,
      });

      let data = await res.json();

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signUpOAuth = async (type) => {
    try {
      // alert(type);

      // let res = await fetch(`${serverUrl}/user/oauth/google/register`, {
      //   method: "GET",
      // });

      window.location.href = `${serverUrl}/user/oauth/register?type=${type}`;

      // console.log(res);
      // window.location.href = res;

      // if (data.success === true) {
      //   console.log(data);
      //   // return data;
      // } else {
      //   throw new Error(data.message);
      // }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getAllFriends = async (token) => {
    headerOptions.Authorization = `Bearer ${token}`;
    try {
      let res = await fetch(`${serverUrl}/user/friends/get-all`, {
        method: "GET",
        headers: { ...headerOptions },
      });

      let data = await res.json();
      if (data.success === true) {
        setFriends(data.friends);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError" ||
        error.message === "Token has expired"
      ) {
        localStorage.removeItem("token");
        navigate("/auth");
        setIsAuthenticated(false);
      }
      return toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "bottom",
      });
    }
  };

  const getProfile = async (token) => {
    headerOptions.Authorization = `Bearer ${token}`;
    try {
      if (!token) {
        return toast({
          title: `${error.message}`,
          status: "Token is Missing",
          isClosable: true,
          duration: 2000,
          position: "bottom",
        });
      }

      let res = await fetch(`${serverUrl}/user/profile`, {
        headers: { ...headerOptions },
      });

      res = await res.json();
      if (res.success === true) {
        setUser(res.user);
        // ////("User: ", res);
        setFriends(res.user?.friends);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError" ||
        error.message === "Token has expired"
      ) {
        ////("Token error ");
        localStorage.removeItem("token");
        navigate("/auth");
        setIsAuthenticated(false);
      }
      return toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "bottom",
      });
    }
  };

  const getFriendsProfiles = useCallback(async (friends) => {
    try {
      let res = await fetch(`${serverUrl}/user/friends/profiles`, {
        method: "PUT",
        headers: { ...headerOptions },
        body: JSON.stringify({ friends }),
      });
      res = await res.json();

      if (res.success == true) {
        return res;
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError" ||
        error.message === "Token has expired"
      ) {
        localStorage.removeItem("token");
        navigate("/auth");
        setIsAuthenticated(false);

        return toast({
          title: `${error.message}`,
          status: "error",
          isClosable: true,
          duration: 2000,
          position: "bottom",
        });
      }
      toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "bottom",
      });
      return null;
    }
  }, []);

  const fetchChats = useCallback(async (anotherUser, skip) => {
    try {
      let res = await fetch(
        `${serverUrl}/chats/friends/${anotherUser}?&skip=${skip}&limit=15`,
        {
          method: "GET",
          headers: { ...headerOptions },
        }
      );

      res = await res.json();
      if (res.success === true) {
        return res.result;
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
        duration: 2000,
        position: "bottom",
      });
      return null;
    }
  }, []);

  const addToFriends = async (friend_id) => {
    try {
      let res = await fetch(`${serverUrl}/user/friends/add`, {
        method: "PUT",
        headers: { ...headerOptions },
        body: JSON.stringify({ friend_id }),
      });

      res = await res.json();
      if (res.success === true) {
        createChat(friend_id);
        return toast({
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
  };

  const createChat = async (friend_id) => {
    try {
      let res = await fetch(`${serverUrl}/chats/create`, {
        method: "POST",
        headers: { ...headerOptions },
        body: JSON.stringify({ friend_id }),
      });

      res = await res.json();
      if (res.success === true) {
        return toast({
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
  };

  // ////("Friends in Provider: ", friends);

  return (
    <Context.Provider
      value={{
        isLogin: value.isLogin,
        isAuthenticated: value.isAuthenticated,
        friends: value.friends,
        onlineUsers: value.onlineUsers,
        user: value.user,
        socket: value.socket,
        backgroundMsgs: value.backgroundMsgs,
        setIsLogin: value.setIsLogin,
        setIsAuthenticated: value.setIsAuthenticated,
        setOnlineUsers: value.setOnlineUsers,
        setFriends: value.setFriends,
        setBackgroundMsgs: value.setBackgroundMsgs,
        login,
        loginOAuth,
        signUp,
        signUpOAuth,
        getAllFriends,
        getProfile,
        getFriendsProfiles,
        fetchChats,
        addToFriends,
        createChat,
        isReconnect,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const REACT_APP_CLOUDINARY_UPLOAD_PRESET = "blip-chat app";
export const REACT_APP_CLOUDINARY_CLOUDNAME_ = "shikarinkato";
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${REACT_APP_CLOUDINARY_CLOUDNAME_}/image/upload`;

export default StateProvider;
