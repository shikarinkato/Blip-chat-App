import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({
  anotherUser,
  onlineUsers,
  createChat,
  backgroundMsgs,
  setBackgroundMsgs,
}) => {
  const navigate = useNavigate();
  // const { backgroundMsgs, setBackgroundMsgs } = useContext(Context);
  // const { onlineUsers, createChat, socket } = useContext(Context);
  if (anotherUser === null) {
    return (
      <div className=" w-full">
        <p>No result found</p>
      </div>
    );
  }

  let date = new Date(anotherUser?.lastMessage?.time);
  let currDate = new Date();
  let hours = currDate.getTime() - date.getTime();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let difference = currDate.getDate() - date.getDate();
  hours = hours / (1000 * 60 * 60);

  let day =
    date.getDate() === currDate.getDate()
      ? `${date.getHours()}:${date.getMinutes()}${
          date.getHours() > 12 ? " pm" : " am"
        }`
      : difference > 1
      ? days[date.getDay()]
      : "Yesterday";

  function newChat(id) {
    createChat(id);
  }

  return (
    <div
      className=" w-full px-3"
      onClick={() => {
        navigate(`user/${anotherUser.user}`, {
          state: { anotherUser },
        });
        newChat(anotherUser.user);
        setBackgroundMsgs([]);
      }}
    >
      <div className=" flex justify-start items-center gap-x-5 text-neutral-400 w-full relative">
        <div className=" rounded-full  relative">
          {onlineUsers.includes(anotherUser._id) && (
            <span className=" absolute p-[0.3rem] bg-green-500 rounded-full inline-block -right-1 -top-1 z-[99]"></span>
          )}
          <img
            src={anotherUser.pic}
            alt="user-img"
            className=" h-[45px] w-[55px] object-cover aspect-square rounded-full"
          />
        </div>
        <div className=" flex justify-between items-center w-full">
          <div className=" text-xl w-3/5">
            <h6 className=" text-[17px]">{anotherUser.fullName}</h6>
            <span className=" text-neutral-600 text-[15px] inline-block leading-5">
              {anotherUser?.lastMessage &&
                anotherUser?.lastMessage?.message.slice(0, 50)}
            </span>
          </div>
          {backgroundMsgs && backgroundMsgs?.length > 0 && (
            <span className="bg-purpleGradient py-1 px-[0.6rem] rounded-full absolute right-20 text-[11px] text-white inline-block">
              {backgroundMsgs?.length}
            </span>
          )}
          <div>
            <span className=" capitalize text-[13px]">{day}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserCard);
