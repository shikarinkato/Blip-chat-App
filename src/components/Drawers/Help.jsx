import React from "react";

const Help = () => {
  return (
    <div className=" w-full flex items-center shadow-xl rounded-md   cursor-pointer mx-3 text-wrap text-white  ">
      <div className="bg-stone-800 w-11/12 rounded-md p-2 text-center">
        <h2 className=" text-2xl font-semibold text-wrap break-words">
          We'll add this functionality as soon as possible
        </h2>
        <p className=" text-sm mt-2 text-neutral-500">
          Sorry to have this problem. Currently this app is Under Production,
          and as Single contributer i'm giving my 100%.So, we'll add
          this functionality very soon.{" "}
        </p>
      </div>
    </div>
  );
};

export default Help;
