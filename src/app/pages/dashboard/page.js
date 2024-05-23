"use client"
import TableComponent from "@/components/TableComponent";
import Card from "@/components/Card";
import { useState } from "react";
import Layout from "@/components/Layout";
import Link from "next/link.js";
import useFetchUsers from "@/lib/hooks/useFetchUser.js";
import useFetchCards from "@/lib/hooks/useFetchCards.js";
import useFetchJobs from "@/lib/hooks/useFetchJobs.js";


const jobsActiveHeader = [
    "ID",
    "Job Name",
    "Document no.",
    "Status",
    "Active",
    "Activator",
    "Action"
]


const Page = () => {
    const [refresh, setRefresh] = useState(false);
    const { user, isLoading: usersloading } = useFetchUsers(refresh);
    const { cards, isLoading: cardsLoading } = useFetchCards(refresh);
    const { jobs, isLoading: jobsLoading } = useFetchJobs(refresh);


    const jobsActiveBody = jobs && jobs.map((job, index) => {
        return {
            "ID": index + 1,
            "Job Name": job.JOB_NAME,
            "Document no.": job.DOC_NUMBER,
            "Status": <div
                style={{ backgroundColor: job.STATUS_COLOR }}
                className="px-1 py-1 rounded-full text-gray-800 font-semibold shadow-xl "
            >
                {job.STATUS_NAME ? job.STATUS_NAME : "pending"}
            </div>
            ,
            "Active": job.createdAt ? new Date(job.createdAt).toLocaleString() : "Not Active",
            "Activator": job.ACTIVATER_NAME,
            "Action":
                (
                    //if job activate date not equal to today or less than today then allow to all action otherwise disable all action
                    job.STATUS_NAME !== "plan" ?
                        // if job status is not overdue then allow to edit and view job otherwise disable all action
                        (job.STATUS_NAME !== "overdue" ?
                            <div className="flex gap-2 items-center justify-center">
                                <Link
                                    className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2 text-center "
                                    href={{
                                        pathname: "/pages/view-jobs",
                                        query: {
                                            job_id: job._id,
                                            views: "false"
                                        },
                                    }}
                                >
                                    Edit
                                </Link>
                                <Link
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2 text-center "
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
                            </div> :
                            <button
                                className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2 text-center
                                cursor-not-allowed " disabled>
                                overdue
                            </button>

                        )
                        :
                        <button
                            className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2 text-center 
                            cursor-not-allowed
                            "
                            disabled
                        >
                            unable right now
                        </button>
                )
        }
    });


    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 ">

            <div className="z-50">
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-primary flex  items-center">{">"} WorkGroup: {user.workgroup} </h1>
                    <h1 className="text-2xl font-semibold">Team: {user.team}</h1>
                </div>

                <div className="flex flex-wrap mt-9 gap-8 justify-start">
                    {cards && cards.map((card, index) => {
                        return (
                            <Card
                                key={index}
                                title={card.TITLE}
                                detail={card.DETAIL}
                                link={card.LINK}
                                logo_path={card.LOGO_PATH}
                            />
                        );
                    }
                    )}
                </div>
                <div className="flex flex-col gap-5 w-full text-sm font-thin ">
                    <TableComponent headers={jobsActiveHeader} datas={jobsActiveBody} TableName="Active Jobs" PageSize={5} />

                </div>
            </div>
        </Layout>
    );
}

export default Page;