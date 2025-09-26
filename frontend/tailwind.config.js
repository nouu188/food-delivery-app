/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        YellowBase: "#F5CB58",
        Yellow_2: "#F3E9B5",
        OrangeBase: "#E95322",
        Font: "#391713",
        Orange_2: "#FFDECF",
        Font_2: "#F8F8F8",
      },
      fontFamily: {
        LeagueSpartan: ["LeagueSpartan-Regular", "sans-serif"],
      },
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
};
