import React from "react";
import UserCard from "./UserCard";

const UsersContainer = ({ users, zeroTitle }) => {
  if (!users || users.length < 1) {
    return (
      <div className="w-full text-center h-full">
        <span className="text-neutral-600 text-[14px] text-center text-wrap">
          {zeroTitle}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-start gap-y-3  w-full scroll-m-0">
      {users?.map((user) => (
        // <Suspense
        //   fallback={
        //     <div className=" py-3 px-5">
        //       <div className=" flex items-center gap-x-3 w-full">
        //         <span className=" h-10 w-12 rounded-full skeleton"></span>
        //         <div className=" flex flex-col gap-y-1 w-full">
        //           <span className=" h-2 rounded-md w-20 skeleton"></span>
        //           <span className=" h-1 rounded-md w-12 skeleton"></span>
        //         </div>
        //       </div>
        //     </div>
        //   }
        //   key={user._id}
        // >
        <UserCard anotherUser={user} key={user._id} />
        // </Suspense>
      ))}
    </div>
  );
};

export default React.memo(UsersContainer);
