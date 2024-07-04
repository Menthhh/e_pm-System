"use client"
import Layout from "@/components/Layout.js";
import TableComponent from "@/components/TableComponent.js";
import { getSession } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { config } from "@/config/config.js";
import Link from "next/link";
import Swal from "sweetalert2";

const jobItemTemplateHeader = ["ID", "Checklist Template Name", "Document no.", "Created At", "Action"];

const enabledFunction = {
  "edit-job-template": "663313bbeccb576a719dfa9c",
  "remove-job-template": "663313b1eccb576a719dfa9a",
  "add-job-item-template": "6638600dd81a314967236df5",
};

const Page = () => {
  const [refresh, setRefresh] = useState(false);
  const [jobTemplates, setJobTemplates] = useState([]);
  const [session, setSession] = useState({});
  const [user, setUser] = useState({});
  const [userEnableFunctions, setUserEnableFunctions] = useState([]);

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

  const handleRemove = async (jobTemplate_id, JobTemplateCreateID) => {
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
          const response = await fetch("/api/job-template/remove-job-template", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ jobTemplate_id, JobTemplateCreateID }),
            next: { revalidate: 10 },
          });
          const data = await response.json();
          if (data.status === 200) {
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "The Checklist template has been deleted.",
              icon: "success"
            });
            setRefresh((prev) => !prev);
          }
        } catch (err) {
          console.error("Error deleting Checklist template:", err);
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "The deletion action was cancelled.",
          icon: "error"
        });
      }
    });
  };

  const handleCopy = (e) => {
    //alert("Copy")
    //alert 

    alert("In development")
  }


  const jobItemTemplateBody = jobTemplates.map((jobTemplate, index) => {
    return {
      ID: index + 1,
      "Checklist Template Name": jobTemplate.JOB_TEMPLATE_NAME,
      "Document no.": jobTemplate.DOC_NUMBER,
      "Create At": jobTemplate.createdAt,
      Action: (
        <div className="flex gap-2 items-center justify-center">

          <Link
            className="bg-slate-500 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded"
            href={{
              pathname: "/pages/edit-job-template",
              query: { jobTemplate_id: jobTemplate._id },
            }}
            disabled={!userEnableFunctions.some((action) => action._id === enabledFunction["edit-job-template"])}
            style={{ cursor: !userEnableFunctions.some((action) => action._id === enabledFunction["edit-job-template"]) ? "not-allowed" : "pointer" }}
          >
            Edit
          </Link>
          <button 
            onClick={handleCopy}
            className="bg-slate-600 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded"

          >
            Copy
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-2 rounded"
            onClick={() => handleRemove(jobTemplate._id, jobTemplate.JobTemplateCreateID)}
            disabled={!userEnableFunctions.some((action) => action._id === enabledFunction["remove-job-template"])}
            style={{ cursor: !userEnableFunctions.some((action) => action._id === enabledFunction["remove-job-template"]) ? "not-allowed" : "pointer" }}
          >
            Remove
          </button>
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded"
            href={{
              pathname: "/pages/job-item-template/add-job-item-template",
              query: { jobTemplate_id: jobTemplate._id },
            }}
            disabled={!userEnableFunctions.some((action) => action._id === enabledFunction["add-job-item-template"])}
            style={{ cursor: !userEnableFunctions.some((action) => action._id === enabledFunction["add-job-item-template"]) ? "not-allowed" : "pointer" }}
          >
            Add Item
          </Link>

        </div>
      ),
    };
  });

  return (
    <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-5">
      <h1 className="text-3xl font-bold text-primary flex  items-center">{">"} WorkGroup: {user.workgroup} </h1>
      <h1 className="text-2xl font-bold">Checklist Templates</h1>
      <TableComponent
        headers={jobItemTemplateHeader}
        datas={jobItemTemplateBody}
        TableName="Checklist Templates"
        searchColumn="Checklist Template Name"
        PageSize={8}
      />
    </Layout>
  );
};

export default Page;
