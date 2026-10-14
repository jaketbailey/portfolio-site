import { Link, useLocation } from 'react-router-dom'
import useTheme from '../hooks/useTheme'
import Footer from './Footer'
import Socials from './Socials'
import { MoonIcon, SunIcon } from './icons'

// Shared chrome for every page: the fixed header (portrait, socials, theme
// toggle, cross-link) and the footer. Pages only supply their own content.
export default function Layout({ children }) {
    const { theme, toggleTheme } = useTheme()
    const { pathname } = useLocation()
    const onGallery = pathname.startsWith('/gallery')

    return (
        <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 min-h-screen">
            <header className="absolute md:fixed z-20 inset-x-0 top-4 flex items-center justify-between px-5 md:px-20">
                <div className="flex items-center space-x-4">
                    <img
                        src="/jake_portrait.webp"
                        alt="Jake Bailey"
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10"
                    />
                    <Socials />
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={
                            theme === 'dark'
                                ? 'Switch to light mode'
                                : 'Switch to dark mode'
                        }
                        className="p-2 bg-blue-400 dark:bg-purple-400 rounded-md text-white dark:text-zinc-900"
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="w-6 h-6" />
                        ) : (
                            <MoonIcon className="w-6 h-6" />
                        )}
                    </button>
                    <Link
                        to={onGallery ? '/' : '/gallery'}
                        className="p-2.5 bg-blue-400 dark:bg-purple-400 rounded-md text-sm text-white dark:text-zinc-900"
                    >
                        {onGallery ? 'Home' : 'Gallery'}
                    </Link>
                </div>
            </header>

            <main>{children}</main>
            <Footer />
        </div>
    )
}
