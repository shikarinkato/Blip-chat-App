import { faCamera, faPen, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/StateProvider";

const AccountInfo = () => {
  const [edit, setEdit] = useState(false);
  const [userDetails, setUserDetails] = useState({
    pic: "",
    userName: "",
    fullName: "",
    email: "",
  });
  const { user } = useContext(Context);

  useEffect(() => {
    if (user) {
      setUserDetails({
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        pic: user.pic,
      });
    }
  }, [user]);

  let editUser = () => {
    setEdit(!edit);
  };

  return (
    <div className="text-white flex justify-start items-center">
      <div className=" w-full relative">
        <FontAwesomeIcon
          //   onClick={editUser}
          icon={edit ? faX : faPen}
          className=" absolute -top-1 right-5 cursor-pointer "
        />
        <div className="flex justify-center items-center flex-col gap-y-3 w-full py-8 border-b-2 border-solid border-b-stone-700">
          <div className=" h-20 w-20 rounded-full overflow-hidden flex justify-center items-center">
            {!edit ? (
              <img
                src={userDetails?.pic}
                className=" object-cover object-center"
              />
            ) : (
              <Input id="userpic" data="" type="file" />
            )}
          </div>
          {edit ? (
            <Input id="fullname" data={userDetails?.fullName} type="text" />
          ) : (
            <span>{userDetails?.fullName}</span>
          )}
        </div>
        <div className=" flex justify-center items-center w-full flex-col gap-y-4 mt-4 px-4">
          <div className=" w-full flex items-centershadow-xl rounded-md text-base   border-[1px] border-stone-700 border-solid">
            <span className=" bg-stone-700 pr-5 rounded-tl-md rounded-bl-md text-center p-1 pl-2  ">
              UserName:{" "}
            </span>
            {edit ? (
              <Input id="username" data={userDetails?.userName} type="text" />
            ) : (
              <span className="block  px-2 py-1 rounded-md ">
                {userDetails?.userName}
              </span>
            )}
          </div>
          <div className=" w-full flex items-centershadow-xl rounded-md text-base   border-[1px] border-stone-700 border-solid">
            <span className=" bg-stone-700 pr-14 rounded-tl-md rounded-bl-md text-center p-1 pl-2  ">
              Email:
            </span>{" "}
            {edit ? (
              <Input id="email" data={userDetails?.email} type="email" />
            ) : (
              <span className="block px-2 p-1 rounded-md ">
                {userDetails?.email}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ data, type, onchange, id }) => {
  return (
    <>
      <input
        id={type}
        onChange={onchange}
        value={data}
        type={type}
        className={`${
          id === "fullname" && "border-[1px] border-stone-700 rounded-md pl-2 "
        } ${id === "userpic" && "hidden"}  bg-transparent outline-none mx-6`}
      />
      {type === "file" && (
        <label
          htmlFor={id}
          className=" h-full w-full bg-gray-500 items-center flex justify-center cursor-pointer"
        >
          <FontAwesomeIcon icon={faCamera} />
        </label>
      )}
    </>
  );
};

export default AccountInfo;
