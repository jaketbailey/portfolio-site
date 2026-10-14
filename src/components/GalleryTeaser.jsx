import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl, fetchGallery, photoId, photoTitle } from '../lib/gallery'
import SectionHeading from './SectionHeading'

const COUNT = 4

// A strip of the first few gallery photos. Renders nothing until the manifest
// loads, and stays hidden if it can't be loaded (e.g. in dev without photos).
export default function GalleryTeaser() {
    const [photos, setPhotos] = useState([])

    useEffect(() => {
        const controller = new AbortController()
        fetchGallery(controller.signal)
            .then((loaded) => setPhotos(loaded.slice(0, COUNT)))
            .catch(() => {})
        return () => controller.abort()
    }, [])

    if (photos.length === 0) return null

    return (
        <section id="photography" className="pt-12 scroll-mt-16">
            <div className="flex items-baseline justify-between gap-4">
                <SectionHeading>Photography</SectionHeading>
                <Link
                    to="/gallery"
                    className="text-link hover:underline underline-offset-2 decoration-2 decoration-accent"
                >
                    See the gallery →
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {photos.map((photo, index) => (
                    <Link
                        key={photoId(photo)}
                        to={`/gallery?photo=${encodeURIComponent(photoId(photo))}`}
                        className="pressable block aspect-square overflow-hidden rounded-sm bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <img
                            src={assetUrl(photo.thumb || photo.full)}
                            alt={photo.alt || photoTitle(photo, index)}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover motion-safe:transition motion-safe:duration-300 motion-safe:hover:scale-105"
                        />
                    </Link>
                ))}
            </div>
        </section>
    )
}
