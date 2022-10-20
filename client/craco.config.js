module.exports = {
  eslint: {
    enable: false
  },
  style: {
    postcssOptions: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}