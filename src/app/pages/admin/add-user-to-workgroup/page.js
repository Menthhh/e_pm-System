"use client"
import AdminLayout from "@/components/AdminLayout";
import TableComponent from "@/components/TableComponent";
import { getSession } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import nextConfig from "../../../../../next.config.mjs";

const workgroupHeader = ["id", "EMP_number", "Email", "Name", "Role", "Action"];
const userHeader = ["id", "EMP_number", "Email", "Name", "Role", "Action"];

const Page = () => {
  const [usersWorkgroup, setUsersWorkgroup] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [session, setSession] = useState({});
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    fetchSession();
    fetchUsers();
    fetchRoles();

  }, [refresh]);

  const fetchSession = async () => {
    const session = await getSession();
    setSession(session);
    await fetchUser(session.user_id);
  };

  const fetchUser = async (user_id) => {
    try {
      const response = await fetch(
        `${nextConfig.host}/api/user/get-user/${user_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUser(data.user);
      await fetchUsersWorkgroup(data.user.workgroup_id);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsersWorkgroup = async (workgroup_id) => {
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

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${nextConfig.host}/api/role/get-roles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const responseData = await response.json();
      setRoles(responseData.roles);

    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const RoleSelect = ({ user_id }) => {

  
    return (
      <select
        id={`roleSelect-${user_id}`}
        className="text-center"
        onChange={(event) => {
          const role_id = event.target.value;
          setSelectedRoles(prevState => ({
            ...prevState,
            [user_id]: role_id
          }));
        }}
        value={selectedRoles[user_id] || ""}
      >
        <option value="" disabled>Select Role</option>
        {roles.map(role => {
          if (role.ROLE_NAME === "Admin Group" || role.ROLE_NAME === "SA") return;
          return <option key={role._id} value={role._id}>{role.ROLE_NAME}</option>
        })}
      </select>
    );
  }
  

  const handleAdd = async (user_id, role_id) => {
    const workgroup_id = user.workgroup_id;
    // Update user role
    const res = await fetch(`${nextConfig.host}/api/user/update-user/${user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ROLE: role_id,
      }),
    });
    

    // Add user to workgroup
    await fetch(`${nextConfig.host}/api/workgroup/add-user-to-workgroup-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        workgroup_id: workgroup_id,
      }),
    });

    setRefresh(!refresh);
  }

  const handleRemove = async (user_id) => {
    const workgroup_id = user.workgroup_id;
  
    // Remove user from workgroup
    await fetch(`${nextConfig.host}/api/workgroup/remove-user-from-workgroup`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        workgroup_id: workgroup_id,
      }),
    });
  
    setRefresh(!refresh);
  }
  

  const dataUsers = users
    .filter(user => !usersWorkgroup.some(u => u._id === user._id))
    .map((user, index) => ({
      id: index + 1,
      EMP_number: user.emp_number,
      Email: user.email,
      Name: user.name,
      Role: <RoleSelect user_id={user._id} />,
      action: [
        <span className="pl-4" key={index}>
          <button
            onClick={() => {
              const role_id = selectedRoles[user._id];
              if (role_id) {
                handleAdd(user._id, role_id);
              } else {
                console.log("Please select a role");
              }
            }}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${!selectedRoles[user._id] && 'opacity-50 cursor-not-allowed'}`}
            disabled={!selectedRoles[user._id]}
          >
            Add
          </button>
        </span>,
      ],
    }));

  const dataUsersWorkgroup = usersWorkgroup.map((user, index) => ({
    id: index + 1,
    EMP_number: user.emp_number,
    Email: user.email,
    Name: user.name,
    Role: user.role,
    action: user.role !== "Admin Group" ? (
      [<span className="pl-4">
        <button
          onClick={() => handleRemove(user._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Remove
        </button>
      </span>]
    ) : [<span className="pl-4">  </span>],
  }));

  return (
    <AdminLayout >
      <div className="container mx-auto font-sans flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-bold text-primary flex  items-center">{">"} {user.workgroup} </h1>
        <h1 className="text-1xl font-semibold">Add User to Workgroup</h1>
        <div className="mt-4">
          <TableComponent headers={workgroupHeader} datas={dataUsersWorkgroup} searchColumn={"Name"} />
        </div>
        <hr className="w-full" />
        <div className="mt-4">
          <TableComponent headers={userHeader} datas={dataUsers} searchColumn={"Name"} />
        </div>
      </div>

    </AdminLayout>
  )
}

export default Page;
