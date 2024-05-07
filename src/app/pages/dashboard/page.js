"use client"
import TableComponent from "@/components/TableComponent";
import {config} from "../../../config/config.js";

import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/utils/utils";
import Layout from "@/components/Layout";




const headers = ["ID", "Role", "Action"];
const body = [
    {
        "id": 1,
        "Role": "Admin",
        "Action": "Edit"
    },
    {
        "id": 1,
        "Role": "Admin",
        "Action": "Edit"
    },
    {
        "id": 1,
        "Role": "Admin",
        "Action": "Edit"
    },
    {
        "id": 1,
        "Role": "Admin",
        "Action": "Edit"
    },
]

const Page = () => {
    const [cards, setCards] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [session, setSession] = useState({});
    const [user, setUser] = useState({});

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
                    <div>
                        <TableComponent
                            headers={headers}
                            datas={body}
                            searchColumn={"Role"}
                            
                        />
                    </div>
                </div>
        </Layout>
    );
}

export default Page;