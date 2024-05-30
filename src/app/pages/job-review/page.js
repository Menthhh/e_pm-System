"use client";
import Layout from "@/components/Layout.js";
import useFetchJobValue from "@/lib/hooks/useFetchJobValue";
import React, { useEffect, useState } from "react";
import { config } from "@/config/config.js";
import Swal from 'sweetalert2'
import useFetchStatus from "@/lib/hooks/useFetchStatus";
import useFetchMachines from "@/lib/hooks/useFetchMachines";
import TestMethodDescriptionModal from "@/components/TestMethodDescriptionModal";
import ItemInformationModal from "@/components/ItemInformationModal";
import AddCommentModal from "@/components/AddCommentModal";
import JobReview from "@/components/JobReview";



const Page = ({ searchParams }) => {
    const job_id = searchParams.job_id
    const view = "true"
    const [refresh, setRefresh] = useState(false);
    const { jobData, jobItems, isLoading, error } = useFetchJobValue(job_id, refresh);
    const [isShowJobInfo, setIsShowJobInfo] = useState(true);
    const [isShowJobItem, setIsShowJobItem] = useState(true);
    const [jobItemDetail, setJobItemDetail] = useState(null);
    const [testMethodDescription, setTestMethodDescription] = useState(null);
    const [AddCommentForm, setAddCommentForm,] = useState(false);
    const [commentDetail, setCommentDetail] = useState(null);


    const toggleJobInfo = () => {
        setIsShowJobInfo(!isShowJobInfo);
    }


    const toggleJobItem = () => {
        setIsShowJobItem(!isShowJobItem);
    }

    const toggleAddComment = (item) => {
        setCommentDetail(() => item);
        setAddCommentForm(!AddCommentForm);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(event.target);
        const action = formData.get('action');

        if (action === 'approve') {

            console.log('Approved');
        } else if (action === 'disapprove') {
            toggleAddComment();
        }

    };


    const handleShowTestMethodDescription = (item) => {
        setTestMethodDescription(true);
    }

    const handleShowJobItemDescription = (item) => {
        setJobItemDetail(item);
    }

    const handleSubmitComment = async (e) => {
    }


    return (

        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6">
            <JobReview
                jobData={jobData}
                jobItems={jobItems}
                handleSubmit={handleSubmit}
                handleShowJobItemDescription={handleShowJobItemDescription}
                handleShowTestMethodDescription={handleShowTestMethodDescription}
                toggleJobItem={toggleJobItem}
                isShowJobItem={isShowJobItem}
                toggleJobInfo={toggleJobInfo}
                isShowJobInfo={isShowJobInfo}
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
