"use client";

import Layout from "@/components/Layout.js";
import Select from "react-select";
import TableComponent from "@/components/TableComponent.js";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import Link from "next/link";
import { useEffect, useState } from "react";
import useFetchUser from "@/lib/hooks/useFetchUser.js";
import useFetchJobTemplate from "@/lib/hooks/useFetchJobTemplate.js";
import useFetchUsers from "@/lib/hooks/useFetchUsers.js";
import Swal from 'sweetalert2';
import { config } from "@/config/config.js";

const approverHeader = ["ID", "Name", "Action"]

const Page = ({ searchParams }) => {
    const jobTemplate_id = searchParams.jobTemplate_id
    const [selectedApprover, setSelectedApprover] = useState(null);
    const [options, setOptions] = useState([]);
    const [dueDate, setDueDate] = useState("");
    const [refresh, setRefresh] = useState(false);
    const { user, isLoading: isUserLoading, error: userError } = useFetchUser(refresh);
    const { jobTemplate, isLoading: isJobTemplateLoading, error: jobTemplateError } = useFetchJobTemplate(jobTemplate_id, refresh);
    const { users, isLoading: isUsersLoading, error: usersError } = useFetchUsers(refresh);
    const [approvers, setApprovers] = useState([]);

    useEffect(() => {
        calculateDueDate();
        //user must not be SuperAdmin


        setOptions(users
            .filter((user) => user.name !== "SuperAdmin")
            .map((user) => ({ value: user._id, label: user.name })));

    }, [refresh, users]);


    useEffect(() => {
        setApprovers(jobTemplate.ApproverList);
    }, [jobTemplate.ApproverList]);

    const handleAddApprover = () => {
        if (!selectedApprover) {
            Swal.fire(
                'Oops...',
                'Please select an approver!',
                'error'
            );
            return;
        }

        const newApprover = {
            _id: selectedApprover.value,
            EMP_NAME: selectedApprover.label,
        };

        setApprovers((prevApprovers) => [...prevApprovers, newApprover]);
        setSelectedApprover(null);

        const newOptions = options.filter(option => option.value !== selectedApprover.value);
        setOptions(newOptions);
    };

    const handleRemoveApprover = (userId) => {
        setApprovers(approvers.filter((approver) => approver._id !== userId));
        const removedApprover = users.find((user) => user._id === userId);
        const newOptions = [
            ...options,
            { value: removedApprover._id, label: removedApprover.name },
        ];
        setOptions(newOptions);
    };

    const dataApprover = approvers?.map((approver, index) => {
        return {
            ID: index + 1,
            Name: approver.EMP_NAME,
            Action: (
                <button
                    onClick={() => handleRemoveApprover(approver._id)}
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                    Remove
                </button>
            ),
        };
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const jobTemplateID = jobTemplate_id
        const author = user._id;
        const workgroup = user.workgroup_id;
        const due_date = formData.get("due_date");
        const job_template_name = formData.get("job_template_name");
        const doc_num = formData.get("doc_num");
        const checklist_ver = formData.get("checklist_ver");
        const timeout = formData.get("timeout");
        const approvers_id = approvers.map((approver) => approver._id);

        const data = {
            jobTemplateID,
            author,
            workgroup,
            due_date,
            job_template_name,
            doc_num,
            checklist_ver,
            timeout,
            approvers_id,
        };

        try {
            const res = await fetch(`/api/job-template/edit-job-template`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                next: { revalidate: 10 },
            });
            const response = await res.json();
            if (response.status === 500) {
                console.error(response.error);
            } else {
                Swal.fire({
                    title: "Good job!",
                    text: "You have successfully edited a Checklist template!",
                    icon: "success"
                });
                e.target.reset();
                setApprovers([]);
                setRefresh((prev) => !prev);
            }
        } catch (error) {
            Swal.fire({
                title: "Oops...",
                text: error.message,
                icon: "error"
            });

        }
    };


    const calculateDueDate = () => {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        const formattedDate = currentDate.toISOString().split("T")[0];
        setDueDate(formattedDate);
    };
    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-5">
            <h1 className="text-2xl font-bold">Edit Checklist Template</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 md:grid-cols-3">
                    <div>
                        <label
                            for="author"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Author
                        </label>
                        <input
                            type="text"
                            id="author"
                            className="bg-gray-200 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 opacity-50 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.name}
                            name="author"
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label
                            for="workgroup"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Workgroup
                        </label>
                        <input
                            type="text"
                            id="workgroup"
                            className="bg-gray-200 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 opacity-50 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.workgroup}
                            name="workgroup"
                            required
                            disabled
                        />
                    </div>

                    <div>
                        <label
                            for="due_date"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="due_date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            name="due_date"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="job_template_name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Checklist Template Name
                        </label>
                        <input
                            type="text"
                            id="job_template_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            defaultValue={jobTemplate.JOB_TEMPLATE_NAME}
                            name="job_template_name"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="doc_num"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Document no.
                        </label>
                        <input
                            type="text"
                            id="doc_num"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            name="doc_num"
                            defaultValue={jobTemplate.DOC_NUMBER}
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="checklist_ver"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Checklist Version
                        </label>
                        <input
                            type="text"
                            id="checklist_ver"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            name="checklist_ver"
                            defaultValue={jobTemplate.CHECKLIST_VERSION}
                            required
                        />
                    </div>
                    <div className="z-50">
                        <label
                            for="timeout"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Timeout
                        </label>
                        <Select
                            options={[
                                { value: "12 hrs", label: "12 hrs" },
                                { value: "1 days", label: "1 days" },
                                { value: "7 days", label: "7 days" },
                                { value: "15 days", label: "15 days" },
                                { value: "30 days", label: "30 days" },
                                { value: "3 months", label: "3 months" },
                                { value: "6 months", label: "6 months" },
                                { value: "12 months", label: "12 months" },
                            ]}
                            isSearchable={true}
                            name="timeout"
                            defaultValue={{ value: jobTemplate.TIMEOUT, label: jobTemplate.TIMEOUT }} // Set default value here
                            onChange={(selectedOption) => console.log('Selected:', selectedOption)}
                        />

                    </div>
                    <div className="flex gap-5 ">
                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="visitors"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Add Approver
                            </label>
                            <Select
                                options={options}
                                value={selectedApprover}
                                onChange={setSelectedApprover}
                                isSearchable={true}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddApprover}
                            className="text-white translate-y-6 bg-green-700 hover:bg-green-800 focus:ring-4 font-bold focus:outline-none w-5 focus:ring-green-300 rounded-lg text-sm sm:w-auto px-5 py-1 h-10 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Add
                        </button>
                    </div>
                </div>


                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
                >
                    Save
                </button>


            </form>
            <TableComponent
                headers={approverHeader}
                datas={dataApprover}
                TableName="Approver List"
            />

        </Layout>
    );
};

export default Page;

