export default function TimelineItem({ data }) {
    return (
        <div className="relative pl-8 sm:pl-32 py-6 group">
            <div className="font-heading font-semibold text-xl leading-snug tracking-tight mb-1 sm:mb-0">
                {data.title}
            </div>
            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-line sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-page after:border-4 after:box-content after:border-accent after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wide w-20 h-6 mb-3 sm:mb-0 text-tag-ink bg-tag rounded-md">
                    {data.year}
                </time>
                <div className="text-base font-medium text-muted">
                    {data.duration}
                </div>
            </div>
            <div>{data.details}</div>
        </div>
    )
}
