import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";

const ShowmoreData = ({ data, close }) => {
    const router = useRouter();
    const { events, date } = data;
    const formattedDate = new Date(date).toLocaleDateString();

    const handleSelectEvent = (event) => {
        if (router) {
            if (event.status_name === 'plan') {
                Swal.fire({
                    title: 'Job is in plan status',
                    text: 'You cannot view the job in plan status',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            } else if (event.status_name === 'complete') {
                router.push(`/pages/view-jobs?job_id=${event.job_id}&views=true`);
            } else if (event.status_name === 'overdue') {
                Swal.fire({
                    title: 'Job is overdue',
                    text: 'You cannot view the job in overdue status',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            }
            else if (event.status_name === 'new') {
                router.push(`/pages/view-jobs?job_id=${event.job_id}&views=false`);
            }
            else if (event.status_name === 'ongoing') {
                router.push(`/pages/view-jobs?job_id=${event.job_id}&views=false`);
            }
            else {
                router.push(`/pages/view-jobs?job_id=${event.job_id}&views=true`);
            }
        }
    };

    return (
        <div className="w-full h-full max-h-[80vh] bg-white p-6 rounded-lg shadow-lg overflow-y-auto relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitScrollbar: 'none' }}>
            <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800">Events on {formattedDate}</h2>
                <IconButton onClick={close} className="absolute top-2 right-2">
                    <CloseIcon />
                </IconButton>
            </div>
            <hr className="border-gray-300 my-4" />
            <ul className="flex flex-col gap-3">
                <li className="text-sm font-semibold text-gray-600">Total Events: {events.length}</li>
                {
                    events.map((event, index) => (
                        <li
                            key={index}
                            className="text-sm font-semibold p-3 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleSelectEvent(event)}
                            style={{
                                backgroundColor: event.color || '#f0f0f0',
                            }}
                        >
                            {event.title}
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default ShowmoreData;
