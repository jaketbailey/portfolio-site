import { useCallback, useEffect, useRef } from 'react'
import { assetUrl, photoDetails, photoTitle } from '../lib/gallery'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons'

const SWIPE_THRESHOLD = 50

export default function Lightbox({ photos, index, onClose, onNavigate }) {
    const photo = photos[index]
    const containerRef = useRef(null)
    const touchStart = useRef(null)

    const go = useCallback(
        (delta) => {
            const next = (index + delta + photos.length) % photos.length
            onNavigate(next)
        },
        [index, photos.length, onNavigate]
    )

    // Arrow keys / Escape while the viewer is open.
    useEffect(() => {
        const onKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault()
                    go(-1)
                    break
                case 'ArrowRight':
                    event.preventDefault()
                    go(1)
                    break
                case 'Home':
                    event.preventDefault()
                    onNavigate(0)
                    break
                case 'End':
                    event.preventDefault()
                    onNavigate(photos.length - 1)
                    break
                case 'Escape':
                    event.preventDefault()
                    onClose()
                    break
                default:
                    break
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [go, onClose, onNavigate, photos.length])

    // Stop the page behind the viewer from scrolling, and return focus to the
    // thumbnail that opened it.
    useEffect(() => {
        const { overflow } = document.body.style
        const previouslyFocused = document.activeElement
        document.body.style.overflow = 'hidden'
        containerRef.current?.focus()
        return () => {
            document.body.style.overflow = overflow
            if (previouslyFocused instanceof HTMLElement) {
                previouslyFocused.focus()
            }
        }
    }, [])

    // Warm the neighbours so arrowing through feels instant.
    useEffect(() => {
        for (const delta of [-1, 1]) {
            const neighbour =
                photos[(index + delta + photos.length) % photos.length]
            if (!neighbour) continue
            const image = new Image()
            image.src = assetUrl(neighbour.full || neighbour.thumb)
        }
    }, [index, photos])

    const onTouchStart = (event) => {
        const touch = event.changedTouches[0]
        touchStart.current = { x: touch.clientX, y: touch.clientY }
    }

    const onTouchEnd = (event) => {
        if (!touchStart.current) return
        const touch = event.changedTouches[0]
        const dx = touch.clientX - touchStart.current.x
        const dy = touch.clientY - touchStart.current.y
        touchStart.current = null
        // Horizontal intent only, so a vertical scroll of the caption is safe.
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            go(dx < 0 ? 1 : -1)
        }
    }

    if (!photo) return null

    const title = photoTitle(photo, index)
    const details = photoDetails(photo)

    return (
        <div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — photo ${index + 1} of ${photos.length}`}
            tabIndex={-1}
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="fixed inset-0 z-50 flex flex-col bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm outline-none"
        >
            <div className="flex items-center justify-between px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="tabular-nums">
                    {index + 1} / {photos.length}
                </span>
                <button
                    type="button"
                    aria-label="Close viewer"
                    onClick={onClose}
                    className="p-2 -mr-2 rounded-md hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="relative flex-1 min-h-0 flex items-center justify-center px-2 sm:px-16">
                {photos.length > 1 && (
                    <button
                        type="button"
                        aria-label="Previous photo"
                        onClick={(event) => {
                            event.stopPropagation()
                            go(-1)
                        }}
                        className="absolute left-0 sm:left-2 z-10 p-2 sm:p-3 rounded-full bg-white/70 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 transition"
                    >
                        <ChevronLeftIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </button>
                )}

                <img
                    key={photo.file || photo.full}
                    src={assetUrl(photo.full || photo.thumb)}
                    alt={photo.alt || title}
                    width={photo.width || undefined}
                    height={photo.height || undefined}
                    onClick={(event) => event.stopPropagation()}
                    className="max-h-full max-w-full w-auto h-auto object-contain rounded-sm animate-fadeIn"
                />

                {photos.length > 1 && (
                    <button
                        type="button"
                        aria-label="Next photo"
                        onClick={(event) => {
                            event.stopPropagation()
                            go(1)
                        }}
                        className="absolute right-0 sm:right-2 z-10 p-2 sm:p-3 rounded-full bg-white/70 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 transition"
                    >
                        <ChevronRightIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </button>
                )}
            </div>

            <div
                onClick={(event) => event.stopPropagation()}
                className="shrink-0 max-h-[35vh] overflow-y-auto px-4 sm:px-16 py-4 text-center"
            >
                <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {title}
                </h2>
                {photo.caption && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        {photo.caption}
                    </p>
                )}
                {details.length > 0 && (
                    <dl className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                        {details.map(([label, value]) => (
                            <div key={label} className="flex gap-1.5">
                                <dt className="uppercase tracking-wide opacity-60">
                                    {label}
                                </dt>
                                <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </div>
    )
}
