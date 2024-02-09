import React from 'react';
import timelineData from '../data/timeline';
import TimelineItem from './TimelineItem';

export default function Timeline() {
    const theme = 'dark'; // replace this with your theme state
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="pt-12 w-5/6">
            <h2 className="pt-12 text-3xl font-bold underline">Experience</h2>
                {timelineData.map((data, idx) => (
                    <TimelineItem key={idx} data={data} theme={theme} />
                ))}
            </div>
        </div>
    );
}