import { motion, useAnimation } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/StateProvider";
import UsersContainer from "./UsersContainer";

const Users = () => {
  const [activeBar, setActiveBar] = useState(1);
  const [isFetched, setIsFetched] = useState(false);

  const navigate = useNavigate();

  let {
    friends,
    getFriendsProfiles,
    onlineUsers,
    createChat,
    backgroundMsgs,
    setBackgroundMsgs,
    socket,
  } = useContext(Context);

  const animations = [useAnimation(), useAnimation(), useAnimation()];

  const toggleTabs = useMemo(
    () => [
      { title: "Active Now", barValue: 1 },
      { title: "Favourites", barValue: 2 },
      { title: "All", barValue: 3 },
    ],
    []
  );

  const actvUsrs = useRef([]);
  const favUsrs = useRef([]);
  const frndUsrs = useRef([]);

  const animationHandler = useCallback(() => {
    if (activeBar === 1) {
      animations[0].start({
        x: 0,
        opacity: 1,
        transition: {
          duration: 1,
          ease: "backInOut",
          type: "spring",
          delay: 0.2,
        },
      });
      animations[1].start({
        x: "100%",
        opacity: 0,
        transition: { duration: 0.8, ease: "backInOut", type: "spring" },
      });
      animations[2].start({
        x: "150%",
        opacity: 0,
        transition: { duration: 0.8, ease: "backInOut", type: "spring" },
      });
    } else if (activeBar === 2) {
      animations[0].start({
        x: "-100%",
        opacity: 0,
        transition: { duration: 0.8, ease: "backInOut", type: "spring" },
      });
      animations[1].start({
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "backInOut",
          type: "spring",
          delay: 1,
        },
      });
      animations[2].start({
        x: "100%",
        opacity: 0,
        transition: { duration: 0.8, ease: "backInOut", type: "spring" },
      });
    } else {
      animations[0].start({
        x: "-100%",
        opacity: 0,
        transition: { duration: 0.8, ease: "backInOut", type: "spring" },
      });
      animations[1].start({
        x: "-50%",
        opacity: 0,
        transition: { duration: 0.8, ease: "backInOut", type: "spring" },
      });
      animations[2].start({
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: "backInOut",
          type: "spring",
          delay: 0.2,
        },
      });
    }
  }, [activeBar]);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsFetched(false);

      let favorite = friends
        ?.filter((fr) => fr.isFavourite === true)
        .map((fr) => fr.friend_id);

      if (onlineUsers?.length > 0) {
        const activeProfiles = await getFriendsProfiles(onlineUsers);
        actvUsrs.current = activeProfiles.chats;
      } else {
        actvUsrs.current = [];
      }
      if (favorite.length > 0) {
        const favouriteProfiles = await getFriendsProfiles(favorite);
        favUsrs.current = favouriteProfiles.chats;
      }
      if (friends.length > 0) {
        let updatedFriend = friends.map((fr) => fr.friend_id);
        const friendsProfiles = await getFriendsProfiles(updatedFriend);
        frndUsrs.current = friendsProfiles.chats;
      }

      // ////("Done");
    };
    if (friends?.length > 0) {
      fetchProfiles()
        .then(() => {
          setIsFetched(true);
          // ////("Fetched");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [getFriendsProfiles, onlineUsers?.length, friends?.length]);

  useLayoutEffect(() => {
    animationHandler();
  }, [activeBar, animationHandler, isFetched]);

  useEffect(() => {
    socket.current?.on("old-message", lstnOldMsgs);
    socket.current?.on("new-message-friend", lstnMsgs);

    return () => {
      socket.current?.off("old-message", lstnOldMsgs);
      socket.current?.off("new-message-friend", lstnMsgs);
    };
  }, []);

  // (friends);
  // (onlineUsers);

  function lstnMsgs(msgs) {
    ////(msgs)
    setBackgroundMsgs((prev) => [...prev, msgs]);
  }
  function lstnOldMsgs(msgs) {
    setBackgroundMsgs((prev) => [...prev, msgs]);
  }

  if (!isFetched) {
    return (
      <div className=" w-full flex flex-col  h-full overflow-hidden ">
        {Array.from({ length: 3 }).map((item, idx) => (
          <div className=" py-3 px-5" key={idx}>
            <div className=" flex items-center gap-x-3 w-full">
              <span className=" h-10 w-12 rounded-full skeleton"></span>
              <div className=" flex flex-col gap-y-1 w-full">
                <span className=" h-2 rounded-md w-20 skeleton"></span>
                <span className=" h-1 rounded-md w-12 skeleton"></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-end px-6 pt-3 w-full user-togllers">
        {toggleTabs.map((item) => (
          <span
            key={item.barValue}
            onClick={() => setActiveBar(item.barValue)}
            className={`${
              activeBar === item.barValue ? "activeBar" : ""
            } uppercase text-white text-[15px] font-normal cursor-pointer select-none`}
          >
            {item.title}
          </span>
        ))}
      </div>
      <div className="w-full overflow-hidden overflow-y-auto py-4 scroll-m-0 relative h-full flex justify-start">
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={animations[0]}
          className="w-full absolute"
        >
          <UsersContainer
            zeroTitle="0 Online Friends"
            users={actvUsrs.current}
            backgroundMsgs={backgroundMsgs}
            setBackgroundMsgs={setBackgroundMsgs}
            onlineUsers={onlineUsers}
            createChat={createChat}
            socket={socket}
          />
        </motion.div>
        <motion.div
          initial={{ x: "50%", opacity: 0 }}
          animate={animations[1]}
          className="w-full absolute"
        >
          <UsersContainer
            users={favUsrs.current}
            backgroundMsgs={backgroundMsgs}
            setBackgroundMsgs={setBackgroundMsgs}
            onlineUsers={onlineUsers}
            createChat={createChat}
            socket={socket}
            zeroTitle="You have 0 favorite friend"
          />
        </motion.div>
        <motion.div
          initial={{ x: "150%", opacity: 0 }}
          animate={animations[2]}
          className="w-full absolute"
        >
          <UsersContainer
            zeroTitle="You have 0 Friends"
            users={frndUsrs.current}
            backgroundMsgs={backgroundMsgs}
            onlineUsers={onlineUsers}
            createChat={createChat}
            setBackgroundMsgs={setBackgroundMsgs}
            socket={socket}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(Users);
