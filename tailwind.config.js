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
        },
    },
    plugins: [],
}
