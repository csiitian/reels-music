/** @type {import(tailwindcss).Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Ensure this line is included to purge unused styles
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
