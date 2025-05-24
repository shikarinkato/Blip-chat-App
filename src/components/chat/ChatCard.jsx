import React, { useCallback, useContext, useState } from "react";
import { Context } from "../../context/StateProvider";
import { AnimatePresence } from "framer-motion";
import ImagesModal from "./ImagesModal";

const ChatCard = ({ chat, anotherUser }) => {
  const { user, onlineUsers } = useContext(Context);
  const [shwImgMdl, setShwImgMdl] = useState(false);

  const isSameUser = chat.sender_id?.toString() === user._id.toString();
  let date = new Date(chat.createdAt);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  date = date.toLocaleTimeString("en-US", { timeZone });

  function hndlFlClck(e, file) {
    setShwImgMdl(true);
  }

  let hndlFlCls = useCallback((e, file) => {
    setShwImgMdl(false);
  }, []);

  // linear-gradient(90deg, rgba(112,99,243,1) 0%, rgba(185,79,233,1) 100%)

  return (
    <div
      className={`relative flex items-center    w-full ${
        isSameUser ? "justify-end" : "justify-start"
      }  `}
    >
      {
        <AnimatePresence>
          {shwImgMdl && <ImagesModal hndlCls={hndlFlCls} files={chat.files} />}
        </AnimatePresence>
      }
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
          className={` flex !pb-5 pt-1 sm:py-1 sm:px-2  xl:py-3 xl:px-3  px-2  rounded-lg text-[15px] sm:text-[17px] text-neutral-100 lg:max-w-[40vw] xl:max-w-[30vw]  min-w-16 relative max-w-48 flex-col items-start
          `}
          style={{
            background: !isSameUser
              ? "linear-gradient(90deg, rgba(253,113,112,1) 0%, rgba(240,80,153,1) 100%)"
              : "#2C2C32",
          }}
        >
          {chat.files?.length > 0 && (
            <div
              onClick={hndlFlClck}
              className={` grid ${
                chat.files?.length >= 2 ? "grid-cols-2" : "grid-cols-1"
              } gap-2 pb-2 pt-4`}
            >
              {chat.files?.map((file, idx) => {
                return (
                  <div
                    key={file.id}
                    className=" h-[80px] w-[80px] sm:h-[120px] sm:w-[120px]  rounded-md overflow-hidden flex items-center justify-center cursor-pointer"
                  >
                    {chat.isPending && (
                      <div className="overflow-hidden absolute h-[35px] w-[35px]  rounded-full text-slate-400 bg-[#404040] top-1/2 left-1/2 -translate-y-[70%]   right-1/2 flex items-center justify-center -translate-x-[50%] z-[999]">
                        <div className=" animate-spin">
                          <div className=" rounded-full bg-[#404040] border-[rgba(253,113,112,1)] border-2 h-[25px] w-[25px] ">
                            {" "}
                          </div>
                          <div className=" absolute top-4  bg-[#404040]  h-[25px] w-[25px] rounded-full">
                            {" "}
                          </div>
                        </div>
                      </div>
                    )}
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
                        loading="lazy"
                        alt="image"
                        src={file.url}
                        className={` object-cover object-center h-full w-full  rounded-md bg-black ${
                          chat.isPending && "blur-sm"
                        }`}
                      />
                    ) : (
                      <div
                        className={` flex items-center justify-center h-full w-full    ${
                          chat.isPending && "blur-sm"
                        }`}
                        style={{
                          backgroundColor: `rgb(${20 + idx * 20},${
                            80 + idx * 30
                          },${100 + idx * 75})`,
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
                );
              })}
            </div>
          )}
          <p className=" font-sans  font-medium  break-words ">
            {chat.message}
          </p>
          <span className=" text-[10px] lg:text-[10px] text-neutral-300 absolute right-2 bottom-[3px]">
            {chat.time.split(":")[0] < 10 && 0}
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
