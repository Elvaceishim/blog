/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
                display: ["Playfair Display", "serif"],
            },
        },
    },
    plugins: [
        require('daisyui')
    ],
}