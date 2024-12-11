// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // Asegúrate de incluir src si tus archivos están en esta carpeta
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6750A4',
        onPrimary: '#FFFFFF',
        primaryContainer: '#EADDFF',
        onPrimaryContainer: '#21005D',
        secondary: '#625B71',
        onSecondary: '#FFFFFF',
        secondaryContainer: '#E8DEF8',
        onSecondaryContainer: '#1D192B',
        background: '#FFFFFF',
        onBackground: '#1C1B1F',
        surface: '#FFFFFF',
        onSurface: '#1C1B1F',
      },
    },
  },
  plugins: [],
};
