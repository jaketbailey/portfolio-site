import DotList from './DotList'

export default function PortfolioItem({
    title,
    imgUrl,
    imgUrlLight,
    stack,
    link,
    description,
}) {
    return (
        <a
            href={link}
            target="_blank"
            rel="noreferrer noopener"
            className="pressable group border border-line bg-surface rounded-md hover:border-accent overflow-hidden w-full h-full flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
            {/* Swapped with CSS rather than JS state so the right image is
                present on the very first paint. */}
            <img
                src={imgUrlLight}
                alt=""
                loading="lazy"
                className="block dark:hidden w-full h-36 md:h-48 object-cover"
            />
            <img
                src={imgUrl}
                alt=""
                loading="lazy"
                className="hidden dark:block w-full h-36 md:h-48 object-cover"
            />
            <div className="flex flex-col flex-1 gap-3 w-full p-4">
                <h3 className="text-xl md:text-2xl font-semibold leading-snug">
                    {title}
                </h3>
                <p className="-mt-1 text-xs font-semibold uppercase tracking-wider text-muted">
                    <span className="sr-only">Built with </span>
                    <DotList items={stack} />
                </p>
                <p className="text-sm">{description.trim()}</p>
                <span className="mt-auto text-sm font-medium text-link">
                    View on GitHub{' '}
                    <span
                        aria-hidden="true"
                        className="inline-block motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
                    >
                        →
                    </span>
                </span>
            </div>
        </a>
    )
}
