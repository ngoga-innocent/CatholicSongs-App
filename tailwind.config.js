/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./Screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: '#fff', 
        primary: '#282D3B',
        mygreen: '#64C3BE',
        bg: '#B1BFD1',
        mypurple:'#c92aaf',
        dark:"#170e09"
      },
      borderRadius: {
        '5xl':'5rem'
      }
    },
  },
  plugins: [],
}

