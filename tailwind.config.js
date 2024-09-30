/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        "home": "url('./imagens_cardapio/bg.png')"

      },
    },
  },
  plugins: [],
}