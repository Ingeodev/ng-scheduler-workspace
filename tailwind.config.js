/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/docs/src/**/*.{html,ts}",
    "./projects/documentation/src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1eeee',
          100: '#eceaea',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
}
