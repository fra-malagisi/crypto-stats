module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    maxHeight: {
      100: '25rem',
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      opacity: ['disabled'],
      pointerEvents: ['disabled'],
    },
  },
  plugins: [],
};
