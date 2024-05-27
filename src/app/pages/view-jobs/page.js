"use client";
import Layout from "@/components/Layout.js";
import useFetchJobValue from "@/lib/hooks/useFetchJobValue";
import { useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { config } from "@/config/config.js";
import Swal from 'sweetalert2'
import useFetchStatus from "@/lib/hooks/useFetchStatus";
import useFetchMachines from "@/lib/hooks/useFetchMachines";
import TestMethodDescriptionModal from "@/components/TestMethodDescriptionModal";
import ItemInformationModal from "@/components/ItemInformationModal";
import AddCommentModal from "@/components/AddCommentModal";
import JobForm from "@/components/JobForm";



const Page = () => {
    const searchParams = useSearchParams();
    const job_id = searchParams.get("job_id");
    const view = searchParams.get("views");
    const [refresh, setRefresh] = useState(false);
    const { jobData, jobItems, isLoading, error } = useFetchJobValue(job_id, refresh);
    const { machines, isLoading: machinesLoading, error: machinesError } = useFetchMachines();
    const [isShowJobInfo, setIsShowJobInfo] = useState(false);
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
        const updateJobStatusToOngoing = async () => {
            const body = {
                JOB_ID: job_id
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


        if (view === "false") {
            updateJobStatusToOngoing();
        }

        console.log("views" + view);

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
            <JobForm
                jobData={jobData}
                jobItems={jobItems}
                machines={machines}
                machineName={machineName}
                handleInputChange={handleInputChange}
                handleBeforeValue={handleBeforeValue}
                handleWdChange={handleWdChange}
                handleSubmit={handleSubmit}
                handleShowJobItemDescription={handleShowJobItemDescription}
                handleShowTestMethodDescription={handleShowTestMethodDescription}
                toggleJobItem={toggleJobItem}
                isShowJobItem={isShowJobItem}
                toggleJobInfo={toggleJobInfo}
                isShowJobInfo={isShowJobInfo}
                view={view}
                toggleAddComment={toggleAddComment}
            />
            {jobItemDetail && <ItemInformationModal
                jobItemDetail={jobItemDetail}
                setJobItemDetail={setJobItemDetail}
            />}
            {testMethodDescription && <TestMethodDescriptionModal
                setTestMethodDescription={setTestMethodDescription} />}
            {AddCommentForm && <AddCommentModal
                toggleAddComment={toggleAddComment}
                handleSubmitComment={handleSubmitComment}
                commentDetail={commentDetail}

            />}
        </Layout>
    );
};

export default Page;
