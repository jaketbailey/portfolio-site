import { useCallback, useEffect, useRef, useState } from 'react'

// How long scrolling has to stop before a clicked link stops holding the
// highlight (for browsers without the scrollend event).
const SCROLL_SETTLE_MS = 150

const SECTIONS = [
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'outdoors', label: 'Outdoors' },
    { id: 'photography', label: 'Photography' },
]

// Which sections are on the page (Outdoors and Photography hide themselves
// when they have nothing to show, and Photography appears once the gallery
// manifest loads) and which one is being read.
const findPresent = () =>
    SECTIONS.filter(({ id }) => document.getElementById(id))

// The section being read is the last one whose top has passed a line a third
// of the way down the screen. The last sections can't scroll that far, so at
// the very bottom the last one wins.
function readActive(present) {
    if (present.length === 0) return null
    const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
    if (atBottom) return present[present.length - 1].id
    const line = window.innerHeight * 0.3
    let current = null
    for (const { id } of present) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
    }
    return current
}

function useSections() {
    // Worked out straight away rather than after mounting, so a header that's
    // re-created (on a theme change) shows the right links from its first
    // frame. On the very first load the page isn't built yet; the effects
    // below fill these in.
    const [present, setPresent] = useState(findPresent)
    const [active, setActive] = useState(() => readActive(findPresent()))
    // Set while the page scrolls to a link that was clicked, so the
    // highlight stays on what was asked for rather than flickering through
    // the sections on the way (or landing on the wrong one at the bottom).
    const clicked = useRef(null)

    useEffect(() => {
        const main = document.querySelector('main')
        if (!main) return
        const update = () =>
            setPresent((current) => {
                const next = findPresent()
                return next.length === current.length &&
                    next.every((s, i) => s.id === current[i].id)
                    ? current
                    : next
            })
        update()
        const mutations = new MutationObserver(update)
        mutations.observe(main, { childList: true, subtree: true })
        return () => mutations.disconnect()
    }, [])

    useEffect(() => {
        if (present.length === 0) return
        let frame = 0
        let settleTimer = 0

        const releaseClick = () => {
            clicked.current = null
        }

        const update = () => {
            frame = 0
            if (clicked.current) return
            setActive(readActive(present))
        }

        const onScroll = () => {
            if (clicked.current) {
                clicked.current.moved = true
                window.clearTimeout(settleTimer)
                settleTimer = window.setTimeout(releaseClick, SCROLL_SETTLE_MS)
                return
            }
            if (!frame) frame = requestAnimationFrame(update)
        }

        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('scrollend', releaseClick)
        window.addEventListener('resize', onScroll)
        return () => {
            cancelAnimationFrame(frame)
            window.clearTimeout(settleTimer)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('scrollend', releaseClick)
            window.removeEventListener('resize', onScroll)
        }
    }, [present])

    const select = useCallback((id) => {
        const click = { id, moved: false }
        clicked.current = click
        setActive(id)
        // If the page is already there, no scroll happens to release it.
        window.setTimeout(() => {
            if (clicked.current === click && !click.moved) {
                clicked.current = null
            }
        }, 300)
    }, [])

    return { present, active, select }
}

export default function SectionNav({ className = '' }) {
    const { present, active, select } = useSections()
    if (present.length === 0) return null

    return (
        <nav aria-label="Sections" className={className}>
            <ul className="no-scrollbar flex gap-1.5 md:gap-1 overflow-x-auto">
                {present.map(({ id, label }) => {
                    const current = id === active
                    return (
                        <li key={id} className="shrink-0">
                            <a
                                href={`#${id}`}
                                onClick={() => select(id)}
                                aria-current={current ? 'location' : undefined}
                                className={`pressable block px-3 py-1.5 rounded-md text-sm font-medium ${
                                    current
                                        ? 'bg-tag text-tag-ink'
                                        : 'text-muted hover:text-ink'
                                }`}
                            >
                                {label}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
