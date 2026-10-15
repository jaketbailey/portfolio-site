// Recent favourite days out, newest first.
//
//   type     Hike | Scramble | Climb | Run | Cycle (free text)
//   stats    optional one-liner, e.g. '14 km · 950 m ascent' or 'Grade 1'
//   link     optional, e.g. the Strava activity (makes the title a link)
//   photo    optional id of a gallery photo, e.g. 'tryfan-north-ridge' (as in
//            /gallery?photo=...). Shows its thumbnail and opens it on click.
//   showInGallery  optional, defaults to true. Set to false to keep the
//            `photo` out of the gallery page and the homepage photo strip, so
//            it only appears here in the logbook.
//   image    optional path or URL of any other picture, e.g. '/outdoors/x.webp'
export default [
    {
        title: 'Tryfan via North Ridge',
        photo: 'img-2698',
        showInGallery: false,
        type: 'Scramble',
        location: 'Eryri, Wales',
        date: 'Sept 2026',
        stats: '6 km · 650 m ascent',
        details:
            'Second time scrambling up Tryfan, this time via the North Ridge, beatiful weather for it!',
    },
    {
        title: 'Ben Nevis via CMD attempt',
        photo: 'img-4677',
        showInGallery: false,
        type: 'Hike',
        location: 'Highlands, Scotland',
        date: 'May 2026',
        stats: '15.57 km · 1219 m ascent',
        details:
            "First time hiking in the snow, despite hiring out all of the equipment, we turned back at CMD, looks like we'll be back soon!",
    },
    {
        title: 'Sgor nam Fiannaidh',
        photo: 'img-1547',
        showInGallery: false,
        type: 'Hike',
        location: 'Highlands, Scotland',
        date: 'May 2026',
        stats: '15.81 km · 1197 m ascent',
        details:
            'Hike up to have a look at Aonach Eagach, a great but long day!',
    },
    {
        title: 'Snowdon via Crib Goch & Garnedd Ugain',
        photo: 'img-20250517-114225398',
        showInGallery: false,
        type: 'Scramble/Hike',
        location: 'Eryri, Wales',
        date: 'May 2025',
        stats: '13.79 km · 864 m ascent',
        details:
            'First time scrambling along Crib Goch, incredible day with perfect conditions.',
    },
    {
        title: "Land's End to John o' Groats",
        photo: 'img-0032',
        showInGallery: false,
        type: 'Cycle',
        location: 'Cornwall to Caithness',
        date: 'July 2016',
        stats: '12 days · £7,300 raised for charity',
        details:
            'Cycled the length of Britain for charity, alongside numerous other cycling events and fundraisers.',
    },
]
