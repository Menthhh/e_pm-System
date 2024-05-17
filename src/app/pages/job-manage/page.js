"use client"
import Layout from "@/components/Layout.js";
import TableComponent from "@/components/TableComponent.js";
import { getSession } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { config } from "@/config/config.js";
import Link from "next/link";
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import { AnimatedComponent, Typewriter } from "react-style-text";

const jobItemTemplateHeader = ["ID", "Job Template Name", "Machine", "Create At", "Action"];


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
    const [session, setSession] = useState({});
    const [user, setUser] = useState({});
    const [userEnableFunctions, setUserEnableFunctions] = useState([]);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        retrieveSession();
    }, [refresh]);

    const retrieveSession = async () => {
        const session = await getSession();
        setSession(session);

        await fetchUser(session.user_id);


    }

    const fetchUser = async (user_id) => {
        try {
            const response = await fetch(`${config.host}/api/user/get-user/${user_id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await response.json();
            setUser(data.user);
            setUserEnableFunctions(data.user.actions);
            await fetchJobs(data.user.workgroup_id);

        } catch (error) {
            console.error(error);
        }
    }

    const fetchJobs = async (workgroup_id) => {
        try {

            const response = await fetch(`${config.host}/api/job/get-jobs-from-workgroup/${workgroup_id}`);
            const data = await response.json();
            if (data.status === 200) {
                console.log(data.jobs)

                setJobs(data.jobs);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const jobsActiveBody = jobs.map((job, index) => {
        return {
            "ID": index + 1,
            "Job Name": job.JOB_NAME,
            "Document no.": job.DOC_NUMBER,
            "Status": <div
                style={{ backgroundColor: job.STATUS_COLOR }}
                className="px-1 py-1 rounded-full text-black font-semibold shadow-xl"
            >
                {job.STATUS_NAME ? job.STATUS_NAME : "pending"}
            </div>
            ,
            "Active": job.createdAt ? new Date(job.createdAt).toLocaleString() : "Not Active",
            "Activator": job.ACTIVATER_NAME,
            "Action":
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
                </div>
        }
    });



    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-12">
            <h1 className="text-3xl font-bold text-primary flex  items-center">{">"} WorkGroup: {user.workgroup} </h1>
            <h1 className="text-2xl font-semibold">All Active Jobs</h1>
            <div className="flex flex-col gap-5 w-full text-sm font-thin">
                <TableComponent headers={jobsActiveHeader} datas={jobsActiveBody} TableName="Active Jobs" PageSize={5} />
            </div>
            <Link className="absolute rounded-full bg-[#F7DC6F] self-end shadow-xl h-12 w-96 flex flex-row gap-4 items-center font-sans font-bold text-lg px-8 ring-1 ring-secondary hover:drop-shadow-2xl hover:shadow-2xl"
                href="/pages/activate-remove-job">
                <KeyboardTabIcon /> Activate, or Remove Job.
            </Link>
        </Layout>
    );
};

export default Page;
