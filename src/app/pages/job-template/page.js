'use client'

import Layout from "@/components/Layout.js";
import Select from 'react-select';
import TableComponent from "@/components/TableComponent.js";
import NextPlanIcon from '@mui/icons-material/NextPlan';
import Link from "next/link";
import { useEffect, useState } from "react";
import { config } from "../../../config/config.js";

const approverHeader = ["ID", "Name", "Action"];

const Page = () => {
    const [approvers, setApprovers] = useState([]);
    const [selectedApprover, setSelectedApprover] = useState(null); // Updated state to hold only one selected approver
    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState([]);
    const [dueDate, setDueDate] = useState(""); // State to hold due date


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${config.host}/api/user/get-users`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setUsers(data.users);
            const userOptions = data.users.map(user => ({
                value: user._id,
                label: user.name
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
                name: selectedApprover.label
            };
            setApprovers(prevApprovers => [...prevApprovers, newApprover]);
            setSelectedApprover(null); 
        }

    };

    const handleRemoveApprover = (userId) => {
        setApprovers(approvers.filter(approver => approver.user_id !== userId));
    };

    const dataApprover = approvers.map((approver, index) => {
        return {
            ID: index + 1,
            Name: approver.name,
            Action: <button onClick={() => handleRemoveApprover(approver.user_id)} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Remove</button>
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(approvers)
    };

    const calculateDueDate = () => {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        const formattedDate = currentDate.toISOString().split('T')[0];
        setDueDate(formattedDate);
    };

    useEffect(() => {
        // Calculate due date when component mounts
        calculateDueDate();
    }, []);

    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-5">
            <h1 className="text-2xl font-bold">Job Template</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 md:grid-cols-3">
                    <div>
                        <label for="author" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Author</label>
                        <input type="text" id="author" class="bg-gray-200 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 opacity-50 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required disabled />
                    </div>
                    <div>
                        <label for="workgroup" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Workgroup</label>
                        <input type="text" id="workgroup" class="bg-gray-200 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 opacity-50 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required disabled />
                    </div>

                    <div>
                        <label for="due_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Due Date</label>
                        <input type="date" id="due_date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
                    </div>
                    <div>
                        <label for="job_template_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Template Name</label>
                        <input type="text" id="job_template_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Template Name" required />
                    </div>
                    <div>
                        <label for="doc_num" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Document no.</label>
                        <input type="text" id="doc_num" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" required />
                    </div>
                    <div>
                        <label for="checklist_ver" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Checklist Version</label>
                        <input type="text" id="checklist_ver" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="flowbite.com" required />
                    </div>
                    <div>
                        <label for="visitors" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Test on Machine Name</label>
                        <Select options={options} />
                    </div>
                    <div className="flex gap-5">
                        <div className="flex flex-col w-full">
                            <label htmlFor="visitors" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add Approver</label>
                            <Select options={options} value={selectedApprover} onChange={setSelectedApprover} isSearchable={true} className="z-50" />
                        </div>
                        <button type="button" onClick={handleAddApprover} className="text-white translate-y-6 bg-green-700 hover:bg-green-800 focus:ring-4 font-bold focus:outline-none w-5 focus:ring-green-300 rounded-lg text-sm sm:w-auto px-5 py-1 h-10 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add</button>
                    </div>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</button>
            </form>
            <TableComponent headers={approverHeader} datas={dataApprover} TableName="Approver List" />
            <Link href="/pages/job-item-template" className="align-left text-white bg-yellow-700 hover:bg-yellow-800 w-60 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                <div className="flex gap-3 items-center">
                    <p>View all Job Templates</p>
                    <NextPlanIcon />
                </div>
            </Link>
        </Layout>
    );
};

export default Page;
// onChange={(selectedOption) => handleAddApprover(selectedOption.value, selectedOption.label)}