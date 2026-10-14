import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Layout, { PAGE_COLUMN } from '../components/Layout'
import Intro from '../components/Intro'
import Portfolio from '../components/Portfolio'
import Timeline from '../components/Timeline'
import Outdoors from '../components/Outdoors'
import GalleryTeaser from '../components/GalleryTeaser'

// One column of full-width sections, so no section ends half way down the
// page next to a longer neighbour.
export default function Home() {
    const { hash } = useLocation()

    // A shared link like /#outdoors: the browser looks for the anchor before
    // React has rendered it, so scroll there once it exists.
    useEffect(() => {
        if (!hash) return
        const id = decodeURIComponent(hash.slice(1))
        const scroll = () => {
            const el = document.getElementById(id)
            if (el) el.scrollIntoView()
            return Boolean(el)
        }
        if (scroll()) return
        // Photography only appears once the gallery manifest has loaded.
        const observer = new MutationObserver(() => {
            if (scroll()) observer.disconnect()
        })
        observer.observe(document.body, { childList: true, subtree: true })
        const timeout = window.setTimeout(() => observer.disconnect(), 5000)
        return () => {
            observer.disconnect()
            window.clearTimeout(timeout)
        }
        // Only on first load; later hash changes are normal in-page jumps.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Layout>
            <div className={`${PAGE_COLUMN} pb-10`}>
                <Intro />
                <Portfolio />
                <Timeline />
                <Outdoors />
                <GalleryTeaser />
            </div>
        </Layout>
    )
}
