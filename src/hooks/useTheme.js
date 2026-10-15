import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'theme'
let fadeTimer

// Older Safari (iOS 15-18) only notices a new theme-color when the tag itself
// is replaced, not when its content changes, so swap in a fresh one.
function setThemeColor(colour) {
    const current = document.querySelector('meta[name="theme-color"]')
    if (current?.getAttribute('content') === colour) return
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = colour
    if (current) current.replaceWith(meta)
    else document.head.append(meta)
}

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
            // As hex, the format every browser reads for theme-color.
            const hex = page
                .split(/\s+/)
                .map((channel) => Number(channel).toString(16).padStart(2, '0'))
                .join('')
            setThemeColor(`#${hex}`)
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
        const next = theme === 'dark' ? 'light' : 'dark'
        const apply = () => {
            // Set the class here as well as in the effect above, so the new
            // colours are in place within this call (the view transition
            // snapshots the page as soon as it returns).
            document.documentElement.classList.toggle('dark', next === 'dark')
            flushSync(() => setTheme(next))
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            apply()
            return
        }
        // Cross-fade the whole page (text, borders, photos and all) between
        // a snapshot of the old theme and the new one.
        if (document.startViewTransition) {
            document.startViewTransition(apply)
            return
        }
        // Older browsers: fade the colours in place instead.
        const root = document.documentElement
        root.classList.add('theme-fade')
        window.clearTimeout(fadeTimer)
        fadeTimer = window.setTimeout(
            () => root.classList.remove('theme-fade'),
            250
        )
        setTheme(next)
    }, [theme])

    return { theme, toggleTheme }
}
