'use client'
import Card from "@/components/Card";
import { useState } from "react";
import Layout from "@/components/Layout";
import useFetchUsers from "@/lib/hooks/useFetchUser.js";
import useFetchCards from "@/lib/hooks/useFetchCards.js";
import useFetchJobs from "@/lib/hooks/useFetchJobs.js";
import JobsTable from "@/components/JobsTable";


const Page = () => {
    const [refresh, setRefresh] = useState(false);
    const { user, isLoading: usersloading } = useFetchUsers(refresh);
    const { cards, isLoading: cardsLoading } = useFetchCards(refresh);
    const { jobs, isLoading: jobsLoading } = useFetchJobs(refresh);

    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 ">

            <div className="z-50">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <img src="/assets/card-logo/dashboard.png" alt="wd logo" width={50} height={50} />
                        <h1 className="text-3xl font-bold text-slate-900"> Home </h1>
                        
                    </div>
                 <h1 className="text-sm font-bold text-secondary flex  items-center">Welcome to the e - PM System</h1>
                
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
                <hr className="border-gray-300 mt-10" />
                <div className="flex flex-col gap-5 w-full text-sm font-thin ">
                    <JobsTable refresh={refresh} />
                </div>
            </div>
        </Layout>
    );
}

export default Page;