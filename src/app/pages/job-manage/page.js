"use client"
import Layout from "@/components/Layout.js";
import { useState } from "react";
import Link from "next/link.js";
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import JobsTable from "@/components/JobsTable";
import useFetchUser from "@/lib/hooks/useFetchUser";



const Page = () => {
    const [refresh, setRefresh] = useState(false);
    const { user, isLoading: usersloading } = useFetchUser()


    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-12">
            <h1 className="text-3xl font-bold text-primary flex  items-center">{">"} WorkGroup: {user.workgroup} </h1>
            <Link className=" rounded-full bg-blue-600 text-white shadow-xl h-12 w-96 flex flex-row gap-4 items-center font-sans font-bold text-lg px-8 hover:drop-shadow-2xl hover:shadow-2xl"
                href="/pages/activate-remove-job">
                <KeyboardTabIcon /> Activate, or Remove Job.
            </Link>

            <div className="flex flex-col gap-5 w-full text-sm font-thin">
                <JobsTable refresh={refresh} />
            </div>
        </Layout>
    );
};

export default Page;
