import React, { useContext } from "react";
import { Context } from "../context/StateProvider";

const ChatCard = ({ chat, anotherUser }) => {
  const { user, onlineUsers } = useContext(Context);
  const isSameUser = chat.sender_id.toString() === user._id.toString();

  return (
    <div
      className={`relative flex items-center   w-full ${
        isSameUser ? "justify-end" : "justify-start"
      }  `}
    >
      <div className=" flex items-end justify-end  gap-x-3 ">
        {!isSameUser && anotherUser._id && (
          <div className=" relative overflow-hidden">
            {onlineUsers.includes(anotherUser._id) && (
              <span className=" p-1 rounded-full bg-green-500 absolute -right-1 overflow-hidden" />
            )}
            <img
              className=" w-[30px] h-[30px] sm:h-[50px] sm:w-[50px] rounded-full object-cover"
              src={
                chat.sender_id === user._id ? "another user" : anotherUser.pic
              }
              alt="sender's_image"
            />
          </div>
        )}
        <div
          className={` flex !pb-5  sm:py-3 sm:px-3 py-1 px-2  rounded-lg text-[15px] sm:text-[17px] text-neutral-100 lg:max-w-[40vw]  min-w-16 relative max-w-48`}
          style={{
            background: !isSameUser
              ? "linear-gradient(90deg, rgba(112,99,243,1) 0%, rgba(185,79,233,1) 100%)"
              : "#2C2C32",
          }}
        >
          <p className=" w-full break-words ">{chat.message}</p>
          <span className=" text-[10px] lg:text-[12px] text-neutral-300 absolute right-1 bottom-[3px]">
            {chat.time} {chat.time.split(":")[0] < 12 ? "am" : "pm"}
          </span>
        </div>
        {isSameUser && (
          <div className=" relative overflow-hidden ">
            <span className=" p-1 rounded-full bg-green-500 absolute -right-1" />
            <img
              className=" w-[30px] h-[30px] sm:h-[50px] sm:w-[50px] rounded-full object-cover"
              src={chat.sender_id === user._id ? user.pic : "user's pic"}
              alt="user's_image"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChatCard);
