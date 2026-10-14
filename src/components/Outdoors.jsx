import trips from '../data/outdoors'
import SectionHeading from './SectionHeading'

export default function Outdoors() {
    if (trips.length === 0) return null

    return (
        <section id="outdoors" className="pt-12 scroll-mt-16">
            <SectionHeading>Outdoors</SectionHeading>
            <p className="mb-6 text-muted">
                I love being outdoors, whether that&apos;s running, cycling,
                hiking, climbing or scrambling. Here are a few of my favourite
                days out:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips.map((trip) => (
                    <article
                        key={`${trip.date}-${trip.title}`}
                        className="flex flex-col gap-2 p-4 rounded-md border border-line bg-surface"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded-md bg-tag text-tag-ink">
                                {trip.type}
                            </span>
                            {trip.example && (
                                <span className="text-xs uppercase tracking-wide text-muted">
                                    Example
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold leading-snug">
                            {trip.title}
                        </h3>
                        <p className="text-sm text-muted">
                            {[trip.location, trip.date]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                        {trip.stats && (
                            <p className="text-sm font-medium tabular-nums">
                                {trip.stats}
                            </p>
                        )}
                        {trip.details && (
                            <p className="text-sm">{trip.details}</p>
                        )}
                        {trip.link && (
                            <a
                                href={trip.link}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="mt-auto pt-1 text-sm text-link hover:underline underline-offset-2 decoration-2 decoration-accent"
                            >
                                View activity
                            </a>
                        )}
                    </article>
                ))}
            </div>
        </section>
    )
}
