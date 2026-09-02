/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pg: {
          pine: '#234D42',
          pineHover: '#2c5e51',
          pineLight: '#e9f2ef',
          sage: '#71817E',
          mist: '#AAB6AE',
          dark: '#1a2522',
          card: '#ffffff',
          bg: '#f8faf9',
          border: '#d2ded8',
        },
      },
    },
  },
  plugins: [],
}
