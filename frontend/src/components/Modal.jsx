import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-black/30 bg-opacity-50 p-2 sm:p-4">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-[80vh] overflow-y-auto">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer transition-colors"
                            onClick={onClose}
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Modal body */}
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 dark:text-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
