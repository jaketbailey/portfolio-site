// Where the photos and their manifest are served from.
//
// Defaults to a same-origin /photos directory, which is what you want once the
// site itself is served from the home server: no CORS, no config. While the
// site is still on Vercel and the images live elsewhere, point it at the server
// with VITE_GALLERY_BASE_URL (that host then needs an
// Access-Control-Allow-Origin header, or a rewrite in vercel.json).
const BASE = (import.meta.env.VITE_GALLERY_BASE_URL || '/photos').replace(
    /\/+$/,
    ''
)

export const manifestUrl = `${BASE}/gallery.json`

export const assetUrl = (path) =>
    /^https?:\/\//.test(path) ? path : `${BASE}/${path.replace(/^\/+/, '')}`

export async function fetchGallery(signal) {
    const response = await fetch(manifestUrl, { signal })
    if (!response.ok) {
        throw new Error(
            `Could not load the gallery manifest (HTTP ${response.status})`
        )
    }
    const data = await response.json()
    const photos = Array.isArray(data) ? data : data.photos
    if (!Array.isArray(photos)) {
        throw new Error('Gallery manifest has no "photos" array')
    }
    return photos.filter((photo) => !photo.hidden)
}

const withPrefix = (value, format) => {
    const text = String(value).trim()
    if (!text) return ''
    // Pass through anything the manifest already formatted ("f/2.8", "1/500s").
    return /^[\d.]+$/.test(text) ? format(text) : text
}

// Builds the caption rows shown under the large image, skipping blank fields so
// a film frame with only a body and a stock listed still looks deliberate.
export function photoDetails(photo) {
    return [
        ['Camera', photo.camera],
        ['Lens', photo.lens],
        ['Film', photo.film],
        ['Focal length', withPrefix(photo.focalLength, (v) => `${v}mm`)],
        ['Aperture', withPrefix(photo.aperture, (v) => `f/${v}`)],
        ['Shutter', withPrefix(photo.shutter, (v) => `${v}s`)],
        ['ISO', withPrefix(photo.iso, (v) => v)],
        ['Location', photo.location],
        ['Date', photo.date],
    ].filter(([, value]) => value != null && String(value).trim() !== '')
}

export const photoTitle = (photo, index) =>
    photo.name?.trim() || photo.file || `Photo ${index + 1}`
