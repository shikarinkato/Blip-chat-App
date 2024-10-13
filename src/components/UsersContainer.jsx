import React, { Suspense, useContext, useEffect } from "react";
import UserCard from "./UserCard";
import Loader from "./Loader";
import { Context } from "../context/StateProvider";

const UsersContainer = ({ users,zeroTitle }) => {
  if (!users || users.length < 1) {
    return (
      <div className="w-full text-center h-full">
        <span className="text-neutral-600 text-[14px] text-center text-wrap">{zeroTitle}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-start gap-y-3  w-full scroll-m-0">
      {users.map((user) => (
        <Suspense fallback={<Loader />} key={user._id}>
          <UserCard anotherUser={user} key={user._id} />
        </Suspense>
      ))}
    </div>
  );
};

export default React.memo(UsersContainer);
