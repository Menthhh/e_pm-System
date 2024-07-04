"use client"
import Layout from "@/components/Layout.js";
import TableComponent from "@/components/TableComponent.js";
import { getSession } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { config } from "@/config/config.js";
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import JobPlan from "@/components/JobPlan";
import SearchIcon from '@mui/icons-material/Search';


const jobTemplatesHeader = ["ID", "Checklist Template Name", "Document no.", "Created At", "Action"];

const jobsHeader = [
    "ID",
    "Checklist Name",
    "Document no.",
    "Status",
    "Active",
    "Activator",
    "Action"
]

const enabledFunction = {
    "activate-job-template": "66389056d81a314967236e07",
    "remove-job": "6638906bd81a314967236e09",
};

const statusOptions = [
    "All",
    "New",
    "Ongoing",
    "Plan",
    "Waiting for approval",
    "Complete",
    "Retake",
    "Overdue"
];

const Page = () => {
    const [refresh, setRefresh] = useState(false);
    const [jobTemplates, setJobTemplates] = useState([]);
    const [session, setSession] = useState({});
    const [user, setUser] = useState({});
    const [userEnableFunctions, setUserEnableFunctions] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [isShowDetail, setIsShowDetail] = useState(false);
    const [detail, setDetail] = useState({});

    const [isShowPlan, setIsShowPlan] = useState(false);
    const [planData, setPlanData] = useState({});

    const [filterStatus, setFilterStatus] = useState("All");
    const [startDate, setStartDate] = useState(null); // Default start date as null
    const [endDate, setEndDate] = useState(null); // Default end date as null
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };


    const filteredJobs = jobs && jobs.filter(job => {
        // Filter by status
        if (filterStatus !== "All" && job.STATUS_NAME !== filterStatus.toLowerCase()) {
            return false;
        }

        // Filter by start date
        if (startDate && new Date(job.createdAt) < new Date(startDate)) {
            return false;
        }

        // Filter by end date
        if (endDate && new Date(job.createdAt) > new Date(endDate)) {
            return false;
        }

        // Filter by search query
        if (searchQuery && !job.JOB_NAME.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

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
            const response = await fetch(`/api/user/get-user/${user_id}`, { next: { revalidate: 10 } });
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await response.json();
            setUser(data.user);
            setUserEnableFunctions(data.user.actions);
            await fetchJobTemplates(data.user.workgroup_id);
            await fetchJobs(data.user.workgroup_id);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchJobTemplates = async (workgroup_id) => {
        try {
            const response = await fetch(`/api/workgroup/get-job-templates-from-workgroup/${workgroup_id}`, { next: { revalidate: 10 } });
            const data = await response.json();
            if (data.status === 200) {
                setJobTemplates(data.jobTemplates);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleActivate = async (requestData) => {
        try {
            const response = await fetch(`/api/job/activate-job-template-manual`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "JobTemplateID": requestData.jobTemplateID,
                    "JobTemplateCreateID": requestData.jobTemplateCreateID,
                    "ACTIVATER_ID": requestData.ACTIVATER_ID
                }),
                next: { revalidate: 10 }
            });
            const responseData = await response.json();
            if (responseData.status === 200) {
                setRefresh(!refresh);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Checklist template activated successfully"
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePlan = (data) => {
        setPlanData(data);
        setIsShowPlan(prev => !prev);
    }


    const fetchJobs = async (workgroup_id) => {
        try {
            const response = await fetch(`/api/job/get-jobs-from-workgroup/${workgroup_id}`, { next: { revalidate: 10 } });
            const data = await response.json();
            if (data.status === 200) {
                setJobs(data.jobs);

            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleRemove = async (job_id) => {

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: true
        });

        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/job/remove-job`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ job_id }),
                        next: { revalidate: 10 }
                    });
                    swalWithBootstrapButtons.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    const data = await response.json();
                    if (data.status === 200) {
                        setRefresh((prev) => !prev);
                    }
                } catch (error) {
                    console.error("Error deleting workgroup:", error);
                }

            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your imaginary file is safe :)",
                    icon: "error"
                });
            }
        });

    }

    const jobTemplatesBody = jobTemplates.map((jobTemplate, index) => {
        const data = {
            jobTemplateID: jobTemplate._id,
            jobTemplateCreateID: jobTemplate.JobTemplateCreateID,
            ACTIVATER_ID: user._id
        }
        return {
            "ID": index + 1,
            "Checklist Template Name": jobTemplate.JOB_TEMPLATE_NAME,
            "Document no.": jobTemplate.DOC_NUMBER,
            "Create At": jobTemplate.createdAt,
            "Action": (
                <div className="flex gap-2 items-center justify-center">
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-1 px-3 rounded"
                        onClick={() => handlePlan(data)}
                        disabled={!userEnableFunctions.some((action) => action._id === enabledFunction["activate-job-template"])}
                        style={{ cursor: !userEnableFunctions.some((action) => action._id === enabledFunction["activate-job-template"]) ? "not-allowed" : "pointer" }}
                    >
                        plan
                    </button>
                    <button
                        className="bg-orange-500 hover:bg-orange-700 text-white font-semibold py-1 px-2 rounded"
                        onClick={() => handleActivate(data)}
                        disabled={!userEnableFunctions.some((action) => action._id === enabledFunction["activate-job-template"])}
                        style={{ cursor: !userEnableFunctions.some((action) => action._id === enabledFunction["activate-job-template"]) ? "not-allowed" : "pointer" }}
                    >
                        Activate
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded"
                        onClick={() => handleViewDetial(data)}
                        disabled={!userEnableFunctions.some((action) => action._id === enabledFunction["activate-job-template"])}
                        style={{ cursor: !userEnableFunctions.some((action) => action._id === enabledFunction["activate-job-template"]) ? "not-allowed" : "pointer" }}
                    >
                        details
                    </button>
                </div>
            ),
        };
    });

    const jobsBody = filteredJobs && filteredJobs.map((job, index) => {
        return {
            ID: index + 1,
            "Checklist Name": job.JOB_NAME,
            "Document no.": job.DOC_NUMBER,
            "Status": (
                <div
                    style={{ backgroundColor: job.STATUS_COLOR }}
                    className="px-4 text-[12px] font-bold py-1 rounded-full text-white shadow-xl ipadmini:text-sm whitespace-nowrap overflow-hidden text-ellipsis select-none"
                >
                    {job.STATUS_NAME ? job.STATUS_NAME : "pending"}
                </div>
            ),


            "Active": job.createdAt ? new Date(job.createdAt).toLocaleString() : "Not Active",
            "Activator": job.ACTIVATER_NAME,
            "Action": (
                //check permission
                <div className="flex gap-2 items-center justify-center">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded"
                        onClick={() => handleRemove(job._id)}
                        disabled={!userEnableFunctions.some((action) => action._id === enabledFunction["remove-job"])}
                        style={{ cursor: !userEnableFunctions.some((action) => action._id === enabledFunction["remove-job"]) ? "not-allowed" : "pointer" }}
                    >
                        Remove
                    </button>
                </div>
            )
        };
    });

    const ShowDetailModal = ({ onClose }) => {
        const [isCopied, setIsCopied] = useState(false);

        const copyToClipboard = () => {
            const input = document.getElementById('npm-install');
            input.select();
            document.execCommand('copy');
            setIsCopied(true);

            // Reset the copied state after 3 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        };

        // Disable background scrolling when modal is open
        useEffect(() => {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }, []);

        return (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ">
                <div className="bg-white p-5 rounded-lg w-2/3  flex flex-col gap-6 relative">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">Detail</h1>
                        <h2 className="text-sm text-secondary">To activate through third-party, you need to send a GET request with the following pattern:</h2>
                        <div className="grid grid-cols-8 gap-2 w-full max-w-[23rem]">
                            <label htmlFor="npm-install" className="sr-only">Label</label>
                            <input
                                id="npm-install"
                                type="text"
                                className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={detail.link}
                                readOnly
                            />
                            <button
                                onClick={copyToClipboard}
                                className="col-span-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 items-center inline-flex justify-center"
                            >
                                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>
                    <button
                        className="bg-red-700 text-white font-bold py-2 px-4 self-end absolute top-0 right-0 hover:bg-red-800 shadow-lg rounded-sm"
                        onClick={() => setIsShowDetail(false)} // Close modal on button click
                    >
                        <CloseIcon className="size-18" />
                    </button>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-2xl font-bold">How to retrieve the Data ?</h1>
                        <p className="text-sm text-secondary">You can use the following URL pattern followed by the Checklist ID that was sent to you after activation through the above URL.</p>
                        <p className="text-sm text-black bg-gray-300 p-2 font-bold">Example: {`/api/job/get-job-value?job_id=job_id`}</p>
                    </div>
                </div>
            </div>
        );
    };


    const handleViewDetial = (data) => {
        const link = `${config.host_link}/api/job/activate-job-template-third-party?jobTemID=${data.jobTemplateID}&actID=${data.ACTIVATER_ID}&jobTemCreateID=${data.jobTemplateCreateID}`
        setDetail(() => ({
            "link": link
        }))
        setIsShowDetail(true);
    }


    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-5">
            <h1 className="text-3xl font-bold text-primary flex  items-center">{">"} WorkGroup: {user.workgroup} </h1>
            <h1 className="text-2xl font-bold">Checklist Templates</h1>
            <TableComponent
                headers={jobTemplatesHeader}
                datas={jobTemplatesBody}
                TableName="Checklist Templates"
                searchColumn="Checklist Template Name"
                PageSize={8}
            />
            <h1 className="text-2xl font-bold">Active Jobs</h1>
            <div className="flex mb-4 justify-start items-center gap-4">
                <div className="flex-1.5">
                    <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-900 dark:text-white">Search Checklist</label>
                    <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                            type="search"
                            id="search"
                            className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search"
                            required
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="flex-2">
                    <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-900 dark:text-white">Filter by Status</label>
                    <select
                        id="statusFilter"
                        className="bg-white w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        {statusOptions.map(option => (
                            <option key={option} value={option === "All" ? "All" : option.toLowerCase()}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-2">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={startDate || ''}
                        onChange={handleStartDateChange}
                        className="bg-white w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                <div className="flex-2">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-900 dark:text-white">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={endDate || ''}
                        onChange={handleEndDateChange}
                        className="bg-white w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
            </div>
            <TableComponent
                headers={jobsHeader}
                datas={jobsBody}
                TableName="Active Checklist"
                searchColumn="Checklist Name"
                PageSize={8}
                searchHidden={true}
            />
            {isShowDetail && (<ShowDetailModal />)}
            {isShowPlan && (
                <JobPlan
                    data={planData}
                    onClose={() => setIsShowPlan(false)} // Close modal handler
                    setRefresh={setRefresh}
                />
            )}

        </Layout>
    );
};

export default Page;
