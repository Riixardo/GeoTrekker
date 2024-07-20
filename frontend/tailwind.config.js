/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
      },
      height: {
        '4/5': '80%', 
        '1/5': '20%', 
        '1/8': '87.5%',
        '7/8': '12.5%',
      },
    },
  },
  plugins: [],
}

