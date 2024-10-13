import { calcLength, motion, useAnimation } from "framer-motion";
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import UsersContainer from "./UsersContainer";
import { Context } from "../context/StateProvider";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [activeBar, setActiveBar] = useState(1);
  const [actives, setActives] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();
  let { friends, getFriendsProfiles, onlineUsers, socket } =
    useContext(Context);

  // let activeLength= actives?.length, favourites.length, friends.length

  const animations = [useAnimation(), useAnimation(), useAnimation()];

  const toggleTabs = useMemo(
    () => [
      { title: "Active Now", barValue: 1 },
      { title: "Favourites", barValue: 2 },
      { title: "All", barValue: 3 },
    ],
    []
  );

  const [activeUsers, setActiveUsers] = useState([]);
  const [favouriteUsers, setFavouriteUsers] = useState([]);
  const [friendUsers, setFriendUsers] = useState([]);

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
    function activesAndFavs() {
      friends?.map((fr) => {
        if (fr.isFavourite === true) {
          setFavourites((prev) => [...prev, fr.friend_id]);
        }
        // if (onlineUsers.includes(fr.friend_id)) {
        //   setActives((prev) => [...prev, fr.friend_id]);
        // }
      });
    }

    activesAndFavs();
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (onlineUsers.length > 0) {
        const activeProfiles = await getFriendsProfiles(onlineUsers);
        setActiveUsers(activeProfiles.chats);
      }
      if (favourites.length > 0) {
        const favouriteProfiles = await getFriendsProfiles(favourites);
        setFavouriteUsers(favouriteProfiles.chats);
      }
      if (friends?.length > 0) {
        let updatedFriend = friends.map((fr) => fr.friend_id);
        const friendsProfiles = await getFriendsProfiles(updatedFriend);
        setFriendUsers(friendsProfiles.chats);
      }
    };

    fetchProfiles();
  }, [
    favourites?.length,
    friends?.length,
    getFriendsProfiles,
    onlineUsers.length,
  ]);

  useLayoutEffect(() => {
    animationHandler();
  }, [activeBar, animationHandler]);

  useEffect(() => {
    socket.current.on("old-messages", (msgs) => {
      console.log("Old messges ");
      console.log(msgs);
    });
    socket.current.on("room-joined", (roomID) => {
      let room = roomID.slice(0, 24);
      let res = friends.find((fr) => fr.friend_id.toString() === room);

      getFriendsProfiles([res.friend_id])
        .then((res) =>
          navigate("/user/" + room, {
            state: { anotherUser: res.chats[0], roomID },
          })
        )
        .then((err) => console.log(err));
    });
  }, []);



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
          <Suspense fallback={<Loader />}>
            <UsersContainer zeroTitle="0 Online Friends" users={activeUsers} />
          </Suspense>
        </motion.div>
        <motion.div
          initial={{ x: "50%", opacity: 0 }}
          animate={animations[1]}
          className="w-full absolute"
        >
          <Suspense fallback={<Loader />}>
            <UsersContainer
              users={favouriteUsers}
              zeroTitle="You have 0 favorite friend"
            />
          </Suspense>
        </motion.div>
        <motion.div
          initial={{ x: "150%", opacity: 0 }}
          animate={animations[2]}
          className="w-full absolute"
        >
          <Suspense fallback={<Loader />}>
            <UsersContainer
              zeroTitle="You have 0 Friends"
              users={friendUsers}
            />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(Users);
