"use client";
import Layout from "@/components/Layout.js";
import useFetchJobValue from "@/lib/hooks/useFetchJobValue";
import { useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import InfoIcon from '@mui/icons-material/Info';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { config } from "@/config/config.js";
import Swal from 'sweetalert2'
import useFetchStatus from "@/lib/hooks/useFetchStatus";
import useFetchMachines from "@/lib/hooks/useFetchMachines";
import Select from 'react-select';



const Page = () => {
    const searchParams = useSearchParams();
    const job_id = searchParams.get("job_id");
    const view = searchParams.get("view");
    const [refresh, setRefresh] = useState(false);
    const { jobData, jobItems, isLoading, error } = useFetchJobValue(job_id, refresh);
    const { machines, isLoading: machinesLoading, error: machinesError } = useFetchMachines();
    const [isShowJobInfo, setIsShowJobInfo] = useState(true);
    const [isShowJobItem, setIsShowJobItem] = useState(true);
    const [jobItemDetail, setJobItemDetail] = useState(null);
    const [testMethodDescription, setTestMethodDescription] = useState(null);
    const [AddCommentForm, setAddCommentForm,] = useState(false);
    const [commentDetail, setCommentDetail] = useState(null);
    const [inputValues, setInputValues] = useState([]);
    const { status } = useFetchStatus(refresh);
    const [machineName, setMachineName] = useState(null);

    const toggleJobInfo = () => {
        setIsShowJobInfo(!isShowJobInfo);
    }

    useEffect(() => {
        // set job status to plan using put method
        
        const updateJobStatusToPlan = async () => {
            const body = {
                STATUS_ID : "66430a7733d7f39b2f405178",
                JOB_ID : job_id
            }
            try {
                const response = await fetch(`${config.host}/api/job/update-job-status/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    console.log("Error:", response.statusText);
                }
            } catch (err) {
                console.error("Error:", err);
            }
        }
        const updateJobStatusToOngoing = async () => {
            const body = {
                STATUS_ID : "66430a5f33d7f39b2f405174",
                JOB_ID : job_id
            }
            try {
                const response = await fetch(`${config.host}/api/job/update-job-status/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    console.log("Error:", response.statusText);
                }
            } catch (err) {
                console.error("Error:", err);
            }
        }

        if(!view){
            updateJobStatusToOngoing();
        }
        else{
            updateJobStatusToPlan();
        }


    }, [inputValues]);

    const handleBeforeValue = (e, item) => {
        const value = e.target.value;
        setInputValues(prev => {
            const existingIndex = prev.findIndex(entry => entry.jobItemID === item.JobItemID);
            if (existingIndex !== -1) {
                const updatedValues = [...prev]; // Create a copy of the previous array
                updatedValues[existingIndex] = { // Update the object at existingIndex
                    ...updatedValues[existingIndex], // Preserve other properties
                    BeforeValue: value // Update the beforeValue property
                };
                return updatedValues; // Return the updated array
            }
            return [...prev, { // If the item doesn't exist, add it with the beforeValue
                ...item,
                jobItemID: item.JobItemID,
                BeforeValue: value
            }];
        });
    };

    const handleInputChange = (e, item) => {
        const value = e.target.value;
        setInputValues(prev => {
            const existingIndex = prev.findIndex(entry => entry.jobItemID === item.JobItemID);
            if (existingIndex !== -1) {
                const updatedValues = [...prev]; // Create a copy of the previous array
                updatedValues[existingIndex] = { // Update the object at existingIndex
                    ...updatedValues[existingIndex], // Preserve other properties
                    value: value // Update the value property
                };
                return updatedValues; // Return the updated array
            }
            return [...prev, { // If the item doesn't exist, add it with the value
                ...item,
                jobItemID: item.JobItemID,
                value: value
            }];
        });
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const comment = e.target.comment.value;
        setInputValues(prev => {
            const existingIndex = prev.findIndex(entry => entry.jobItemID === commentDetail.JobItemID);
            if (existingIndex !== -1) {
                const updatedValues = [...prev]; // Create a copy of the previous array
                updatedValues[existingIndex] = { // Update the object at existingIndex
                    ...updatedValues[existingIndex], // Preserve other properties
                    Comment: comment // Update the comment property
                };
                return updatedValues; // Return the updated array
            }
            return [...prev, { // If the item doesn't exist, add it with the comment
                ...commentDetail,
                jobItemID: commentDetail.JobItemID,
                Comment: comment
            }];
        });
        setAddCommentForm(false);
    };


    const toggleJobItem = () => {
        setIsShowJobItem(!isShowJobItem);
    }

    const toggleAddComment = (item) => {
        setCommentDetail(() => item);
        setAddCommentForm(!AddCommentForm);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const wdTag = e.target.wd_tag.value;
        console.log(wdTag);
        
        const body = {
            jobData: {
                JobID: jobData.JobID,
                wd_tag: wdTag,
            },
            jobItemsData: [...inputValues]
        };
       // if inputValues is empty or its length is less than jobItems length or wdTag is empty
        if (inputValues.length === 0 || inputValues.length < jobItems.length || !wdTag || inputValues.some(item => !item.value)) {
            Swal.fire({
                title: "Error!",
                text: "Please fill all the fields!",
                icon: "error"
            });
            return;
        }
        



        try {
            const response = await fetch(`${config.host}/api/job/update-job`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                console.log("Error:", response.statusText);
            }

            Swal.fire({
                title: "Good job!",
                text: "You have submit the form!",
                icon: "success"
            });


            e.target.reset();
            setRefresh((prev) => (!prev));
        } catch (err) {
            console.error("Error:", err);
        }
    };


    const handleShowTestMethodDescription = (item) => {
        setTestMethodDescription(true);
    }

    const handleShowJobItemDescription = (item) => {
        setJobItemDetail(item);
    }

    const AddCommentModal = () => {
        return (
            <div className="fixed  inset-0 overflow-y-auto z-[200]">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <form className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex flex-col gap-3 justify-start items-center  w-full"
                                    onSubmit={handleSubmitComment}
                                >
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        Add Comment to {commentDetail.JobItemTitle}
                                    </h3>
                                    <textarea className="w-full h-96 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="Add Comment"
                                        name="comment" id="comment"
                                    />

                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Submit
                                    </button>


                                </form>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={toggleAddComment}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const TestMethodDescriptionModal = () => {
        return (
            <div className="fixed inset-0 overflow-y-auto mt-5 z-[200]">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex flex-col gap-3 justify-between">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        Test Method Description
                                    </h3>

                                    <div className=" bg-gray-400 w-96 h-96 text-center self-center">
                                    </div>

                                    <div>
                                        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => setTestMethodDescription((prev) => (!prev))}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const ItemInformationModal = () => {
        return (
            <div className="fixed inset-0 overflow-y-auto z-[200]">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        Title: {jobItemDetail.JobItemTitle}
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Name: {jobItemDetail.JobItemName}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Upper Spec: {jobItemDetail.UpperSpec}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Lower Spec: {jobItemDetail.LowerSpec}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Test Method: {jobItemDetail.TestMethod}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Test Location: {jobItemDetail.TestLocationName || "N/A"}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Before Value: {jobItemDetail.BeforeValue || "N/A"}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Actual Value: {jobItemDetail.ActualValue || "N/A"}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Comment: {jobItemDetail.Comment || "N/A"}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Lastest Update: {jobItemDetail.LastestUpdate || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => setJobItemDetail(() => (null))}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleWdChange = (selectedOption) => {
        const wd_tag = selectedOption.value; // Extract value from selected option
        console.log(wd_tag);
        machines.forEach((machine) => {
            if (machine.wd_tag === wd_tag) {
                setMachineName(machine.name);
            }
        });
    };
    

    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6">
            <form className="flex flex-col gap-8"
                onSubmit={handleSubmit}
            >
                <h1 className="text-3xl font-bold text-primary flex items-center cursor-pointer" onClick={toggleJobInfo}>
                    Job Information
                    {isShowJobInfo ? <ArrowDropUpIcon className="size-14" /> : <ArrowDropDownIcon className="size-14" />}
                </h1>
                <div className={`grid grid-cols-3 ipadmini:grid-cols-4 gap-x-12 w-full gap-y-2 ${isShowJobInfo ? "" : "hidden"}`}>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Job Id</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.JobID} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Job Name</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.Name} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Document No.</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.DocumentNo} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Checklist Version</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.ChecklistVer} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Workgroup Name</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.WorkgroupName} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Activated By</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.ActivatedBy} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Timeout</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.Timeout} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Activated At</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.ActivatedAt} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Status</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.Status} disabled />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">WD Tag</label>

                       { jobData.WDtag ?
                        <Select
                            className="mb-5"
                            options={machines.map((item) => ({
                                value: item.wd_tag,
                                label: item.wd_tag
                            }))}
                            onChange={(selectedOption) => handleWdChange(selectedOption)}
                            name="wd_tag"
                            value={{ value: jobData.WDtag, label: jobData.WDtag }}
                            disabled
                        />
                        :
                        <Select
                            className="mb-5"
                            options={machines.map((item) => ({
                                value: item.wd_tag,
                                label: item.wd_tag
                            }))}
                            onChange={(selectedOption) => handleWdChange(selectedOption)}
                            name="wd_tag"
                        />
                       }


                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Machine Name</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={machineName} disabled />
                    </div>

                </div>
                <hr />
                <div className="flex flex-col gap-8">
                    <h1 className="text-3xl font-bold text-primary flex items-center cursor-pointer" onClick={toggleJobItem}>
                        Job Items Information
                        {isShowJobItem ? <ArrowDropUpIcon className="size-14" /> : <ArrowDropDownIcon className="size-14" />}
                    </h1>
                    <div className={`overflow-x-auto ${isShowJobItem ? "" : "hidden"} flex flex-col gap-5`}>
                        <table className="table-auto border-collapse w-full text-sm">
                            <thead className="text-center">
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2">Item Title </th>
                                    <th className="px-4 py-2">
                                        Test Method
                                    </th>
                                    <th className="px-4 py-2">Upper Spec</th>
                                    <th className="px-4 py-2">Lower Spec</th>
                                    <th className="px-4 py-2">Test Location</th>
                                    <th className="px-4 py-2">Before Value</th>
                                    <th className="px-4 py-2">Actual Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {jobItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 relative">
                                            <div>{item.JobItemTitle} </div>

                                            <InfoIcon
                                                className="absolute right-1 top-1 text-blue-600 size-5 cursor-pointer "
                                                onClick={() => handleShowJobItemDescription(item)}

                                            />
                                        </td>
                                        <td className="border px-4 py-2 relative">
                                            <div>{item.TestMethod} </div>

                                            <InfoIcon
                                                className="absolute right-1 top-1 text-blue-600 size-5 cursor-pointer "
                                                onClick={() => handleShowTestMethodDescription(item)}

                                            />
                                        </td>
                                        <td className="border px-4 py-2">{item.UpperSpec}</td>
                                        <td className="border px-4 py-2">{item.LowerSpec}</td>
                                        <td className="border px-4 py-2">{item.TestLocationName}</td>
                                        <td className="border px-2 py-2 relative">
                                           { item.BeforeValue ? 
                                           <input type="text" id={`before_value_${item.JobItemID}`} value={item.BeforeValue} className=" bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center w-3/4 p-1.5 cursor-not-allowed" disabled />
                                             :
                                            <input
                                                type="text"
                                                id={`before_value_${item.JobItemID}`}
                                                onChange={(e) => handleBeforeValue(e, item)}
                                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-sm ring-secondary ring-1 focus:ring-blue-500 focus:border-blue-500  w-3/4 p-1.5"
                                                placeholder="fill in value"
                                            />

                                           }

                                        </td>
                                        <td className="border px-4 py-2 relative">
                                            {
                                                item.ActualValue ?
                                                    <input type="text" id={`actual_value_${item.JobItemID}`} value={item.ActualValue} className=" bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center w-3/4 p-1.5 cursor-not-allowed" disabled />
                                                    :
                                                    <input
                                                        type="text"
                                                        id={`actual_value_${item.JobItemID}`}
                                                        onChange={(e) => handleInputChange(e, item)}
                                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-sm ring-secondary ring-1 focus:ring-blue-500 focus:border-blue-500  w-3/4 p-1.5"
                                                        placeholder="fill in value"
                                                    />
                                            }
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                        <div>
                            {view ? null :(
                                //if actua; value , wd tag, before value is exist than disable the submit button because we can't submit the form
                                jobItems.every(item => item.ActualValue && item.BeforeValue && item.BeforeValue !== "None") ?
                                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-14 py-3 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-not-allowed"
                                        disabled
                                    >
                                        Submit
                                    </button>
                                    :
                                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-14 py-3 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Submit
                                    </button>
                            )
                            }
                        </div>
                </div>

            </form>
            {jobItemDetail && <ItemInformationModal />}
            {testMethodDescription && <TestMethodDescriptionModal />}
            {AddCommentForm && <AddCommentModal />}
        </Layout>
    );
};

export default Page;
