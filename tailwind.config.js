/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        // We will extend colors later if we define a design system token set
        fontFamily: {
            sans: ['Inter', 'sans-serif'], // Premium font stack
        }
    },
  },
  plugins: [],
}
