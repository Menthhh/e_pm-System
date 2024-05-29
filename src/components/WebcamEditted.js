import React, { useRef, useState } from "react";

const WebcamEditted = ({ handleCloseWebcam }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.getElementById("video")
            video.srcObject = stream;
            video.onloadedmetadata = function (e) {
                video.play();
            };

            videoRef.current.srcObject = stream;
            setMediaStream(stream);
            setIsStreaming(true);
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    };

    const stopWebcam = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => {
                track.stop();
            });
            setIsStreaming(false);
        }
    };

    const capture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            // Set canvas dimensions to match video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame on canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to data URL and trigger download
            const dataUrl = canvas.toDataURL("image/jpeg");
            downloadImage(dataUrl);
        }
    };

    const downloadImage = (dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "webcam_capture.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative flex flex-col items-center justify-center gap-3 w-screen h-screen bg-white p-4 rounded-lg shadow-lg z-50">
            <video
                ref={videoRef}
                className="rounded-lg shadow-lg mb-4"
                id="video"
                autoPlay
                playsInline
            ></video>
            {!isStreaming ? (
                <button
                    onClick={startWebcam}
                    className="w-3/4 py-3 mb-4 text-white bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Start Webcam
                </button>
            ) : (
                <>
                    <button
                        onClick={capture}
                        className="w-3/4 py-3 mb-4 text-white bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Capture photo
                    </button>
                    <button
                        onClick={stopWebcam}
                        className="w-3/4 py-3 mb-4 text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Stop Webcam
                    </button>
                </>
            )}
            <button
                onClick={handleCloseWebcam}
                className="absolute top-4 right-4 py-2 px-4 text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
                Close
            </button>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
    );
};

export default WebcamEditted;
