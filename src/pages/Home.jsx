import { Analytics } from '@vercel/analytics/react'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Intro from '../components/Intro'
import Portfolio from '../components/Portfolio'
import Socials from '../components/Socials'
import Timeline from '../components/Timeline'

function Home() {
    const [theme, setTheme] = useState(null)

    useEffect(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }, [])

    const handleThemeSwitch = () => {
        console.log(theme)
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    const sun = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
        </svg>
    )

    const moon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
        </svg>
    )

    return (
        <>
            <div>
            <a
                className="absolute md:fixed p-2.5 z-10 right-5 md:right-32 top-4 bg-blue-400 dark:bg-purple-400 rounded-md text-sm dark:text-zinc-900 text-white"
                href="/gallery"
            >
                Gallery
            </a>
            </div>
            <button
                type="button"
                onClick={handleThemeSwitch}
                className="absolute md:fixed p-2 z-10 right-5 md:right-20 top-4 bg-blue-400 dark:bg-purple-400 text-lg p-1 rounded-md"
            >
                {theme === 'dark' ? sun : moon}
            </button>

            <div className="absolute md:fixed z-10 left-5 md:left-20 top-4 space-x-4 flex items-center">
                <img
                    src="/jake_portrait.webp"
                    alt="Jake Bailey"
                    className="rounded-full w-10 h-10"
                />
                <Socials theme={theme} />
            </div>
            <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 min-h-screen flex justify-center">
                <div className="max-w-5xl w-11/12 flex flex-wrap">
                    <div className="w-full md:w-1/2 overflow-auto">
                        <Intro />
                        <Portfolio theme={theme} />
                    </div>
                    <div className="w-full md:w-1/2  ml-auto overflow-auto pt-30 pb-6">
                        <Timeline />
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300">
                {/* <Contact /> */}
                <Footer theme={theme} />
            </div>
            <Analytics />
        </>
    )
}

export default Home
