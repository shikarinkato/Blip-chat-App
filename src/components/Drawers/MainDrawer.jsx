import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import AccountInfo from "./AccountInfo";
import HelpAndFeedback from "./Help";
import Privacy from "./Privacy";

const MainDrawer = ({ childID, onclick }) => {
  switch (childID) {
    case 1:
      return <DrawerWrapper onclick={onclick} child={<AccountInfo />} />;
    case 2:
      return <DrawerWrapper onclick={onclick} child={<Privacy />} />;
    case 3:
      return <DrawerWrapper onclick={onclick} child={<HelpAndFeedback />} />;

    default:
      return (
        <DrawerWrapper
          onclick={onclick}
          child={<AccountInfo onclick={onclick} />}
        />
      );
  }
};

const DrawerWrapper = ({ onclick, child }) => {
  return (
    <motion.div
      initial={{ x: "25rem" }}
      animate={{ x: 0 }}
      exit={{
        x: "22rem",
      }}
      transition={{ duration: 1, delay: 0.2, ease: "backInOut" }}
      className=" absolute top-0 left-0 h-full w-full bg-stone-900  rounded-md"
    >
      <FontAwesomeIcon
        onClick={onclick}
        icon={faArrowLeft}
        className=" text-white cursor-pointer p-4"
      />
      {child}
    </motion.div>
  );
};

export default MainDrawer;
