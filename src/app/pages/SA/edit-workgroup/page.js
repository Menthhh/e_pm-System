"use client";
import SALayout from "@/components/SALayout";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import TableComponent from "@/components/TableComponent";
import EditIcon from '@mui/icons-material/Edit';
import nextConfig from "../../../../../next.config.mjs";

const workgroupHeader = ["id","EMP_number", "Email" ,"Name", "Role", "Action"];
const userHeader = ["id","EMP_number", "Email", "Name", "Role", "Action"];


const Page = () => {
  const searchParams = useSearchParams();
  const workgroup_id = searchParams.get("workgroup_id");
  const [refresh, setRefresh] = useState(false);

  const [workgroup, setWorkgroup] = useState({});
  const [usersWorkgroup, setUsersWorkgroup] = useState([]);
  const [users, setUsers] = useState([]);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    fetchWorkgroup();
    fetchUsersWorkgroup();
    fetchUsers();
  }, [refresh]);

  const fetchWorkgroup = async () => {
    try {
      const response = await fetch(
        `${nextConfig.host}/api/workgroup/get-workgroup/${workgroup_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch workgroup");
      }
      const workgroupData = await response.json();
      setWorkgroup(workgroupData.workgroup);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchUsersWorkgroup = async () => {
    try {
      const response = await fetch(
        `${nextConfig.host}/api/workgroup/get-users-from-workgroup/${workgroup_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersWorkgroupData = await response.json();
      setUsersWorkgroup(usersWorkgroupData.users);

    } catch (error) {
      console.error(error);
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${nextConfig.host}/api/user/get-users`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await response.json();
      const filteredUsers = usersData.users.filter(user => user.role !== "SA" && user.role !== "Admin Group");

      setUsers(filteredUsers);

    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (user_id) => {
    await fetch(`${nextConfig.host}/api/workgroup/remove-user-from-workgroup`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        workgroup_id,
      }),
    });
    setRefresh(!refresh);
  }

  const handleAdd = async (user_id) => {
    await fetch(`${nextConfig.host}/api/workgroup/add-user-to-workgroup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        workgroup_id,
      }),
    });
    setRefresh(!refresh);
  }

  const dataUsersWorkgroup = usersWorkgroup.map((user, index) => ({
    id: index + 1,
    EMP_number: user.emp_number,
    Email: user.email,
    Name: user.name,
    Role: user.role,
    action: [
      <span className="pl-4">
        <button
          onClick={() => handleDelete(user._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Remove
        </button>
      </span>,
    ],
  }));

  
  const dataUsers = users
  .filter(user => !usersWorkgroup.some(u => u._id === user._id)) // Filter out users already in the UsersWorkgroup
  .map((user, index) => ({
    id: index + 1,
    EMP_number: user.emp_number,
    Email: user.email,
    Name: user.name,
    Role: user.role,
    action: [
      <span className="pl-4">
        <button
          onClick={() => handleAdd(user._id)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
      </span>,
    ],
  }));
  
  const nameEditField = edit ? (
    <input
      type="text"
      value={workgroup.name}
      onChange={(e) => setWorkgroup({ ...workgroup, name: e.target.value })}
    />
  ) : (
    <span>{workgroup.name}</span>
  );

  return (
    <SALayout className="flex flex-col items-center">
      <div className="container mx-0 left-0 right-0 flex flex-col justify-center items-center p-10 gap-5">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <b>{workgroup.name}</b>
          <EditIcon
            onClick={() => setEdit(!edit)}
            className="cursor-pointer"/>
        </h1>
        <TableComponent headers={workgroupHeader} datas={dataUsersWorkgroup} searchColumn={"Name"} />
        <hr className="w-full" />
        <TableComponent headers={userHeader} datas={dataUsers} searchColumn={"Name"} />
      </div>
    </SALayout>
  );
};

export default Page;
