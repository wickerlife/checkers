/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        russianviolet: "#210440",
        mistyrose: "#FEE1D7",
        vividtangerine: "#FDB095",
        nypink: "#E5958E",
        selectiveyellow: "#FFBA00",
      },
    },
  },
  plugins: [],
};
