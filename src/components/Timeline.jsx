import timelineData from '../data/timeline'
import TimelineItem from './TimelineItem'

export default function Timeline() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="pt-10 md:pt-24 w-full md:w-5/6">
                <h2 className="text-3xl font-bold underline">Experience</h2>
                {timelineData.map((item) => (
                    <TimelineItem
                        key={`${item.year}-${item.title}`}
                        data={item}
                    />
                ))}
            </div>
        </div>
    )
}
