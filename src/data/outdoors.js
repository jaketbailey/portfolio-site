// Recent favourite days out, newest first.
//
//   type     Hike | Scramble | Climb | Run (anything works, it's just a label)
//   stats    optional one-liner, e.g. '14 km · 950 m ascent' or 'Grade 1'
//   link     optional, e.g. the Strava activity
//
// Entries marked `example: true` are placeholders: they show up in `npm run
// dev` so the section has something in it, but are dropped from production
// builds. Replace them with real trips and delete the flag.
export default [
    {
        title: 'Tryfan via North Ridge',
        type: 'Scramble',
        location: 'Eryri, Wales',
        date: 'Sept 2026',
        stats: '6 km · 650 m ascent',
        details: 'Second time scrambling up Tryfan, this time via the North Ridge, beatiful weather for it!',
    },
    {
        title: 'Ben Nevis via CMD attempt',
        type: 'Hike',
        location: 'Highlands, Scotland',
        date: 'May 2026',
        details: 'First time hiking in the snow, despite hiring out all of the equipment, we turned back at CMD, looks like we\'ll be back soon!',
    },
    {
        title: 'Sgor nam Fiannaidh',
        type: 'Hike',
        location: 'Highlands, Scotland',
        date: 'May 2026',
        details: 'Hike up to have a look at Aonach Eagach, a great but long day!',
    },
    {
        title: 'Snowdon via Crib Goch & Garnedd Ugain',
        type: 'Scramble/Hike',
        location: 'Eryri, Wales',
        date: 'May 2025',
        stats: '14 km · 864 m ascent',
        details: 'First time hiking in the snow, despite hiring out all of the equipment, we turned back at CMD, looks like we\'ll be back soon!',
    },
    {
        title: "Land's End to John o' Groats",
        type: 'Cycle',
        location: 'Cornwall to Caithness',
        date: 'July 2016',
        stats: '12 days · £7,300 raised for charity',
        details:
            'Cycled the length of Britain for charity, alongside numerous other cycling events and fundraisers.',
    },
].filter((trip) => import.meta.env.DEV || !trip.example)
