import { useState } from 'react'
import Modal from './Modal'

export default function PortfolioItem({
    title,
    imgUrl,
    imgUrlLight,
    stack,
    link,
    description,
}) {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button
                type="button"
                className="border-2 border-zinc-900 dark:border-zinc-300 rounded-md overflow-hidden w-full md:w-5/6 text-left"
                onClick={() => setShowModal(true)}
            >
                {/* Swapped with CSS rather than JS state so the right image is
                    present on the very first paint. */}
                <img
                    src={imgUrlLight}
                    alt={title}
                    className="block dark:hidden w-full h-36 md:h-48 object-cover"
                />
                <img
                    src={imgUrl}
                    alt={title}
                    className="hidden dark:block w-full h-36 md:h-48 object-cover"
                />
                <div className="w-full p-4">
                    <h3 className="text-lg md:text-xl mb-2 md:mb-3 font-semibold">
                        {title}
                    </h3>
                    <p className="flex flex-wrap gap-2 flex-row items-center justify-start text-xs md:text-sm">
                        {stack.map((item) => (
                            <span
                                key={item}
                                className="inline-block px-2 py-1 text-xs font-semibold uppercase text-blue-700 bg-blue-300 dark:text-purple-700 dark:bg-purple-300 rounded-md"
                            >
                                {item}
                            </span>
                        ))}
                    </p>
                </div>
            </button>

            {showModal && (
                <Modal
                    title={title}
                    description={description}
                    link={link}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    )
}
