export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        moveTrain: {
          "0%": { transform: "translateX(-200px)" },     // starts off-screen
          "100%": { transform: "translateX(100vw)" },     // moves across entire screen
        },
      },
      animation: {
        train: "moveTrain 10s linear infinite",
      },
    },
  },
  plugins: [],
}
