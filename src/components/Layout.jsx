import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useTheme from '../hooks/useTheme'
import Footer from './Footer'
import SectionNav from './SectionNav'
import { MoonIcon, SunIcon } from './icons'

// How far down the homepage the hero portrait has scrolled out of view, at
// which point the small header portrait takes over.
const HERO_PORTRAIT_SCROLL = 260

function useScrolledPast(threshold, enabled) {
    const [past, setPast] = useState(false)
    useEffect(() => {
        if (!enabled) return
        const update = () => setPast(window.scrollY > threshold)
        update()
        window.addEventListener('scroll', update, { passive: true })
        return () => window.removeEventListener('scroll', update)
    }, [threshold, enabled])
    return past
}

// The content column every page uses, and the header lines up with, so the
// edges don't jump when moving between pages.
export const PAGE_COLUMN = 'max-w-5xl w-11/12 mx-auto'

// Shared chrome for every page: the fixed header (portrait, section links on
// the homepage, theme toggle, cross-link) and the footer. Pages only supply
// their own content.
export default function Layout({ children }) {
    const { theme, toggleTheme } = useTheme()
    const { pathname } = useLocation()
    const onGallery = pathname.startsWith('/gallery')
    // On the homepage the hero already shows a large portrait, so the header
    // copy only fades in once that one has scrolled away.
    const scrolledPastHero = useScrolledPast(HERO_PORTRAIT_SCROLL, !onGallery)
    const showPortrait = onGallery || scrolledPastHero

    return (
        <div className="grain bg-page text-ink min-h-screen">
            {/* Re-created (via `key`) on every theme change: Safari 26+ takes its
                toolbar colour from a fixed header like this one, but only
                re-checks when one appears, not when its colour changes. */}
            <header
                key={theme}
                className="material fixed z-20 inset-x-0 top-0 pt-3 pb-2 md:py-3"
            >
                {/* On phones the section links wrap onto their own swipeable
                    row; from md up they sit between the portrait and the
                    buttons. */}
                <div
                    className={`${PAGE_COLUMN} flex flex-wrap items-center gap-y-3`}
                >
                    {/* Portrait and name. On the homepage they take no space
                        until the hero (which shows both, larger) has scrolled
                        away, then grow in and nudge the links across. */}
                    <div
                        aria-hidden="true"
                        className={`flex items-center gap-3 overflow-hidden whitespace-nowrap motion-safe:transition-[max-width,margin,opacity] motion-safe:duration-300 motion-safe:ease-out ${
                            showPortrait
                                ? 'max-w-xs mr-6 opacity-100'
                                : 'max-w-0 mr-0 opacity-0'
                        }`}
                    >
                        <img
                            src="/jake_portrait.webp"
                            alt=""
                            width={40}
                            height={40}
                            className="rounded-full w-9 h-9 md:w-10 md:h-10 shrink-0"
                        />
                        {/* On the homepage the section links share this row
                            from md up, so the name only fits again at lg. */}
                        <span
                            className={`font-heading text-lg md:text-xl font-semibold tracking-tight ${
                                onGallery ? '' : 'md:hidden lg:inline'
                            }`}
                        >
                            Jake Bailey
                        </span>
                    </div>
                    {!onGallery && (
                        // Pulled left by the links' own padding, so the first
                        // label lines up with the headings below.
                        <SectionNav className="order-last basis-full min-w-0 -ml-3 md:order-none md:basis-auto md:flex-1" />
                    )}
                    <div className="ml-auto pl-4 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={
                                theme === 'dark'
                                    ? 'Switch to light mode'
                                    : 'Switch to dark mode'
                            }
                            className="pressable p-2 bg-accent hover:bg-accent/90 rounded-md text-on-accent"
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="w-5 h-5 md:w-6 md:h-6" />
                            ) : (
                                <MoonIcon className="w-5 h-5 md:w-6 md:h-6" />
                            )}
                        </button>
                        <Link
                            to={onGallery ? '/' : '/gallery'}
                            className="pressable px-3 py-2 md:p-2.5 bg-accent hover:bg-accent/90 rounded-md text-sm font-medium text-on-accent"
                        >
                            {onGallery ? '← About me' : 'Gallery'}
                        </Link>
                    </div>
                </div>
            </header>

            <main>{children}</main>
            <Footer />
        </div>
    )
}
