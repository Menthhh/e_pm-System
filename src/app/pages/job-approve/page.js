"use client"
import Layout from "@/components/Layout";
import TableComponent from "@/components/TableComponent";
import useFetchJobApproves from "@/lib/hooks/useFetchJobApproves";
import useFetchUser from "@/lib/hooks/useFetchUser";
import Link from "next/link";

const jobApprovesHeader = [
    "ID",
    "Job Name",
    "Document no.",
    "Status",
    "submittedAt",
    "Action"
]

const Page = () => {
    const { user, isLoading: userLoading, error: userError } = useFetchUser();
    const { jobApproves, loading: jobApprovesLoading, error: jobApprovesError } = useFetchJobApproves(user._id);

    const jobApprovesBody = jobApproves && jobApproves.map((jobApprove, index) => {
        return {
            "ID": index + 1,
            "Job Name": jobApprove.job_name,
            "Document no.": jobApprove.job_doc_number,
            "Status": (
                <div
                    style={{ backgroundColor: jobApprove.job_status_color }}
                    className="py-1 px-2 rounded-full text-black font-bold shadow-xl text-[12px] ipadmini:text-sm"
                >
                    {jobApprove.job_status ? jobApprove.job_status : "pending"}
                </div>
            ),
            "submittedAt": new Date(jobApprove.job_submittedAt).toLocaleString(),
            "Action": (
                <div>
                    <Link
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-bold rounded-lg text-[12px] ipadmini:text-sm px-5 py-2 text-center"
                        href={{
                            pathname: "/pages/job-review",
                            query: {
                                job_id: jobApprove.job_id
                            },
                        }}
                    >
                        View
                    </Link>
                </div>

            )
        }
    });
    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 ">
            <h1 className="text-3xl font-bold text-gray-800 leading-tight mb-4">
                Waiting for your approval...
            </h1>
            <TableComponent headers={jobApprovesHeader} datas={jobApprovesBody} TableName="Active Jobs" PageSize={5} />
    

        </Layout>
    );
}

export default Page;