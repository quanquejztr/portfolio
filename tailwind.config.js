/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'darkBlue': '#002233',
      },
      fontFamily: {
        'archivo': ['Archivo Black', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'edu-nsw-act-hand-pre': ['Edu NSW ACT Hand Pre', 'cursive'],
        'limelight': ['Limelight', 'cursive'],
        'mukta': ['Mukta', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      keyframes: {
        'scroll-text': {
          '0%, 19%': {
            transform: 'translateY(0%)',
          },
          '25%, 44%': {
            transform: 'translateY(-20%)',
          },
          '50%, 69%': {
            transform: 'translateY(-40%)',
          },
          '75%, 94%': {
            transform: 'translateY(-60%)',
          },
          '100%, 106%': {
            transform: 'translateY(-80%)',
          },
        },
      },
      animation: {
        'scroll-text': 'scroll-text 12.5s cubic-bezier(0.83, 0, 0.17, 1) infinite',
      },
    },
    plugins: [],
  }
}
