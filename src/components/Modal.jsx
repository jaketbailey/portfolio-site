export default function Modal({ title, description, link, show, onClose }) {
    return (
        <div className={`fixed z-10 inset-0 overflow-y-auto ${show ? '' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className={`inline-block align-bottom dark:bg-stone-900 dark:text-stone-300 bg-white text-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`} onClick={e => e.stopPropagation()}>
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start">
                            <h2 className="text-lg leading-6 font-medium" id="modal-title">{title}</h2>
                            <button onClick={onClose} className="ml-3 h-7 w-7 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-2">
                            <p className="my-4 text-sm">{description}</p>
                            <a
                                href={link}
                                target="_blank"
                                className="py-2 px-2 bg-blue-400 dark:bg-purple-400 dark:text-stone-900 text-sm p-1 rounded-md"
                                rel="noreferrer noopener"
                            >
                                View Project
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}