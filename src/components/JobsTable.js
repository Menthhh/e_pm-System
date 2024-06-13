'use client'
import useFetchJobs from "@/lib/hooks/useFetchJobs.js";
import TableComponent from "./TableComponent";
import Link from "next/link";

const jobsActiveHeader = [
    "ID",
    "Checklist Name",
    "Document no.",
    "Status",
    "Active",
    "Action"
]

const JobsTable = ({ refresh }) => {
    const { jobs, isLoading: jobsLoading } = useFetchJobs(refresh);
    

    const jobsActiveBody = jobs && jobs.map((job, index) => {
        let statusColor = job.STATUS_COLOR;


        return {
            "ID": index + 1,
            "Checklist Name": job.JOB_NAME,
            "Document no.": job.DOC_NUMBER,
            "Status": (
                <div
                    style={{ backgroundColor: statusColor }}
                    className="py-1  rounded-full text-black font-bold shadow-xl text-[12px] ipadmini:text-sm flex justify-center items-center px-6"
                >
                    {job.STATUS_NAME ? job.STATUS_NAME : "pending"}
                </div>
            ),
            "Active": job.createdAt ? new Date(job.createdAt).toLocaleString() : "Not Active",
            "Action": (
                <div>
                    {job.STATUS_NAME === "complete" ? (
                        <Link
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-[12px] ipadmini:text-sm px-5 py-2 text-center"
                            href={{
                                pathname: "/pages/view-jobs",
                                query: {
                                    job_id: job._id,
                                    view: "true"
                                },
                            }}
                        >
                            View
                        </Link>
                    ) : job.STATUS_NAME !== "overdue" ? (
                        <>
                            {(job.STATUS_NAME === "ongoing" || job.STATUS_NAME === "new") ? (
                                <div className="flex gap-2 items-center justify-center">
                                    <Link
                                        className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none font-bold rounded-lg text-[12px] ipadmini:text-sm px-5 py-2 text-center"
                                        href={{
                                            pathname: "/pages/view-jobs",
                                            query: {
                                                job_id: job._id,
                                                view: "false"
                                            },
                                        }}
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-[12px] ipadmini:text-sm px-5 py-2 text-center"
                                        href={{
                                            pathname: "/pages/view-jobs",
                                            query: {
                                                job_id: job._id,
                                                view: "true"
                                            },
                                        }}
                                    >
                                        View
                                    </Link>
                                </div>
                            ) : job.STATUS_NAME === "renew" ? (
                                <Link
                                    className="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none font-bold rounded-lg text-[12px] ipadmini:text-sm px-5 py-2 text-center"
                                    href={{
                                        pathname: "/pages/job-renew",
                                        query: {
                                            job_id: job._id,
                                            retake: "true"
                                        },
                                    }}
                                >
                                    Retake
                                </Link>
                            ) : (
                                <button
                                    className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none font-bold rounded-lg text-[12px] ipadmini:text-sm px-5 py-2 text-center cursor-not-allowed"
                                    disabled
                                >
                                    unavailable now 
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none font-bold rounded-lg text-[12px] ipadmini:text-sm px-5 py-2 text-center cursor-not-allowed"
                            disabled
                        >
                            overdue
                        </button>
                    )}
                </div>
            )
        }
    });

    return (
        <TableComponent headers={jobsActiveHeader} datas={jobsActiveBody} TableName="Active Jobs" PageSize={5} />
    )
}

export default JobsTable;
