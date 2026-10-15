import { useState } from 'react'
import { Link } from 'react-router-dom'
import useGalleryPhotos from '../hooks/useGalleryPhotos'
import { assetUrl, inGallery, photoId, photoTitle } from '../lib/gallery'
import Lightbox from './Lightbox'
import SectionHeading from './SectionHeading'

const COUNT = 4

// A strip of the first few gallery photos. Renders nothing until the manifest
// loads, and stays hidden if it can't be loaded (e.g. in dev without photos).
// A photo opens full size right here; the viewer links on to the gallery.
export default function GalleryTeaser() {
    const photos = useGalleryPhotos().filter(inGallery).slice(0, COUNT)
    const [openIndex, setOpenIndex] = useState(null)

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
                    <button
                        type="button"
                        key={photoId(photo)}
                        onClick={() => setOpenIndex(index)}
                        aria-label={`View ${photoTitle(photo, index)}`}
                        className="pressable group block aspect-square overflow-hidden rounded-sm bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <img
                            src={assetUrl(photo.thumb || photo.full)}
                            alt={photo.alt || photoTitle(photo, index)}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover motion-safe:transition motion-safe:duration-300 motion-safe:group-hover:scale-105"
                        />
                    </button>
                ))}
            </div>

            {openIndex !== null && (
                <Lightbox
                    photos={photos}
                    index={openIndex}
                    onClose={() => setOpenIndex(null)}
                    onNavigate={setOpenIndex}
                    galleryLink
                />
            )}
        </section>
    )
}
