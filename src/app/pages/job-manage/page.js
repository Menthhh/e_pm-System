"use client"
import Layout from "@/components/Layout.js";
import TableComponent from "@/components/TableComponent.js";
import { getSession } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { config } from "@/config/config.js";
import Link from "next/link";
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';

const jobItemTemplateHeader = ["ID", "Job Template Name", "Machine", "Create At", "Action"];

// const enabledFunction = {
//     "edit-job-template": "663313bbeccb576a719dfa9c",
//     "remove-job-template": "663313b1eccb576a719dfa9a",
// };
const jobsActiveHeader = [
    "ID",
    "Job Name",
    "Document no.",
    "Status",
    "Active",
    "Activator",
    "Action"
]

const jobsActiveBody = [
    {
        "ID": "1",
        "Job Name": "Job 1",
        "Document no.": "1234567890",
        "Status": "eqw",
        "Active": "2022-01-01",
        "Activator":"DSA",
        
    
        "Action":
            <Link
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2 text-center "
                href="#"
            >
                Views 
            </Link>
    },
]

const Page = () => {
    const [refresh, setRefresh] = useState(false);
    const [session, setSession] = useState({});
    const [user, setUser] = useState({});
    const [userEnableFunctions, setUserEnableFunctions] = useState([]);
    const [jobsActive, setJobsActive] = useState([]);

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
            await fetchJobTemplates(data.user.workgroup_id);
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-12">
            <h1 className="text-3xl font-bold text-primary flex  items-center">{">"} WorkGroup: {user.workgroup} </h1>
            <h1 className="text-2xl font-semibold">All Jobs active</h1>
            <Link className="w-full shadow-xl h-12 flex flex-row gap-4 items-center font-sans font-bold text-lg pl-5 ring-1 ring-secondary hover:drop-shadow-2xl hover:shadow-2xl"
                href="/pages/activate-remove-job">
                <KeyboardTabIcon /> Activate, or Remove Job.
            </Link>
            <div className="flex flex-col gap-5 w-full text-sm font-thin">
                <TableComponent headers={jobsActiveHeader} datas={jobsActiveBody} TableName="Active Jobs" PageSize={5} />

            </div>
        </Layout>
    );
};

export default Page;
