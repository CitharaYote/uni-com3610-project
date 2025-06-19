/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "uos-purple": "#3f0693",
        "uos-purple-hover": "#5f09df",
        "uos-blue": "#a8d9e7",
        "uos-black": "#151d28",
        "uos-gray": "#5a6269",
        "uos-darkgray": "#2b353e",
        "uos-lightergray": "#e7e9ea",
        "uos-lightgray": "#b8bbbf",
        "uos-lightblue": "#9adbe8",
        "uos-lightblue-hover": "#85d4e3",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};
