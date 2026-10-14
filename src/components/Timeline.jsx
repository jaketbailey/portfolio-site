import timelineData from '../data/timeline'
import TimelineItem from './TimelineItem'
import SectionHeading from './SectionHeading'

export default function Timeline() {
    return (
        <section id="experience" className="pt-12 max-w-3xl scroll-mt-16">
            <SectionHeading className="mb-0">Experience</SectionHeading>
            {timelineData.map((item) => (
                <TimelineItem key={`${item.year}-${item.title}`} data={item} />
            ))}
        </section>
    )
}
