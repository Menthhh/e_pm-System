import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const WebcamEditted = ({ handleCloseWebcam }) => {
    const handleTakePhoto = (dataUri) => {
        // Do stuff with the photo...
        console.log('takePhoto');
        downloadImage(dataUri);
    };

    const downloadImage = (dataUri) => {
        const link = document.createElement("a");
        link.href = dataUri;
        link.download = "webcam_capture.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative flex flex-col items-center justify-center gap-3 w-screen h-screen bg-white p-4 rounded-lg shadow-lg z-50">
            <Camera onTakePhoto={handleTakePhoto} />
            <button
                onClick={handleCloseWebcam}
                className="absolute top-4 right-4 py-2 px-4 text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
                Close
            </button>
        </div>
    );
};

export default WebcamEditted;
