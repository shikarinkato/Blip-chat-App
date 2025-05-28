import { motion } from "framer-motion";

const SocialLogin = ({ handleClick }) => {
  const socialIDPs = [
    {
      name: "google",
      src: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="full"
          height="full"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,
              5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,
              8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,
              4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,
              6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,
              0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,
              2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
      ),
      id: "2345gfb",
    },
    // {
    //   name: "facebook",
    //   src: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       x="0px"
    //       y="0px"
    //       width="full"
    //       height="full"
    //       viewBox="0 0 48 48"
    //     >
    //       <linearGradient
    //         id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
    //         x1="9.993"
    //         x2="40.615"
    //         y1="9.993"
    //         y2="40.615"
    //         gradientUnits="userSpaceOnUse"
    //       >
    //         <stop offset="0" stopColor="#2aa4f4"></stop>
    //         <stop offset="1" stopColor="#007ad9"></stop>
    //       </linearGradient>
    //       <path
    //         fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
    //         d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
    //       ></path>
    //       <path
    //         fill="#fff"
    //         d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,
    //            2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
    //       ></path>
    //     </svg>
    //   ),
    //   id: "2346gfb",
    // },
    // {
    //   name: "twitter",
    //   src: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       x="0px"
    //       y="0px"
    //       width="full"
    //       height="full"
    //       viewBox="0 0 48 48"
    //     >
    //       <linearGradient
    //         id="U8Yg0Q5gzpRbQDBSnSCfPa_yoQabS8l0qpr_gr1"
    //         x1="4.338"
    //         x2="38.984"
    //         y1="-10.056"
    //         y2="49.954"
    //         gradientUnits="userSpaceOnUse"
    //       >
    //         <stop offset="0" stopColor="#4b4b4b"></stop>
    //         <stop offset=".247" stopColor="#3e3e3e"></stop>
    //         <stop offset=".686" stopColor="#2b2b2b"></stop>
    //         <stop offset="1" stopColor="#252525"></stop>
    //       </linearGradient>
    //       <path
    //         fill="url(#U8Yg0Q5gzpRbQDBSnSCfPa_yoQabS8l0qpr_gr1)"
    //         d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28c2.209,
    //           0,4,1.791,4,4v28	C42,40.209,40.209,42,38,42z"
    //       ></path>
    //       <path
    //         fill="#fff"
    //         d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,
    //           32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z"
    //       ></path>
    //       <polygon
    //         fill="#fff"
    //         points="15.866,34 23.069,25.656 22.127,24.407 13.823,34"
    //       ></polygon>
    //       <polygon
    //         fill="#fff"
    //         points="24.45,21.721 25.355,23.01 33.136,14 31.136,14"
    //       ></polygon>
    //     </svg>
    //   ),
    //   id: "2347gfb",
    // },
  ];

  const authHandler = (e) => {
    const node = e.target;
    const parntNd = node.parentNode;
    const grndPrntNd = parntNd.parentNode;

    if (grndPrntNd.id) {
      handleClick(grndPrntNd.id);
    } else if (parntNd.id) {
      handleClick(parntNd.id);
    } else if (node.id) {
      handleClick(node.id);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.1 }}
      exit={{ translateX: "100%" }}
      id="socials"
      className=" w-full flex justify-center items-center flex-col gap-y-8   "
      onClick={authHandler}
    >
      <div className=" flex justify-around items-center w-2/3 :w-1/2 relative">
        {socialIDPs.map((item) => (
          <div
            className=" h-10 w-10  cursor-pointer hover:scale-110"
            key={item.id}
            id={item.name}
          >
            {item.src}
          </div>
        ))}
      </div>

      <div className=" w-full h-[1px] bg-neutral-700 flex justify-center items-center ">
        <span className="bg-white mb-1 sm:mb-2 px-1">or</span>
      </div>
    </motion.div>
  );
};

export default SocialLogin;
