import { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Lightbox from '../components/Lightbox'
import PhotoTile from '../components/PhotoTile'
import { fetchGallery, manifestUrl } from '../lib/gallery'

export default function Gallery() {
    const [photos, setPhotos] = useState([])
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState(null)
    const [openIndex, setOpenIndex] = useState(null)

    useEffect(() => {
        const controller = new AbortController()
        fetchGallery(controller.signal)
            .then((loaded) => {
                setPhotos(loaded)
                setStatus('ready')
            })
            .catch((err) => {
                if (err.name === 'AbortError') return
                setError(err.message)
                setStatus('error')
            })
        return () => controller.abort()
    }, [])

    const closeLightbox = useCallback(() => setOpenIndex(null), [])

    return (
        <Layout>
            <div className="max-w-6xl mx-auto w-11/12 pt-24 md:pt-28 pb-10">
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
                                key={photo.id || photo.file || index}
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
