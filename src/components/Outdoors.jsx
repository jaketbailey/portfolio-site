import { useState } from 'react'
import trips from '../data/outdoors'
import useGalleryPhotos from '../hooks/useGalleryPhotos'
import { assetUrl, inGallery, photoId } from '../lib/gallery'
import Lightbox from './Lightbox'
import SectionHeading from './SectionHeading'

// Desktop columns: picture | date | route | activity | stats. On phones the
// picture sits on the left and everything else stacks beside it.
const ROW =
    'grid grid-cols-[4.5rem_minmax(0,1fr)] sm:grid-cols-[7rem_5.5rem_minmax(0,1fr)_7rem_10rem] gap-x-4 sm:gap-x-5'

function Picture({ trip, photos, onOpen }) {
    const box = 'block w-full aspect-[4/3] rounded-sm overflow-hidden bg-tag'
    const galleryPhoto =
        trip.photo && photos.find((photo) => photoId(photo) === trip.photo)
    const src = galleryPhoto
        ? assetUrl(galleryPhoto.thumb || galleryPhoto.full)
        : trip.image

    // Every trip should have a picture; until it loads (or if the gallery
    // can't be reached) the empty box keeps the rows lined up.
    if (!src) return <div className={box} />

    const img = (
        <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
        />
    )
    // A gallery photo opens full size right here, without leaving the page.
    return galleryPhoto ? (
        <button
            type="button"
            onClick={() => onOpen(trip.photo)}
            aria-label={`View photo from ${trip.title}`}
            className={`pressable group ${box} focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
        >
            {img}
        </button>
    ) : (
        <div className={box}>{img}</div>
    )
}

export default function Outdoors() {
    const photos = useGalleryPhotos()
    const [openIndex, setOpenIndex] = useState(null)
    if (trips.length === 0) return null

    // The gallery photos the trips point at, in logbook order, so the viewer
    // can flick between them.
    const tripPhotos = [
        ...new Set(trips.map((trip) => trip.photo).filter(Boolean)),
    ]
        .map((id) => photos.find((photo) => photoId(photo) === id))
        .filter(Boolean)
    const openPhoto = (id) =>
        setOpenIndex(tripPhotos.findIndex((photo) => photoId(photo) === id))

    return (
        <section id="outdoors" className="pt-12 scroll-mt-16">
            <SectionHeading>Outdoors</SectionHeading>
            <p className="mb-6 text-muted">
                I love being outdoors, whether that&apos;s running, cycling,
                hiking, climbing or scrambling. Here are a few of my favourite
                days out:
            </p>

            <div className="border-t-2 border-ink">
                <div
                    aria-hidden="true"
                    className={`${ROW} hidden sm:grid py-2 border-b border-line text-xs font-semibold uppercase tracking-wider text-muted`}
                >
                    <span className="col-start-2">Date</span>
                    <span>Route</span>
                    <span>Activity</span>
                    <span className="text-right">Stats</span>
                </div>

                <ol>
                    {trips.map((trip) => (
                        <li
                            key={`${trip.date}-${trip.title}`}
                            className={`${ROW} gap-y-1 py-4 border-b border-line`}
                        >
                            <div className="row-span-5 sm:row-span-2 self-start">
                                <Picture
                                    trip={trip}
                                    photos={photos}
                                    onOpen={openPhoto}
                                />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted tabular-nums sm:pt-1">
                                {trip.date}
                            </p>
                            <div className="min-w-0">
                                <h3 className="text-lg font-semibold leading-snug">
                                    {trip.link ? (
                                        <a
                                            href={trip.link}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="hover:underline underline-offset-4 decoration-2 decoration-accent"
                                        >
                                            {trip.title}
                                        </a>
                                    ) : (
                                        trip.title
                                    )}
                                </h3>
                                {trip.location && (
                                    <p className="text-sm text-muted">
                                        {trip.location}
                                    </p>
                                )}
                            </div>
                            <p className="text-sm sm:pt-1">
                                <span className="sm:hidden text-muted">
                                    Activity:{' '}
                                </span>
                                {trip.type}
                            </p>
                            <p
                                className={`text-sm tabular-nums sm:text-right sm:pt-1 ${
                                    trip.stats ? '' : 'text-muted'
                                }`}
                            >
                                {trip.stats || (
                                    <span className="hidden sm:inline">—</span>
                                )}
                            </p>
                            {trip.details && (
                                <p className="text-sm text-muted sm:col-start-3 sm:col-span-3 mt-1 sm:mt-0">
                                    {trip.details}
                                </p>
                            )}
                        </li>
                    ))}
                </ol>
            </div>

            {openIndex !== null && (
                <Lightbox
                    photos={tripPhotos}
                    index={openIndex}
                    onClose={() => setOpenIndex(null)}
                    onNavigate={setOpenIndex}
                    galleryLink={inGallery}
                />
            )}
        </section>
    )
}
