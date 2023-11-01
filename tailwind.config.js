/* @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",
            "./public/*.html"],
  theme: {
    extend: {
      colors:{
        primary:"#ea5e27",
        secondary:"#f69c79"
      },
      keyframes:{
        logo:{
          '0%': {bottom:"-10px"},
          '50%' : {top:"0"}, 
          '100%': {bottom:"-10px", right:"-10px"},
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
   // require("tailwind-scrollbar-hide"),
   require("tailwind-scrollbar"),
  ],
};
