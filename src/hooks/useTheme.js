import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'
let fadeTimer

function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
}

function storedTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved === 'dark' || saved === 'light' ? saved : null
    } catch {
        return null
    }
}

// Initialised synchronously so the first render already matches the class that
// the inline script in index.html put on <html>, avoiding a flash of the wrong
// theme and a mismatched toggle icon.
export default function useTheme() {
    const [theme, setTheme] = useState(() => storedTheme() ?? systemTheme())

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        document.documentElement.style.colorScheme = theme
        // Match the browser/status bar to the page background. Read from the
        // colour variable (not the body's colour, which is mid-fade here) so
        // it follows any retheme in tailwind.css.
        const page = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-page')
            .trim()
        if (page) {
            document
                .querySelector('meta[name="theme-color"]')
                ?.setAttribute('content', `rgb(${page})`)
        }
        try {
            localStorage.setItem(STORAGE_KEY, theme)
        } catch {
            // Private browsing or blocked storage: the theme just won't persist.
        }
    }, [theme])

    // Follow the OS while the visitor hasn't made an explicit choice.
    useEffect(() => {
        if (storedTheme()) return
        const media = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = (event) => setTheme(event.matches ? 'dark' : 'light')
        media.addEventListener('change', onChange)
        return () => media.removeEventListener('change', onChange)
    }, [])

    const toggleTheme = useCallback(() => {
        const root = document.documentElement
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            root.classList.add('theme-fade')
            window.clearTimeout(fadeTimer)
            fadeTimer = window.setTimeout(
                () => root.classList.remove('theme-fade'),
                250
            )
        }
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
    }, [])

    return { theme, toggleTheme }
}
