import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

const JobPlan = ({ data, onClose }) => {
    // Disable background scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg w-2/3 flex flex-col gap-6 relative">
                <h1 className="text-2xl font-bold">Set Activation Date</h1>
                {/* Include form fields for activation date */}
                <button
                    className="bg-red-700 text-white font-bold py-2 px-4 self-end absolute top-0 right-0 hover:bg-red-800 shadow-lg rounded-sm"
                    onClick={onClose} // Close modal on button click
                >
                    <CloseIcon className="size-18" />
                </button>
               
            </div>
        </div>
    );
}

export default JobPlan;
