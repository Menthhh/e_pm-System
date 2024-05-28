"use client"
import TableComponent from "@/components/TableComponent";
import Card from "@/components/Card";
import { useState } from "react";
import Layout from "@/components/Layout";
import Link from "next/link.js";
import useFetchUsers from "@/lib/hooks/useFetchUser.js";
import useFetchCards from "@/lib/hooks/useFetchCards.js";
import useFetchJobs from "@/lib/hooks/useFetchJobs.js";
import JobsTable from "@/components/JobsTable";




const Page = () => {
    const [refresh, setRefresh] = useState(false);
    const { user, isLoading: usersloading } = useFetchUsers(refresh);
    const { cards, isLoading: cardsLoading } = useFetchCards(refresh);


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
                 <JobsTable refresh={refresh} />
                </div>
            </div>
        </Layout>
    );
}

export default Page;