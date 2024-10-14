import { useToast } from "@chakra-ui/toast";
import React, { createContext, useRef, useState } from "react";
export let Context = createContext();

let token = JSON.parse(localStorage.getItem("token"));

export let serverUrl;
// serverUrl = "http://localhost:3000/api/v2";
serverUrl = "https://blip-chat-backend.onrender.com/api/v2";
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
  const [favourites, setFavourites] = useState([]);
  const [actives, setActives] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  let socket = useRef(null);

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

  const signUp = async (userData) => {
    try {
      let res = await fetch(`${serverUrl}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pic: userData.pic,
          userName: userData.userName,
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName,
        }),
      });

      let data = await res.json();

      if (data.success === true) {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getAllFriends = async () => {
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

  const getProfile = async () => {
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
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError" ||
        error.message === "Token has expired"
      ) {
        console.log("Token error ");
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

  const getFriendsProfiles = async (friends) => {
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
  };

  const searchUser = async (search) => {
    try {
      let res = await fetch(`${serverUrl}/user/search-user?search=${search}`, {
        method: "GET",
        headers: { ...headerOptions },
      });

      res = await res.json();

      if (res.success == true) {
        return res;
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
  };

  const fetchChats = async (anotherUser) => {
    try {
      let res = await fetch(`${serverUrl}/chats/friends/${anotherUser}`, {
        method: "GET",
        headers: { ...headerOptions },
      });

      res = await res.json();
      if (res.success === true) {
        return res.chats[0];
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
  };

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

  // console.log("Friends in Provider: ", friends);

  return (
    <Context.Provider
      value={{
        isLogin,
        isAuthenticated,
        friends,
        favourites,
        onlineUsers,
        actives,
        user,
        socket,
        setIsLogin,
        setIsAuthenticated,
        setOnlineUsers,
        setActives,
        setFavourites,
        setFriends,
        login,
        signUp,
        getAllFriends,
        getProfile,
        getFriendsProfiles,
        searchUser,
        fetchChats,
        addToFriends,
        createChat,
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
