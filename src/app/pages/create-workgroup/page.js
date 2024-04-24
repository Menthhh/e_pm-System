"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import TableComponent from "@/components/TableComponent";
import Link from "next/link";
import SALayout from "@/components/SALayout";
import MessageBox from "@/components/MessageBox";

const headers = ["ID", "WorkGroup", "Action"];

const Page = () => {
  const [workgroups, setWorkgroups] = useState([]);
  const [newWorkgroup, setNewWorkgroup] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const newWorkgroupInput = useRef(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  useEffect(() => {
    fetchWorkgroups();
  }, [refresh]);

  useEffect(() => {
    if (showConfirmationDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showConfirmationDialog]);

  const fetchWorkgroups = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/workgroup/get-workgroups"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      setWorkgroups(data.workgroups);
    } catch (error) {
      console.error(error);
    }
  };

  const data = workgroups.map((workgroup, index) => ({
    id: index + 1,
    Workgroup: workgroup.WORKGROUP_NAME,
    action: [
      <span className="pl-4">
        <Link
          id="1"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href={{
            pathname: "/pages/edit-workgroup",
            query: { workgroup_id: workgroup._id },
          }}
        >
          Edit
        </Link>
      </span>,
      <span className="pl-4">
        <button
          onClick={() => handleDelete(workgroup._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </span>,
    ],
  }));

  const createWorkgroup = async () => {
    try {
      await fetch("http://localhost:3000/api/workgroup/create-workgroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          WORKGROUP_NAME: newWorkgroupInput.current.value,
        }),
      });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error creating workgroup:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(
        `http://localhost:3000/api/workgroup/delete-workgroup/${id}`,
        {
          method: "DELETE",
        }
      );
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error deleting workgroup:", error);
    }
  };

  const newWorkgroupFormInput = (
    <form onSubmit={createWorkgroup} className="flex gap-4 fixed">
      <input
        type="text"
        placeholder="Role Name"
        ref={newWorkgroupInput}
        className="py-2 px-4 ring-1 ring-black rounded-md"
      />
      <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md">
        Add Workgroup
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md"
        onClick={() => setNewWorkgroup(!newWorkgroup)}
      >
        Cancel
      </button>
    </form>
  );

//   const setShowConfirmationDialog = (value) => {
//     setShowConfirmationDialog(value);
//   };

  return (
    <SALayout>
      <div className="w-full h-screen flex flex-col gap-4 p-3 items-center relative">
        <div className="container mx-auto px-4 h-1/2 overflow-scrol">
          {workgroups.length > 0 && (
            <TableComponent
              headers={headers}
              datas={data}
              searchColumn={"Workgroup"}
            />
          )}
        </div>
        <div className="flex gap-5 left-6 bottom-16 fixed">
          {newWorkgroup ? (
            " "
          ) : (
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md fixed"
              onClick={() => setNewWorkgroup(!newWorkgroup)}
            >
              New WorkGroup
            </button>
          )}
          {newWorkgroup && newWorkgroupFormInput}
        </div>
      </div>
      {showConfirmationDialog && (<MessageBox message={"Are you sure you want to delete this workgroup?"} />)}
    </SALayout>
  );
};
// };onYes={() => setShowConfirmationDialog(false)} onNo={() => setShowConfirmationDialog(false)

export default Page;
