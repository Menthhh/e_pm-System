"use client"
import Layout from "@/components/Layout.js";
import { useState } from "react";
import Link from "next/link.js";
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import JobsTable from "@/components/JobsTable";
import useFetchUser from "@/lib/hooks/useFetchUser";
import Image from "next/image";


{/* <div className="flex items-center gap-4 mb-4 p-4 bg-white ">
                    <Image src="/assets/card-logo/template.png" alt="wd logo" width={50} height={50} className="rounded-full" />
                    <h1 className="text-3xl font-bold text-slate-900">Create Checklist Template</h1>
                </div> */}
const Page = () => {
    const [refresh, setRefresh] = useState(false);
    const { user, isLoading: usersloading } = useFetchUser()


    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-12">
            <div className="flex flex-col items-start gap-4 mb-4 p-4 bg-white ">
                <div className="flex items-center gap-4">
                    <Image src="/assets/card-logo/management.png" alt="wd logo" width={50} height={50} />
                    <h1 className="text-3xl font-bold text-slate-900">Checklist management</h1>
                </div>
                <h1 className="text-sm font-bold text-secondary flex  items-center">Acitvate Checklist, plan Checklist, and remvoe Checklist </h1>
            </div>

            <Link className=" rounded-full bg-blue-600 text-white shadow-xl h-12 w-1/3  flex flex-row gap-4 items-center font-sans font-bold text-lg px-8 hover:drop-shadow-2xl hover:shadow-2xl"
                href="/pages/activate-remove-job">
                <KeyboardTabIcon /> Activate, or Remove The Checklists.
            </Link>

            <div className="flex flex-col gap-5 w-full text-sm font-thin">
                <JobsTable refresh={refresh} />
            </div>
        </Layout>
    );
};

export default Page;
