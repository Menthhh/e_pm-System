"use client"
import TableComponent from "@/components/TableComponent";
import { config } from "../../../config/config.js";

import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/utils/utils";
import Layout from "@/components/Layout";
import Link from "next/link.js";




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
    const [cards, setCards] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [session, setSession] = useState({});
    const [user, setUser] = useState({});
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchSession();
    }, [refresh]);


    const fetchSession = async () => {
        const session = await getSession();
        setSession(session);
        await fetchCard(session.user_id);
        await fetchUser(session.user_id);
    };

    const fetchUser = async (user_id) => {
        try {
            const response = await fetch(
                `${config.host}/api/user/get-user/${user_id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch roles");
            }
            const data = await response.json();
            setUser(data.user);
            await fetchJobs(data.user.workgroup_id);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCard = async (user_id) => {
        try {
            const response = await fetch(
                `${config.host}/api/user/get-card-from-user/${user_id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch roles");
            }
            const data = await response.json();
            setCards(data.cards);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchJobs = async (workgroup_id) => {
        try {

            const response = await fetch(`${config.host}/api/job/get-jobs-from-workgroup/${workgroup_id}`);
            const data = await response.json();
            if (data.status === 200) {

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
            "Status": job.STATUS ? job.STATUS : "pending",
            "Active": job.createdAt ? new Date(job.createdAt).toLocaleString() : "Not Active",
            "Activator": job.ACTIVATER_NAME,
            "Action":
                <Link
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2 text-center "
                    href="#"
                >
                    Views
                </Link>
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
                    {cards.map((card, index) => {
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
                <div className="flex flex-col gap-5 w-full text-sm font-thin">
                    <TableComponent headers={jobsActiveHeader} datas={jobsActiveBody} TableName="Active Jobs" PageSize={5} />

                </div>
            </div>
        </Layout>
    );
}

export default Page;