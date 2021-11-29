const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      facades: path.resolve(__dirname, 'src/facades'),
      services: path.resolve(__dirname, 'src/services'),
      shared: path.resolve(__dirname, 'src/shared'),
      pages: path.resolve(__dirname, 'src/pages'),
      types: path.resolve(__dirname, 'src/types'),
    },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
