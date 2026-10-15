// The dot and the line running down to the next entry sit level with the
// title's first line, at a fixed distance from the top of every entry (below
// the year on phones, 1.5rem on wider screens). So each line segment, one
// entry tall, lands exactly on the next dot however many lines a title wraps
// onto.
export default function TimelineItem({ data }) {
    return (
        <div className="relative pl-8 sm:pl-32 py-6 group">
            <time className="block sm:absolute sm:left-0 sm:top-6 sm:w-20 sm:text-right text-sm font-bold leading-7 tracking-wider tabular-nums text-muted">
                {data.year}
            </time>
            <div className="font-heading font-semibold text-xl leading-snug tracking-tight before:absolute before:top-[3.25rem] sm:before:top-6 before:left-2 sm:before:left-0 sm:before:ml-[6.5rem] before:h-full before:px-px before:bg-line before:-translate-x-1/2 before:translate-y-3 group-last:before:hidden after:absolute after:top-[3.25rem] sm:after:top-6 after:left-2 sm:after:left-0 sm:after:ml-[6.5rem] after:w-2 after:h-2 after:box-content after:border-4 after:border-accent after:rounded-full after:bg-page after:-translate-x-1/2 after:translate-y-1.5">
                {data.title}
            </div>
            <div className="mb-1 text-base font-medium text-muted">
                {data.duration}
            </div>
            <div>{data.details}</div>
        </div>
    )
}
