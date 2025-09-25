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
        OrangeBase: "#E95322",
        Yellow2: "#F3E9B5",
        Font: "#391713",
        Orange2: "#FFDECF",
      },
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
};
