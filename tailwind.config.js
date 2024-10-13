/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        purpleGradient: "rgb(114, 98, 242)",
        pinkGradient:
          "linear-gradient(90deg, rgba(253,113,112,1) 0%, rgba(240,80,153,1) 100%)",
      },
    },
  },
  plugins: [],
};
