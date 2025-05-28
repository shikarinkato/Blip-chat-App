import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

const Input = ({
  type,
  placeholder,
  onChange,
  id,
  value,
  maxLength = 50,
  classData = " h-full w-full bg-transparent  text-[16px] px-2 outline-none",
}) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  let timeRef = useRef(0);

  function handleChange(e) {
    e.preventDefault();
    e.stopPropagation();
    let newInput = e.target.value;
    setInput(newInput);

    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(() => {
      onChange(e, newInput);
    }, 500);
  }

  useEffect(() => {
    setInput(value);
  }, [value]);

  // ////("value rendered", value);
  // ////("Current input Rendered", input);

  return (
    <div className=" relative w-full">
      <input
        id={id}
        value={input}
        className={classData}
        maxLength={maxLength}
        type={type == "password" ? (show ? "text" : type) : type}
        autoComplete={type === "password" ? "current-password" : ""}
        placeholder={placeholder}
        onChange={handleChange}
      />
      <>
        {type == "password" ? (
          <div className=" absolute right-3 2xl:right-1 top-0 flex justify-center items-center h-full ">
            {show ? (
              <FontAwesomeIcon
                onClick={() => {
                  setShow(false);
                }}
                icon={faEyeSlash}
              />
            ) : (
              <FontAwesomeIcon
                onClick={() => {
                  setShow(true);
                }}
                icon={faEye}
              />
            )}
          </div>
        ) : (
          ""
        )}
      </>
    </div>
  );
};

export default Input;
