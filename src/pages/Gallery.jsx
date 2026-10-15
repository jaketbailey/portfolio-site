import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout, { PAGE_COLUMN } from '../components/Layout'
import Lightbox from '../components/Lightbox'
import PhotoTile from '../components/PhotoTile'
import { fetchGallery, inGallery, manifestUrl, photoId } from '../lib/gallery'

export default function Gallery() {
    const [photos, setPhotos] = useState([])
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState(null)
    // The open photo lives in the URL (/gallery?photo=<id>), so the homepage
    // teaser can link straight to one and a photo can be shared. Changes made
    // in here replace the history entry, so Back leaves the gallery rather
    // than stepping through every photo viewed.
    const [searchParams, setSearchParams] = useSearchParams()
    const openId = searchParams.get('photo')
    const found = openId
        ? photos.findIndex((photo) => photoId(photo) === openId)
        : -1
    const openIndex = found === -1 ? null : found

    const setOpenIndex = useCallback(
        (index) =>
            setSearchParams(
                index === null ? {} : { photo: photoId(photos[index]) },
                { replace: true }
            ),
        [photos, setSearchParams]
    )

    useEffect(() => {
        const controller = new AbortController()
        fetchGallery(controller.signal)
            .then((loaded) => {
                setPhotos(loaded.filter(inGallery))
                setStatus('ready')
            })
            .catch((err) => {
                if (err.name === 'AbortError') return
                setError(err.message)
                setStatus('error')
            })
        return () => controller.abort()
    }, [])

    const closeLightbox = useCallback(() => setOpenIndex(null), [setOpenIndex])

    return (
        <Layout>
            <div className={`${PAGE_COLUMN} pt-24 md:pt-28 pb-10`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                    Photography
                </h1>

                {status === 'loading' && (
                    <p className="opacity-60">Loading photos…</p>
                )}

                {status === 'error' && (
                    <div className="opacity-80">
                        <p>Sorry, the photos couldn&apos;t be loaded.</p>
                        <p className="mt-1 text-sm opacity-70">
                            {error} (expected a manifest at{' '}
                            <code className="font-mono">{manifestUrl}</code>)
                        </p>
                    </div>
                )}

                {status === 'ready' && photos.length === 0 && (
                    <p className="opacity-60">No photos here yet.</p>
                )}

                {status === 'ready' && photos.length > 0 && (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
                        {photos.map((photo, index) => (
                            <PhotoTile
                                key={photoId(photo)}
                                photo={photo}
                                index={index}
                                onOpen={() => setOpenIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {openIndex !== null && (
                <Lightbox
                    photos={photos}
                    index={openIndex}
                    onClose={closeLightbox}
                    onNavigate={setOpenIndex}
                />
            )}
        </Layout>
    )
}
