import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { assetUrl, photoDetails, photoId, photoTitle } from '../lib/gallery'
import { animateSpring, project, rubberband } from '../lib/spring'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons'

// Movement (px) before a press becomes a horizontal drag, so taps and small
// wobbles don't move the photo.
const DRAG_THRESHOLD = 10
// Only the last ~100ms of movement counts towards the release velocity.
const VELOCITY_WINDOW = 100

const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Lightbox({ photos, index, onClose, onNavigate }) {
    const photo = photos[index]
    const count = photos.length
    const hasNeighbours = count > 1
    const wrap = useCallback((i) => (i + count) % count, [count])

    const containerRef = useRef(null)
    const viewportRef = useRef(null)
    const trackRef = useRef(null)
    const offset = useRef(0) // px the track is dragged from the current photo
    const spring = useRef(null) // { animation, direction } while settling
    const drag = useRef(null)
    const suppressClick = useRef(false)

    const setOffset = useCallback(
        (x) => {
            offset.current = x
            if (trackRef.current) {
                const base = hasNeighbours ? '-100%' : '0px'
                trackRef.current.style.transform = `translate3d(calc(${base} + ${x}px), 0, 0)`
            }
        },
        [hasNeighbours]
    )

    // A new photo is always shown centred. Runs before paint, so swapping the
    // slides after a slide-over never flashes.
    // Anything still in flight (e.g. Home/End pressed mid-slide) is stale.
    useLayoutEffect(() => {
        spring.current?.animation.stop()
        spring.current = null
        setOffset(0)
    }, [index, setOffset])

    useEffect(() => () => spring.current?.animation.stop(), [])

    // Spring the track to a photo (direction -1 / 0 / 1), starting from where
    // it is now and at the speed it's already moving.
    const settle = useCallback(
        (direction, velocity = 0) => {
            spring.current?.animation.stop()
            const width = viewportRef.current?.clientWidth ?? 0
            const target = -direction * width
            const commit = () => {
                spring.current = null
                if (direction !== 0) onNavigate(wrap(index + direction))
                else setOffset(0)
            }
            if (prefersReducedMotion()) {
                commit()
                return
            }
            spring.current = {
                direction,
                animation: animateSpring({
                    from: offset.current,
                    to: target,
                    velocity,
                    response: 0.35,
                    dampingRatio: 1,
                    onUpdate: setOffset,
                    onComplete: commit,
                }),
            }
        },
        [index, onNavigate, setOffset, wrap]
    )

    const go = useCallback(
        (delta) => {
            if (!hasNeighbours) return
            // Pressed again mid-slide: land the one in flight and move on
            // rather than making the visitor wait for it.
            const inFlight = spring.current
            if (inFlight && inFlight.direction !== 0) {
                inFlight.animation.stop()
                spring.current = null
                onNavigate(wrap(index + inFlight.direction + delta))
                return
            }
            settle(delta)
        },
        [hasNeighbours, index, onNavigate, settle, wrap]
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
                    onNavigate(count - 1)
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
    }, [go, onClose, onNavigate, count])

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

    // Drag to page between photos. The photo follows the pointer 1:1, and on
    // release carries on at the pointer's speed towards wherever the flick
    // would have come to rest.
    const onPointerDown = (event) => {
        if (event.button !== 0) return
        // Grabbing a photo mid-slide catches it where it is.
        if (spring.current) {
            spring.current.animation.stop()
            spring.current = null
        }
        drag.current = {
            id: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            base: offset.current,
            active: false,
            history: [],
        }
    }

    const onPointerMove = (event) => {
        const state = drag.current
        if (!state || event.pointerId !== state.id) return
        const dx = event.clientX - state.startX
        const dy = event.clientY - state.startY

        if (!state.active) {
            if (Math.abs(dy) > DRAG_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
                drag.current = null // a vertical gesture; leave it alone
                return
            }
            if (Math.abs(dx) < DRAG_THRESHOLD) return
            // Start tracking from here, so the photo doesn't jump to catch up.
            state.active = true
            state.startX = event.clientX
            suppressClick.current = true
            viewportRef.current?.setPointerCapture(event.pointerId)
            return
        }

        const width = viewportRef.current?.clientWidth ?? 1
        let x = state.base + (event.clientX - state.startX)
        if (!hasNeighbours) x = rubberband(x, width)
        setOffset(x)

        const now = event.timeStamp
        state.history.push({ x: event.clientX, t: now })
        while (
            state.history.length > 2 &&
            now - state.history[0].t > VELOCITY_WINDOW
        ) {
            state.history.shift()
        }
    }

    const onPointerEnd = (event) => {
        const state = drag.current
        if (!state || event.pointerId !== state.id) return
        drag.current = null
        if (!state.active) return

        const { history } = state
        const first = history[0]
        const last = history[history.length - 1]
        const elapsed = last && first ? last.t - first.t : 0
        const velocity =
            elapsed > 0 && event.type !== 'pointercancel'
                ? ((last.x - first.x) / elapsed) * 1000
                : 0

        if (!hasNeighbours) {
            settle(0, velocity)
            return
        }
        const width = viewportRef.current?.clientWidth ?? 0
        const resting = offset.current + project(velocity)
        const direction =
            resting < -width / 2 ? 1 : resting > width / 2 ? -1 : 0
        settle(direction, velocity)
    }

    // A drag shouldn't count as a click on the backdrop (which closes).
    const onClickCapture = (event) => {
        if (suppressClick.current) {
            suppressClick.current = false
            event.stopPropagation()
            event.preventDefault()
        }
    }

    if (!photo) return null

    const title = photoTitle(photo, index)
    const details = photoDetails(photo)

    const slides = hasNeighbours
        ? [
              { photo: photos[wrap(index - 1)], slot: 'prev' },
              { photo, slot: 'current' },
              { photo: photos[wrap(index + 1)], slot: 'next' },
          ]
        : [{ photo, slot: 'current' }]

    return (
        <div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — photo ${index + 1} of ${count}`}
            tabIndex={-1}
            onClick={onClose}
            className="fixed inset-0 z-50 flex flex-col bg-page/95 backdrop-blur-sm outline-none"
        >
            <div className="flex items-center justify-between px-4 py-3 text-sm text-muted">
                <span className="tabular-nums">
                    {index + 1} / {count}
                </span>
                <button
                    type="button"
                    aria-label="Close viewer"
                    onClick={onClose}
                    className="pressable p-2 -mr-2 rounded-md hover:text-ink"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="relative flex-1 min-h-0 flex items-center">
                {hasNeighbours && (
                    <button
                        type="button"
                        aria-label="Previous photo"
                        onClick={(event) => {
                            event.stopPropagation()
                            go(-1)
                        }}
                        className="pressable absolute left-0 sm:left-2 z-10 p-2 sm:p-3 rounded-full bg-surface/70 text-ink hover:bg-surface"
                    >
                        <ChevronLeftIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </button>
                )}

                <div
                    ref={viewportRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerEnd}
                    onPointerCancel={onPointerEnd}
                    onClickCapture={onClickCapture}
                    className="h-full w-full overflow-hidden touch-pan-y select-none"
                >
                    <div
                        ref={trackRef}
                        className="flex h-full will-change-transform"
                    >
                        {slides.map(({ photo: slide, slot }) => (
                            <div
                                // Keyed by photo so the current image's
                                // element is reused when it becomes a
                                // neighbour, rather than reloaded.
                                key={`${photoId(slide)}${count === 2 && slot === 'prev' ? '-prev' : ''}`}
                                aria-hidden={slot !== 'current'}
                                className="h-full w-full shrink-0 flex items-center justify-center px-2 sm:px-16"
                            >
                                <img
                                    src={assetUrl(slide.full || slide.thumb)}
                                    alt={
                                        slot === 'current'
                                            ? slide.alt || title
                                            : ''
                                    }
                                    width={slide.width || undefined}
                                    height={slide.height || undefined}
                                    draggable={false}
                                    onClick={(event) => event.stopPropagation()}
                                    className="max-h-full max-w-full w-auto h-auto object-contain rounded-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {hasNeighbours && (
                    <button
                        type="button"
                        aria-label="Next photo"
                        onClick={(event) => {
                            event.stopPropagation()
                            go(1)
                        }}
                        className="pressable absolute right-0 sm:right-2 z-10 p-2 sm:p-3 rounded-full bg-surface/70 text-ink hover:bg-surface"
                    >
                        <ChevronRightIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </button>
                )}
            </div>

            <div
                onClick={(event) => event.stopPropagation()}
                className="shrink-0 max-h-[35vh] overflow-y-auto px-4 sm:px-16 py-4 text-center"
            >
                <h2 className="text-lg sm:text-xl font-semibold text-ink">
                    {title}
                </h2>
                {photo.caption && (
                    <p className="mt-1 text-sm text-muted max-w-2xl mx-auto">
                        {photo.caption}
                    </p>
                )}
                {details.length > 0 && (
                    <dl className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted">
                        {details.map(([label, value]) => (
                            <div key={label} className="flex gap-1.5">
                                <dt className="uppercase tracking-wide opacity-60">
                                    {label}
                                </dt>
                                <dd className="font-medium text-ink">
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
