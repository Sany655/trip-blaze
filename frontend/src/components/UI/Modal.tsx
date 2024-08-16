import React from 'react'

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
                    onClick={onClose}
                >
                    <div
                        className="relative w-11/12 max-w-md p-6 bg-white rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                            onClick={onClose}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* Modal Title */}
                        {title && (
                            <h3 className="mb-4 text-lg font-medium text-gray-800">{title}</h3>
                        )}

                        {/* Modal Content */}
                        <div>{children}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
