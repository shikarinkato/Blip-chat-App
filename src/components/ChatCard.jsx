import React, { useContext } from "react";
import { Context } from "../context/StateProvider";

const ChatCard = ({ chat, anotherUser }) => {
  const { user, onlineUsers } = useContext(Context);
  const isSameUser = chat.sender_id?.toString() === user._id.toString();
  let date = new Date(chat.createdAt);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  date = date.toLocaleTimeString("en-US", { timeZone });

  return (
    <div
      className={`relative flex items-center   w-full ${
        isSameUser ? "justify-end" : "justify-start"
      }  `}
    >
      <div className=" flex items-end justify-end  gap-x-3 ">
        {!isSameUser && anotherUser._id && (
          <div className=" relative ">
            {onlineUsers.includes(anotherUser._id) && (
              <span className=" p-1 rounded-full bg-green-500 absolute -right-2  overflow-hidden" />
            )}
            <img
              loading="lazy"
              className=" w-[30px] h-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px] rounded-full object-cover"
              src={
                chat.sender_id === user._id ? "another user" : anotherUser.pic
              }
              alt="sender's_image"
            />
          </div>
        )}
        <div
          className={` flex !pb-5 sm:py-1 sm:px-2  xl:py-3 xl:px-3  px-2  rounded-lg text-[15px] sm:text-[17px] text-neutral-100 lg:max-w-[40vw] xl:max-w-[30vw]  min-w-16 relative max-w-48 flex-col ${
            isSameUser ? "items-end" : "items-start"
          }`}
          style={{
            background: !isSameUser
              ? "linear-gradient(90deg, rgba(112,99,243,1) 0%, rgba(185,79,233,1) 100%)"
              : "#2C2C32",
          }}
        >
          <div
            className={` grid ${
              chat.files?.length >= 2 ? "grid-cols-2" : "grid-cols-1"
            } gap-2 pb-2 pt-4`}
          >
            {chat.files?.map((file, idx) => (
              <div
                key={file.id}
                className=" h-[80px] w-[80px] sm:max-h-[120px] sm:max-w-[120px] sm:h-auto sm:w-auto rounded-md overflow-hidden flex items-center justify-center"
              >
                {[
                  "jpg",
                  "jpeg",
                  "png",
                  "gif",
                  "bmp",
                  "webp",
                  "tiff",
                  "tif",
                  "svg",
                  "ico",
                  "avif",
                  "heic",
                ].includes(file.type) ? (
                  <img
                    alt="image"
                    src={file.url}
                    className=" object-cover object-center h-auto  rounded-md bg-black"
                  />
                ) : (
                  <div
                    className=" flex items-center justify-center h-full w-full   sm:h-[80px] sm:w-[80px]    lg:h-[120px] lg:w-[120px]"
                    style={{
                      backgroundColor: `rgb(${20 + idx * 20},${80 + idx * 30},${
                        100 + idx * 75
                      })`,
                    }}
                  >
                    <span
                      className={` text-center inline-block text-[15px] text-white m-auto  `}
                    >
                      {file.type.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className=" font-sans  font-medium  break-words ">
            {chat.message}
          </p>
          <span className=" text-[10px] lg:text-[10px] text-neutral-300 absolute right-2 bottom-[3px]">
            {chat.time} {chat.time.split(":")[0] < 12 ? "am" : "pm"}
          </span>
        </div>
        {isSameUser && (
          <div className=" relative  ">
            <span className=" p-1 rounded-full bg-green-500 absolute -right-2" />
            <img
              className=" w-[30px] h-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px] rounded-full object-cover"
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
