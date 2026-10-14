/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: Object.fromEntries(
                [
                    'page',
                    'surface',
                    'line',
                    'ink',
                    'muted',
                    'accent',
                    'on-accent',
                    'link',
                    'tag',
                    'tag-ink',
                ].map((name) => [
                    name,
                    `rgb(var(--color-${name}) / <alpha-value>)`,
                ])
            ),
            fontFamily: {
                sans: ['Figtree', 'system-ui', 'sans-serif'],
                heading: ['Fraunces', 'Georgia', 'serif'],
            },
            animation: {
                fadeIn: 'fadeIn 0.3s',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'scale(0.98)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
