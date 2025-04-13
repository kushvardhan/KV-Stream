/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      colors: {
        // Custom colors that will be used in both themes
        primary: "#6556CD",
        secondary: "#4c56b1",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#6556CD",
          "primary-focus": "#4c56b1",
          "primary-content": "#ffffff",
          secondary: "#4c56b1",
          "secondary-focus": "#3a4289",
          "secondary-content": "#ffffff",
          accent: "#37cdbe",
          "accent-focus": "#2aa79b",
          "accent-content": "#ffffff",
          neutral: "#3d4451",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f0f0f0",
          "base-content": "#1f2937",
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#ff5724",
        },
      },
      {
        dark: {
          primary: "#6556CD",
          "primary-focus": "#7667de",
          "primary-content": "#ffffff",
          secondary: "#4c56b1",
          "secondary-focus": "#5d68c3",
          "secondary-content": "#ffffff",
          accent: "#37cdbe",
          "accent-focus": "#2aa79b",
          "accent-content": "#ffffff",
          neutral: "#2a2e37",
          "neutral-focus": "#16181d",
          "neutral-content": "#ffffff",
          "base-100": "#1F1E24",
          "base-200": "#25262B",
          "base-300": "#2c2c2c",
          "base-content": "#ebecf0",
          info: "#66c7ff",
          success: "#87cf3a",
          warning: "#ffb300",
          error: "#ff5724",
        },
      },
    ],
  },
};
