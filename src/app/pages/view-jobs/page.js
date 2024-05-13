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



const Page = () => {
    const searchParams = useSearchParams();
    const job_id = searchParams.get("job_id");
    const [refresh, setRefresh] = useState(false);
    const { jobData, jobItems, isLoading, error } = useFetchJobValue(job_id, refresh);
    const [isShowJobInfo, setIsShowJobInfo] = useState(true);
    const [isShowJobItem, setIsShowJobItem] = useState(true);
    const [jobItemDetail, setJobItemDetail] = useState(null);
    const [testMethodDescription, setTestMethodDescription] = useState(null);
    const [AddCommentForm, setAddCommentForm,] = useState(false);
    const [commentDetail, setCommentDetail] = useState(null);
    const [inputValues, setInputValues] = useState([]);
    const { status } = useFetchStatus(refresh);


    console.log(status)
    const toggleJobInfo = () => {
        setIsShowJobInfo(!isShowJobInfo);
    }

    useEffect(() => {
        console.log(inputValues);
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
        console.log(comment);
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
        
        const body = {
            jobData: {
                JobID: jobData.JobID,
                timeout: e.target.timeout.value,
                status: e.target.status.value
            },
            jobItemsData: [...inputValues]
        };


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
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Machine Name</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.MachineName} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">WD Tag</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.WDtag} disabled />
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
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Activated At</label>
                        <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.ActivatedAt} disabled />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Status</label>
                        {/* <input type="text" className="mb-5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder=""
                            name="status"
                        /> */}

                        <select className="mb-5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            name="status"
                        >
                            {status.map((item, index) => (
                                <option key={index} value={item._id}>{item.status_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="text-input" className="text-md font-bold text-gray-600">Timeout</label>
                        <input type="text" className="mb-5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder=""
                            name="timeout"
                        />
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
                                        <td className="border px-4 py-2 relative">
                                            <div>
                                                <input
                                                    type="text"
                                                    id={`beforeValue_${item.JobItemID}`}
                                                    value={inputValues.find(entry => entry.jobItemID === item.JobItemID)?.BeforeValue || ''}
                                                    onChange={(e) => handleBeforeValue(e, item)}
                                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-sm ring-secondary ring-1 focus:ring-blue-500 focus:border-blue-500  w-3/4 p-1.5"
                                                    placeholder="fill in value"
                                                />
                                            </div>

                                        </td>
                                        <td className="border px-4 py-2 relative">
                                            <div>
                                                <input
                                                    type="text"
                                                    id={`value_${item.JobItemID}`}
                                                    value={inputValues.find(entry => entry.jobItemID === item.JobItemID)?.value || ''}
                                                    onChange={(e) => handleInputChange(e, item)}
                                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-sm ring-secondary ring-1 focus:ring-blue-500 focus:border-blue-500  w-3/4 p-1.5"
                                                    placeholder="fill in value"
                                                />
                                            </div>
                                            <AddCommentIcon
                                                className="absolute right-1 top-1 text-blue-600 size-5 cursor-pointer "
                                                onClick={() => toggleAddComment(item)}

                                            />
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary w-1/3">Submit</button>
                        </div>
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
