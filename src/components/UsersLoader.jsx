import React from "react";

const UsersLoader = () => {
  return (
    <div className=" w-full flex flex-col  h-full overflow-hidden ">
      {Array.from({ length: 3 }).map((item, idx) => (
        <div className=" py-3 px-5">
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
};

export default UsersLoader;
