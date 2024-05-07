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

const Page = () => {
    const [refresh, setRefresh] = useState(false);
    const [jobTemplates, setJobTemplates] = useState([]);
    const [session, setSession] = useState({});
    const [user, setUser] = useState({});
    const [userEnableFunctions, setUserEnableFunctions] = useState([]);

   
    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-12">
            <Link className="w-full shadow-xl h-12 flex flex-row gap-4 items-center font-sans font-bold text-lg pl-5 ring-1 ring-secondary hover:drop-shadow-2xl hover:shadow-2xl" 
            href="/pages/activate-remove-job">
                <KeyboardTabIcon/> Activate, or Remove Job. 
            </Link>
            <Link className="w-full shadow-xl h-12 flex flex-row gap-4 items-center font-sans font-bold text-lg pl-5 ring-1 ring-secondary hover:drop-shadow-2xl hover:shadow-2xl" 
            href="/pages/view-update-job">
                <KeyboardTabIcon/> View, or update all Jobs. 
            </Link>
        </Layout>
    );
};

export default Page;
