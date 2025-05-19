import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useAnimation } from "framer-motion";
import { input } from "framer-motion/client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
const ImagesModal = ({ hndlCls, files }) => {
  const animations = [];
  const [active, setActive] = useState(0);

  let boxRefs = [];

  // const anmtnsCalc = () => {
  files?.forEach((fl) => {
    animations.push(useAnimation());
    boxRefs.push(useRef(null));
  });
  // };

  const animationHandler = useCallback(
    (drctn) => {
      animations.forEach((anmatn, idx) => {
        // alert(active);
        if (drctn === "left" && active > 1) {
          // alert(drctn);
          const prvX =
            +boxRefs[idx]?.current.style.transform.slice(11, 14) + 115;
          console.log(prvX);
          anmatn.start({
            x: `${prvX}%`,

            transition: { duration: 1, ease: "easeInOut" },
          });
        } else if (drctn === "right" && active < files.length) {
          // animations.forEach((anmatn, idx) => {
          // alert(drctn);
          let prvX = parseInt(
            boxRefs[idx]?.current.style.transform.slice(11, 14)
          );

          prvX = Number.isNaN(prvX) ? 0 - 115 : prvX - 150;

          anmatn.start({
            x: `${prvX}%`,
            transition: { duration: 1, ease: "easeInOut" },
          });
          // });
        }
      });
      setActive((prev) => prev + 1);
    },
    [active]
  );

  const sldHndlr = useCallback(
    (e) => {
      // console.log(e.target.parentNode);
      if (
        (e.target.parentNode.id === "prev" || e.target.id === "prev") &&
        active >= 1
      ) {
        setActive((prev) => prev - 1);
        // animationHandler("left");
      } else if (
        (e.target.parentNode.id === "next" || e.target.id === "next") &&
        active < files?.length
      ) {
        setActive((prev) => prev + 1);
        // animationHandler("right");
        // alert(e.target.parentNode);
      } else if (e.target.name === "slider") {
        setActive(+e.target.id.split("-")[1]);
        // animationHandler("right");
        // alert(e.target.parentNode);
      }
    },
    [active]
  );

  useEffect(() => {
    // anmtnsCalc();
    // console.log(boxRef?.current);
  }, []);

  // console.log(files);

  const isLast = active === files.length - 1;
  const isFirst = active === 0;

  console.log(isLast);

  const isImg = (file) =>
    [
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
    ].includes(file.type);

  return (
    <motion.div
      initial={{ y: "100%", scale: 0 }}
      animate={{
        y: 0,
        scale: 1,
        transition: { duration: 1, ease: "backInOut" },
      }}
      exit={{
        y: "100%",
        scale: 0,
        transition: { duration: 1, ease: "backInOut" },
      }}
      className=" flex justify-center items-center flex-col bg-[#1F1F22] fixed top-0 right-0 z-[1000] h-dvh w-dvw "
    >
      <header className=" flex justify-end items-center w-full px-8 max-h-12 absolute top-8">
        <nav>
          <button
            type="button"
            onClick={hndlCls}
            id="prev "
            className="bg-[rgba(253,113,112,1)] h-12 w-12  rounded-full border-none"
            style={{ outline: "none" }}
          >
            <FontAwesomeIcon
              className="text-white h-2/3 w-2/3"
              icon={faClose}
            />
          </button>
        </nav>
      </header>
      <div
        className=" flex justify-around items-center w-3/4 h-2/3"
        onClick={sldHndlr}
      >
        <button
          className="bg-white h-12 w-12 rounded-full border-none"
          style={{ outline: "none" }}
          disabled={isFirst ? true : false}
        >
          <FontAwesomeIcon
            id="prev"
            className={` h-full w-full ${
              isFirst
                ? "cursor-not-allowed text-neutral-400 "
                : "text-[rgba(253,113,112,1)]"
            }`}
            icon={faChevronCircleLeft}
          />
        </button>
        <div className=" flex justify-center flex-col gap-y-4   items-center h-full w-2/3 max-w-[70%]  ">
          <div
            className={` w-[40dvw]  flex justify-center items-center  ${
              !isImg(files[active]) && "bg-emerald-600 h-full"
            } rounded-lg  relative overflow-hidden `}
          >
            {isImg(files[active]) ? (
              <img
                src={files[active].url}
                alt={files[active].name}
                className={` w-full h-full object-center object-contain `}
              />
            ) : (
              <span>{files[active].type.toUpperCase()}</span>
            )}
            {!isImg(files[active]) && (
              <span className="absolute top-[90%] left-[29%]">
                {files[active].name}
              </span>
            )}
          </div>
          <div className=" flex justify-between items-center gap-x-4">
            {files.map((file, idx) => (
              <>
                <input
                  className="hidden"
                  id={`id-${idx}`}
                  name="slider"
                  key={file._id}
                  type="radio"
                />
                <label
                  htmlFor={`id-${idx}`}
                  className={` h-2 w-2 rounded-full ${
                    active === idx
                      ? " bg-[rgba(253,113,112,1)] h-3 w-3"
                      : "bg-[#e8d9d9]"
                  } `}
                />
              </>
            ))}
          </div>
        </div>
        <button
          disabled={isLast ? true : false}
          className=" bg-white h-12 w-12 rounded-full object-center self-center border-none"
          style={{ outline: "none" }}
        >
          <FontAwesomeIcon
            id="next"
            className={`  h-full w-full ${
              isLast
                ? "cursor-not-allowed text-neutral-400 "
                : "text-[rgba(253,113,112,1)]"
            }`}
            icon={faChevronCircleRight}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default ImagesModal;
