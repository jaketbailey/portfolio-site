import { Fragment } from 'react'

// Items separated by quiet middle dots ("Go · React · Vite"). The dots are
// decoration only, and the spaces around them let long lists wrap.
export default function DotList({ items }) {
    return items.map((item, i) => (
        <Fragment key={item}>
            {i > 0 && (
                <>
                    {' '}
                    <span aria-hidden="true" className="opacity-60">
                        ·
                    </span>{' '}
                </>
            )}
            {item}
        </Fragment>
    ))
}
