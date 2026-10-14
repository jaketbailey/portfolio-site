import { useEffect } from 'react'
import { CloseIcon } from './icons'

export default function Modal({ title, description, link, onClose }) {
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full sm:max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-300 rounded-lg text-left shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="px-4 pt-5 pb-4 sm:p-6">
                    <div className="flex justify-between items-start">
                        <h2
                            className="text-lg leading-6 font-medium"
                            id="modal-title"
                        >
                            {title}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="ml-3 h-7 w-7 shrink-0 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <p className="my-4 text-sm">{description}</p>
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-block py-2 px-2 bg-blue-400 dark:bg-purple-400 text-white dark:text-zinc-900 text-sm rounded-md"
                    >
                        View Project
                    </a>
                </div>
            </div>
        </div>
    )
}
