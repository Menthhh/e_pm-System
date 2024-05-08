"use client"
import Layout from "@/components/Layout.js";
import TableComponent from "@/components/TableComponent.js";
import { getSession } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { config } from "@/config/config.js";
import Link from "next/link";

const jobItemTemplateHeader = ["ID", "Job Template Name", "Machine", "Created At", "Action"];

const jobsActiveHeader = [
    "ID",
    "Job Name",
    "Document no.",
    "Status",
    "Active",
    "Activator"
]

const enabledFunction = {
    "activate-job-template": "66389056d81a314967236e07",
    "remove-job": "6638906bd81a314967236e09",
};

const Page = () => {
    const [refresh, setRefresh] = useState(false);
    const [jobTemplates, setJobTemplates] = useState([]);
    const [session, setSession] = useState({});
    const [user, setUser] = useState({});
    const [userEnableFunctions, setUserEnableFunctions] = useState([]);
    const [activatedJobTemplates, setActivatedJobTemplates] = useState([]);

    useEffect(() => {
        
        retrieveSession();
    }, [refresh]);

    const retrieveSession = async () => {
        const session = await getSession();
        setSession(session);
        await fetchUser(session.user_id);
    };

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
            await fetchActivatedJobTemplates(data.user.workgroup_id);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchJobTemplates = async (workgroup_id) => {
        try {
            const response = await fetch(`${config.host}/api/workgroup/get-job-templates-from-workgroup/${workgroup_id}`);
            const data = await response.json();
            if (data.status === 200) {
                setJobTemplates(data.jobTemplates);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleActivate = async (workgroup_id) => {
        try {
            const response = await fetch(`${config.host}/api/activate-jobtemplate/activate-manual`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    workgroup_id
                }),
            });
            const data = await response.json();
            if (data.status === 200) {
                setRefresh(!refresh);
            }
        } catch (error) {
            console.error(error);
        }
        
    };

    const jobItemTemplateBody = jobTemplates.map((jobTemplate, index) => {
        return {
            ID: index + 1,
            "Job Template Name": jobTemplate.JOB_TEMPLATE_NAME,
            Machine: jobTemplate.MACHINE_NAME,
            "Create At": jobTemplate.createdAt,
            Action: (
                <div className="flex gap-2 items-center justify-center">
                    <button
                        className="bg-orange-500 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
                        onClick={() => handleActivate(user.workgroup_id)}
                        disabled={!userEnableFunctions.some((action) => action._id === enabledFunction["activate-job-template"])}
                        style={{ cursor: !userEnableFunctions.some((action) => action._id === enabledFunction["activate-job-template"]) ? "not-allowed" : "pointer" }}
                    >
                        Activate
                    </button>
                </div>
            ),
        };
    });

    const fetchActivatedJobTemplates = async (workgroup_id) => {
        try {
            const response = await fetch(`${config.host}/api/activate-jobtemplate/get-activated-job-templates/${workgroup_id}`);
            const data = await response.json();
            if (data.status === 200) {
                console.log(data.jobTemplates)
                setActivatedJobTemplates(data.jobTemplates);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // const jobsActiveHeader = [
    //     "ID",
    //     "Job Name",
    //     "Document no.",
    //     "Status",
    //     "Active",
    //     "Activator",
    // ]
    // "status": 200,
	// "jobTemplates": [
	// 	{
	// 		"_id": "663b21c05e576f9c5bc6be9c",
	// 		"AUTHOR_ID": "6632fae0a67bf44b884f39be",
	// 		"JOB_TEMPLATE_NAME": "Jobtemplate#1",
	// 		"DOC_NUMBER": "1111",
	// 		"DUE_DATE": "2025-05-08T00:00:00.000Z",
	// 		"CHECKLIST_VERSION": "111",
	// 		"MACHINE_ID": "66348c2f34e30b3b56179670",
	// 		"WORKGROUP_ID": "6629f7235c49892a9ddf6b6b",
	// 		"JobTemplateCreateID": "18f56fbd8b2-d05adc210547e",
	// 		"createdAt": "2024-05-08T06:54:56.701Z",
	// 		"updatedAt": "2024-05-08T06:54:56.701Z",
	// 		"__v": 0
	// 	}
	// ]

    const jobsActiveBody = activatedJobTemplates.map((jobTemplate, index) => {
        return {
            ID: index + 1,
            "Job Name": jobTemplate.JOB_TEMPLATE_NAME,
            "Document no.": jobTemplate.DOC_NUMBER,
            "Status": jobTemplate.CHECKLIST_VERSION,
            "Active": jobTemplate.DUE_DATE,
            "Activator": jobTemplate.AUTHOR_ID,
        };
    });


    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-5">
            <h1 className="text-3xl font-bold text-primary flex  items-center">{">"} WorkGroup: {user.workgroup} </h1>
            <h1 className="text-2xl font-bold">Job Templates</h1>
            <TableComponent
                headers={jobItemTemplateHeader}
                datas={jobItemTemplateBody}
                TableName="Job Templates"
                searchColumn="Job Template Name"
                PageSize={8}
            />
            <h1 className="text-2xl font-bold">Active Jobs</h1>
            <TableComponent
                headers={jobsActiveHeader}
                datas={jobsActiveBody}
                TableName="Active Jobs"
                searchColumn="Job Name"
                PageSize={8}
            />
        </Layout>
    );
};

export default Page;
