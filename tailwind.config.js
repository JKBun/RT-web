/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rotaract: {
          DEFAULT: '#4B0082', // Nebula Purple (Main purple)
          dark: '#0B0514',    // Void Black (Background)
          light: '#7A3B9E',   // Galaxy Violet (Accent)
          soft: '#1B112C',    // Soft dark surface
          starlight: '#B18FCF', // Starlight Lavender (Highlight)
          cosmic: '#F5F3FF',   // Cosmic White (Text)
          border: '#3A1E5C'
        }
      }
    },
  },
  plugins: [],
}
