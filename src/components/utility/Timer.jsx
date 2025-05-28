import React, { useCallback, useEffect, useRef, useState } from "react";

const Timer = ({ content, time }) => {
  const [remainingTime, setRemainingTime] = useState(time);
  const timerRef = useRef(null);
  useEffect(() => {
    timerMethod();
    return () => clearInterval(timerRef.current);
  }, []);

  const timerMethod = () => {
    let time = remainingTime;
    timerRef.current = setInterval(() => {
      if (time > 0) {
        setRemainingTime((prevTime) => prevTime - 1);
        time -= 1;
      } else {
        clearInterval(timerRef.current);
      }
    }, 1000);
  };

  return (
    <span className=" text-[16px] my-1 block text-neutral-500">
      {content} 00:{remainingTime >= 10 ? remainingTime : `0${remainingTime}`}
    </span>
  );
};

export default React.memo(Timer);
