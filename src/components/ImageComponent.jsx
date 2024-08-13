import React, { useState } from 'react'

export default function ImageComponent({ thumbnail, src, alt }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <div className="w-1/3 rounded-sm p-1">
                <img
                    src={thumbnail}
                    alt={alt}
                    className="w-full object-cover rounded-sm cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
                    onClick={openModal}
                />
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-900 bg-opacity-80 dark:bg-opacity-80"
                    onClick={closeModal}
                >
                    <div className="relative">
                        <img
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-screen rounded-sm animate-fadeIn p-10"
                        />
                        <button
                            className="absolute top-2 right-2 text-white text-2xl font-bold"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
