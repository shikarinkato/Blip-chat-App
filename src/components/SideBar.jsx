import React, { lazy, Suspense, useContext, useEffect } from "react";
import SideBarHeader from "./SideBarHeader";
import UserSearch from "./UserSearch";
import Users from "./Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../context/StateProvider";
import Loader from "./Loader";

const SideBar = () => {
  const { user } = useContext(Context);

  const dummy = [
    {
      id: 1,
      name: "Atif Aslam",
      email: "atif_aslam@mail.com",
      image:
        "https://th.bing.com/th/id/R.190ff136035f01e7772b1964964b4be6?rik=M2xWVGB%2b5UAjOQ&riu=http%3a%2f%2fwww.pak101.com%2fgallery%2fSingers%2fAtif_Aslam%2f2016%2f3%2f12%2fAtif_Aslam_Pakistani_Male_Singer_Celebrity_36_hoimh_Pak101(dot)com.jpg&ehk=LBjyq%2beqkgdF6lPeGXfhp0k6LU4NC0rJi4YEYEyih0g%3d&risl=&pid=ImgRaw&r=0",
      lastMessage: "chahat aisi hai teri ki ",
      status: "active",
      lastChatTime: "today",
    },
    {
      id: 2,
      name: "Arijit Singh",
      email: "arijit90@gmial.com",
      image:
        "https://th.bing.com/th/id/OIP.Khtenol0oEV5grJv4p43mwHaFY?w=218&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      lastMessage: "kya khalti teri hai kami",
      status: "not active",
      lastChatTime: "Fri",
    },
    {
      id: 3,
      name: "Robert Downry Jr. (Iron Man)",
      email: "Trobert_jr@gmail.com",
      image:
        "https://th.bing.com/th/id/OIP.NWuXtfB2s40L_kh3s-zx9QHaJ4?rs=1&pid=ImgDetMain",
      lastMessage: "so jaa bhai",
      status: "active",
      lastChatTime: "wed",
    },
    {
      id: 4,
      name: "Keanu Reeves",
      email: "keuanu_reeves@mail.com",
      image:
        "https://th.bing.com/th/id/OIP.oABfVL4xGiM4ym4DUyi8JgHaEL?rs=1&pid=ImgDetMain",
      lastMessage: " tell them whio ever comes i'll kill them all",
      status: "not active",
      lastChatTime: "mon",
    },
    {
      id: 5,
      name: "Virat Kohli",
      email: "virat_hu_main@gmail.com",
      image:
        "https://i.pinimg.com/originals/22/8d/67/228d6766fb6340bb3b3464f9c74c3dd4.jpg",
      lastMessage: "chal thik hai bhai good night",
      status: "not active",
      lastChatTime: "wed",
    },
    {
      id: 6,
      name: "instagram user",
      email: "instagram_user@mail.com",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
      lastMessage: "ek baat apne dil dimaag liver me daal le",
      status: "don't know when  will i get chance again",
      lastChatTime: "long time ago",
    },
  ];

  // console.log("Sidebar Rendered");

  useEffect(() => {
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  function listener(e) {
    console.log(e.target);
  }

  return (
    <div className=" h-full w-full md:w-4/6 lg:w-6/12 xl:w-2/6 bg-[#1F1F22] absolute sm:relative z-50">
      <div className=" flex flex-col justify-start items-start h-full w-full px-1 relative">
        <SideBarHeader user={user} />
        <div className="py-3 w-full">
          <UserSearch />
        </div>
        <div className=" w-full flex  h-full overflow-hidden ">
          <Users />
        </div>
        <div className=" absolute bottom-4 right-3 p-3 px-4 rounded-full bg-stone-700">
          <FontAwesomeIcon icon={faGear} className=" text-white" />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
