'use client'
import Layout from "@/components/Layout.js";
import TableComponent from "@/components/TableComponent.js";
import { useSearchParams } from "next/navigation";
import { config } from "@/config/config.js";
import useFetchJobItemTemplates from "@/lib/hooks/useFetchJobItemTemplates";
import useFetchUser from "@/lib/hooks/useFetchUser";
import useFetchJobTemplate from "@/lib/hooks/useFetchJobTemplate";
import useFetchTestLocations from "@/lib/hooks/useFetchTestLocations";
import Select from 'react-select';
import { useState } from "react";



const jobItemTemplateHeader = ["ID", "Title", "Name", "Upper Spec", "Lower Spec", "Test Method", "Create At", "Action"];
const enabledFunction = {
    "add-job-item-template": "6638600dd81a314967236df5",
    "remove-job-item-template": "66386025d81a314967236df7",
};

const Page = () => {
    const searchParams = useSearchParams();
    const jobTemplate_id = searchParams.get("jobTemplate_id");
    const [refresh, setRefresh] = useState(false);
    const { jobItemTemplates, isLoading: jobItemTemplatesLoading } = useFetchJobItemTemplates(jobTemplate_id, refresh);
    const { user, isLoading: userLoading } = useFetchUser(refresh);
    const { jobTemplate, isLoading: jobTemplateLoading } = useFetchJobTemplate(jobTemplate_id, refresh);
    const { locations, isLoading: locationsLoading } = useFetchTestLocations(refresh);


    const jobItemTemplateBody = jobItemTemplates.map((jobItemTemplate, index) => {
        return {
            ID: index + 1,
            Title: jobItemTemplate.JOB_ITEM_TEMPLATE_TITLE,
            Name: jobItemTemplate.JOB_ITEM_TEMPLATE_NAME,
            Upper_Spec: jobItemTemplate.UPPER_SPEC,
            Lower_Spec: jobItemTemplate.LOWER_SPEC,
            Test_Method: jobItemTemplate.TEST_METHOD,
            "Create At": jobItemTemplate.createdAt,
            Action: (
                <div className="flex items-center justify-center gap-2">
                    <button
                        className={`text-white font-bold rounded-lg text-sm px-5 py-2.5 text-center 
                            ${user && user.actions && !user.actions.some(action => action._id === enabledFunction["remove-job-item-template"]) ?
                                'bg-red-500 cursor-not-allowed' :
                                'bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'}`}
                        onClick={() => handleRemove(jobItemTemplate._id)}
                        disabled={!user || !user.actions || !user.actions.some(action => action._id === enabledFunction["remove-job-item-template"])}
                    >
                        Remove
                    </button>

                </div>
            ),
        };
    });

    const HandleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = {
            AUTHOR_ID: user._id,
            JOB_ITEM_TEMPLATE_TITLE: form.get("job_item_template_title"),
            JOB_ITEM_TEMPLATE_NAME: form.get("job_item_template_name"),
            UPPER_SPEC: form.get("upper_spec"),
            LOWER_SPEC: form.get("lower_spec"),
            TEST_METHOD: form.get("test_method"),
            JOB_TEMPLATE_ID: jobTemplate_id,
            JobTemplateCreateID: jobTemplate.JobTemplateCreateID,
            TEST_LOCATION_ID: form.get("test_location"),
        };
        console.log(data)
        try {
            const response = await fetch(`${config.host}/api/job-item-template/create-job-item-template`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();
            if (res.status === 200) {
                setRefresh((prev) => !prev);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleRemove = async (jobItemTemplate_id) => {
        
        try {
            const response = await fetch(`${config.host}/api/job-item-template/remove-job-item-template`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ jobItemTemplate_id }),
            });
            const data = await response.json();
            if (data.status === 200) {
                setRefresh((prev) => !prev);
            }
        } catch (err) {
            console.log(err);
        }
    }

    console.log(locations)
    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-7">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold text-primary flex  items-center">{">"} {jobTemplate.JOB_TEMPLATE_NAME} </h1>
                <h1 className="text-1xl font-semibold">Add Item to Job Template</h1>
            </div>
            <form onSubmit={HandleSubmit}>
                <div className="grid gap-6 mb-6 md:grid-cols-3">
                    <div>
                        <label
                            for="author"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Author
                        </label>
                        <input
                            type="text"
                            id="author"
                            className="bg-gray-200 border cursor-not-allowed border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 opacity-50  "
                            value={user.name || ""}
                            disabled
                            name="author"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="job_item_template_title"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Job Item Template Title
                        </label>
                        <input
                            type="text"
                            id="job_item_template_title"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="title"
                            name="job_item_template_title"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="job_item_template_name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Job Item Template Name
                        </label>
                        <input
                            type="text"
                            id="job_item_template_name"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="1234"
                            name="job_item_template_name"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="Upper_Spec"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Upper Spec
                        </label>
                        <input
                            type="text"
                            id="upper_spec"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="321"
                            name="upper_spec"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="lower_spec"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Lower Spec
                        </label>
                        <input
                            type="text"
                            id="lower_spec"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="1234"
                            name="lower_spec"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="test_method"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Test Method
                        </label>
                        <input
                            type="text"
                            id="test_method"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="test method"
                            name="test_method"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="test_method"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Test location
                        </label>
                        <Select name="test_location" id="test_location" className=" text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full "
                            options={
                                locations.map(location => {
                                    return {
                                        value: location._id,
                                        label: location.LocationName
                                    }
                                })
                            }
                            isSearchable={true}

                        />
                            
        

                    </div>

                </div>
                <button
                    type="submit"
                    className={`text-white font-bold rounded-lg text-sm px-5 py-2.5 text-center 
                    ${user && user.actions && !user.actions.some(action => action._id === enabledFunction["add-job-item-template"]) ?
                            'bg-blue-500 cursor-not-allowed' :
                            'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'}`}
                    disabled={!user || !user.actions || !user.actions.some(action => action._id === enabledFunction["add-job-item-template"])}
                >
                    Add Job Item Template
                </button>

            </form>

            <TableComponent
                headers={jobItemTemplateHeader}
                datas={jobItemTemplateBody}
                TableName={"Job Item Templates"}
                searchColumn={"Title"}
            />

        </Layout>

    );
};

export default Page;