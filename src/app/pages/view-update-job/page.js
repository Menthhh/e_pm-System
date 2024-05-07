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
           
        </Layout>
    );
};

export default Page;
