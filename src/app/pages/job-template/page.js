"use client";

import Layout from "@/components/Layout.js";
import Select from "react-select";
import TableComponent from "@/components/TableComponent.js";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import Link from "next/link";
import { useEffect, useState } from "react";
import { config } from "../../../config/config.js";
import { getSession } from "@/lib/utils/utils.js";
import Swal from "sweetalert2";

const enabledFunction = {
    "create-job-template": "6632f9e4eccb576a719dfa7a",
    "view-all-job-templates": "663845e3d81a314967236de6",
}

const approverHeader = ["ID", "Name", "Action"];

const Page = () => {
    const [approvers, setApprovers] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [selectedApprover, setSelectedApprover] = useState(null);
    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState([]);
    const [dueDate, setDueDate] = useState("");
    const [user, setUser] = useState({});
    const [machinesOptions, setMachinesOptions] = useState([]);
    const [userEnableFunctions, setUserEnableFunctions] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        retreiveSession();
        calculateDueDate();
        fetchUsers();
        fetchMachines();
    }, [refresh]);

    const retreiveSession = async () => {
        try {
            const session = await getSession();
            await fetchUser(session.user_id);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchMachines = async () => {
        try {
            const response = await fetch(`${config.host}/api/machine/get-machines`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            const machineOptions = data.machines.map((machine) => ({
                value: machine._id,
                label: machine.name,
            }));
            setMachinesOptions(machineOptions);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchUser = async (userId) => {
        try {
            const response = await fetch(
                `${config.host}/api/user/get-user/${userId}`
            );
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setUser(() => data.user);
            setUserEnableFunctions(() => data.user.actions);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${config.host}/api/user/get-users`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setUsers(data.users);
            const userOptions = data.users.map((user) => ({
                value: user._id,
                label: user.name,
            }));
            setOptions(userOptions);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddApprover = () => {
        if (selectedApprover) {
            const newApprover = {
                user_id: selectedApprover.value,
                name: selectedApprover.label,
            };
            setApprovers((prevApprovers) => [...prevApprovers, newApprover]);
            setSelectedApprover(null);
        }
        const newOptions = options.filter(
            (option) => option.value !== selectedApprover.value
        );
        setOptions(newOptions);
    };

    const handleRemoveApprover = (userId) => {
        setApprovers(approvers.filter((approver) => approver.user_id !== userId));
        const removedApprover = users.find((user) => user._id === userId);
        const newOptions = [
            ...options,
            { value: removedApprover._id, label: removedApprover.name },
        ];
        setOptions(newOptions);
    };

    const dataApprover = approvers.map((approver, index) => {
        return {
            ID: index + 1,
            Name: approver.name,
            Action: (
                <button
                    onClick={() => handleRemoveApprover(approver.user_id)}
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
        const AUTHOR_ID = user._id;
        const JOB_TEMPLATE_NAME = formData.get("job_template_name");
        const DOC_NUMBER = formData.get("doc_num");
        const DUE_DATE = formData.get("due_date");
        const CHECKLIST_VERSION = formData.get("checklist_ver");
        const TIMEOUT = formData.get("timeout");
        const WORKGROUP_ID = user.workgroup_id;
        const APPROVERS_ID = approvers.map((approver) => approver.user_id);
        const data = {
            AUTHOR_ID,
            JOB_TEMPLATE_NAME,
            DOC_NUMBER,
            DUE_DATE,
            CHECKLIST_VERSION,
            TIMEOUT,
            WORKGROUP_ID,
            APPROVERS_ID,
        };

        try {
            const res = await fetch(`${config.host}/api/job-template/create-job-template`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const response = await res.json();
            if (response.status === 500) {
                console.error(response.error);
            } else {
                Swal.fire({
                    title: "Good job!",
                    text: "You have successfully created a job template!",
                    icon: "success"
                });
                e.target.reset();
                setApprovers([]);
                setDueDate("");
                setSelectedMachine(null);
                setSelectedApprover(null);
                setOptions([]);
                setRefresh((prev) => !prev);
            }
        } catch (error) {
            console.error("Error creating job template:", error);
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
            <h1 className="text-2xl font-bold">Job Template</h1>
            <Link
                href="/pages/job-item-template"
                className={`align-left text-white bg-blue-600 hover:bg-blue-800 w-60 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center
                ${!userEnableFunctions.some(
                    action => action._id === enabledFunction["view-all-job-templates"]
                ) && "opacity-50 cursor-not-allowed"
                    }`}
            >
                <div className="flex gap-3 items-center">
                    <p>View all Job Templates</p>
                    <NextPlanIcon />
                </div>
            </Link>
            <form onSubmit={handleSubmit}>
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
                            class="bg-gray-200 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 opacity-50 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.name}
                            name="author"
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label
                            for="workgroup"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Workgroup
                        </label>
                        <input
                            type="text"
                            id="workgroup"
                            class="bg-gray-200 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 opacity-50 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user.workgroup}
                            name="workgroup"
                            required
                            disabled
                        />
                    </div>

                    <div>
                        <label
                            for="due_date"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="due_date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            name="due_date"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="job_template_name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Job Template Name
                        </label>
                        <input
                            type="text"
                            id="job_template_name"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Template Name"
                            name="job_template_name"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="doc_num"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Document no.
                        </label>
                        <input
                            type="text"
                            id="doc_num"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="1234"
                            name="doc_num"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="checklist_ver"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Checklist Version
                        </label>
                        <input
                            type="text"
                            id="checklist_ver"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="1234"
                            name="checklist_ver"
                            required
                        />
                    </div>
                    <div className="z-50">
                        <label
                            for="timeout"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Timeout
                        </label>
                        <Select
                            options={
                                [
                                    { value: "12 hrs", label: "12 hrs" },
                                    { value: "1 days", label: "1 days" },
                                    { value: "7 days", label: "7 days" },
                                    { value: "15 days", label: "15 days" },
                                    { value: "30 days", label: "30 days" },
                                    { value: "3 mounths", label: "3 mounths" },
                                    { value: "6 months", label: "6 months" },
                                    { value: "12 months", label: "12 months" },
                                   
                                ]
                            }
                            isSearchable={true}
                            name="timeout"
                        
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
                                className="z-50"
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
                {
                    // check if user has permission to create job template
                    userEnableFunctions.some(action => action._id === enabledFunction["create-job-template"]) ? (
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Create Job Template
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-not-allowed"
                            disabled
                        >
                            Create Job Template
                        </button>
                    )
                }
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

