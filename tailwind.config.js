/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'stadium': "url('/src/assets/background.jpeg')",
      },
      keyframes: {
        // La primera animación mueve el contenido de 0% a -100%
        marquee: {
          '0%': { transform: 'translateX(-200%)' },
          '100%': { transform: 'translateX(300%)' },
        },
        // La segunda animación mueve el contenido de 100% a 0%
        marquee2: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
      },
      animation: {
        marquee: 'marquee 8s linear infinite',
        marquee2: 'marquee2 8s linear infinite',
      },
    },
  },
  plugins: [],
}
