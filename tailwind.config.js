/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{jsx, js}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                inter: ['inter', 'serif'],
            },
            animation: {
                fadeIn: 'fadeIn 0.3s',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
