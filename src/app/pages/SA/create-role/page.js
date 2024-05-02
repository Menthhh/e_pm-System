"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import TableComponent from "@/components/TableComponent";
import Link from "next/link";
import nextConfig from "../../../../../next.config.mjs";
import SALayout from "@/components/SALayout";

const headers = ["ID", "Role", "Action"];

const Page = () => {
  const [roles, setRoles] = useState([]);
  const [newRoles, setNewRoles] = useState(false);
  const newRoleInput = useRef(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, [refresh]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${nextConfig.host}/api/role/get-roles`);
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      setRoles(data.roles);
    } catch (error) {
      console.error(error);
    }
  };

  const data = roles.map((role, index) => ({
    //if role name is admin group then do not show delete button

    id: index + 1,
    Role: role.ROLE_NAME,
    action: [
      <span className="pl-4">
        <Link
          id="1"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href={{
            pathname: "/pages/SA/edit-role",
            query: { role_id: role._id },
          }}
        >
          Edit
        </Link>
      </span>,
      <span className="pl-4">
        {role.ROLE_NAME === "Admin Group" || role.ROLE_NAME === "SA" ? ("") : (
          <button
            onClick={() => handleDelete(role._id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>)}
      </span>,
    ],
  }));

  const createRole = async () => {
    try {
      await fetch(`${nextConfig.host}/api/role/create-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ROLE_NAME: newRoleInput.current.value,
        }),
      });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${nextConfig.host}/api/role/delete-role/${id}`, {
        method: "DELETE",
      });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const newRoleFormInput = (
    <form onSubmit={createRole} className="flex gap-4 ">
      <input
        type="text"
        placeholder="Role Name"
        ref={newRoleInput}
        className="py-2 px-4 ring-1 ring-black rounded-md"
      />
      <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md">
        Add Role
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md"
        onClick={() => setNewRoles(!newRoles)}
      >
        Cancel
      </button>
    </form>
  );

  return (
    <SALayout className="w-full h-screen flex flex-col gap-4 items-center justify-start font-sans">
      <div className="w-full h-full bg-white container px-8  rounded-lg flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-primary flex items-center">{">"} Manage Role </h1>
    
          <form onSubmit={createRole} className="flex gap-4 ">
            <input
              type="text"
              placeholder="Role Name"
              ref={newRoleInput}
              className="py-2 px-4 ring-1 ring-black rounded-md"
            />
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md">
              Add Role
            </button>
          
          </form>
   
        <div >
          {roles.length > 0 && (
            <TableComponent
              headers={headers}
              datas={data}
              searchColumn={"Role"}
              TableName="All Roles"
            />
          )}
        </div>
      </div>
    </SALayout>
  );
};

export default Page;
