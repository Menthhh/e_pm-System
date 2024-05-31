"use client";
import Layout from "@/components/Layout.js";
import useFetchJobValue from "@/lib/hooks/useFetchJobValue";
import React, { useEffect, useState } from "react";
import { config } from "@/config/config.js";
import Swal from 'sweetalert2'
import TestMethodDescriptionModal from "@/components/TestMethodDescriptionModal";
import ItemInformationModal from "@/components/ItemInformationModal";
import JobReview from "@/components/JobReview";
import useFetchUser from "@/lib/hooks/useFetchUser";
import { useRouter } from 'next/navigation';
import CommentReview from "@/components/CommentReview";



const Page = ({ searchParams }) => {
    const router = useRouter();
    const job_id = searchParams.job_id
    const [refresh, setRefresh] = useState(false);
    const { jobData, jobItems, isLoading, error } = useFetchJobValue(job_id, refresh);
    const { user, isLoading: userLoading, error: userError } = useFetchUser();
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
        console.log(item);
        setCommentDetail(() => item);
        setAddCommentForm(!AddCommentForm);
    }


    const handleApprove = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${config.host}/api/approval/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    job_id: job_id,
                    user_id: user._id,
                    isApproved: true,
                    comment: null
                })
            });
            const data = await response.json();
            if (data.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setRefresh(!refresh);

                    router.push('/pages/job-approve');


                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.error,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

    }



    const handleShowTestMethodDescription = (item) => {
        setTestMethodDescription(true);
    }

    const handleShowJobItemDescription = (item) => {
        setJobItemDetail(item);
    }

    const handleReject = async (e) => {
        e.preventDefault();
        const comment = e.target.comment.value;
        console.log(commentDetail);
        console.log(comment)
        try {
            const response = await fetch(`${config.host}/api/approval/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    job_id: commentDetail.JobID,
                    user_id: user._id,
                    isApproved: false,
                    comment: comment
                })
            });
            const data = await response.json();
            if (data.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setRefresh(!refresh);
                    router.push('/pages/job-approve');
                });
            } else {
                Swal.fire({
                    title: 'Server Error',
                    text: data.error,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }catch (error) {
            console.log('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }


    return (

        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6">
            <JobReview
                jobData={jobData}
                jobItems={jobItems}
                handleApprove={handleApprove}
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
            {AddCommentForm && <CommentReview
                toggleAddComment={toggleAddComment}
                handleReject={handleReject}
                commentDetail={commentDetail}
            />}
        </Layout>
    );
};

export default Page;
