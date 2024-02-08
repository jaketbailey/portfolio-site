import React from 'react';

export default function TimelineItem({ data, theme }) {
    return (
        <div className="relative pl-8 sm:pl-32 py-6 group">
            <div className={`font-semibold text-xl mb-1 sm:mb-0 text-zinc-900 dark:text-white`}>{data.title}</div>
            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-zinc-900 dark:before:bg-white sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-white dark:after:bg-zinc-900 after:border-4 after:box-content after:border-zinc-900 dark:after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-blue-600 bg-blue-300 dark:text-purple-600 dark:bg-purple-300 rounded-full">{data.year}</time>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{data.duration}</div>
            </div>
            <div className="text-zinc-800 dark:text-white">{data.details}</div>
        </div>
    );
}