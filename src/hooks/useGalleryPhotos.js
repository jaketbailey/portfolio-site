import { useEffect, useState } from 'react'
import { fetchGallery } from '../lib/gallery'

// One manifest request shared by everything on the page that shows gallery
// photos (the homepage strip and the Outdoors logbook). Resolves to [] if
// the manifest can't be loaded, e.g. in development without photos.
let request = null
const loadOnce = () => {
    if (!request) {
        request = fetchGallery().catch(() => {
            request = null // allow a retry on the next mount
            return []
        })
    }
    return request
}

export default function useGalleryPhotos() {
    const [photos, setPhotos] = useState([])
    useEffect(() => {
        let live = true
        loadOnce().then((loaded) => live && setPhotos(loaded))
        return () => {
            live = false
        }
    }, [])
    return photos
}
