import { assetUrl, photoTitle } from '../lib/gallery'

export default function PhotoTile({ photo, index, onOpen }) {
    const title = photoTitle(photo, index)

    return (
        <button
            type="button"
            onClick={onOpen}
            aria-label={`Open ${title}`}
            className="group relative block w-full mb-3 break-inside-avoid overflow-hidden rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-purple-400"
        >
            <img
                src={assetUrl(photo.thumb || photo.full)}
                alt={photo.alt || title}
                width={photo.width || undefined}
                height={photo.height || undefined}
                loading="lazy"
                decoding="async"
                className="w-full h-auto bg-zinc-100 dark:bg-zinc-800 transition duration-300 ease-in-out group-hover:opacity-85"
            />
            {photo.name && (
                <span className="absolute inset-x-0 bottom-0 p-2 text-left text-xs text-white bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {photo.name}
                </span>
            )}
        </button>
    )
}
