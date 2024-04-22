"use client"
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import TableComponent from '@/components/TableComponent';
import axios from 'axios';

const Page = () => {
    const [roles, setRoles] = useState([]);
    const [newRoles, setNewRoles] = useState(false);
    const newRoleInput = useRef(null);

    useEffect(() => {
        fetchRoles();
    }, [newRoles]); 

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/role/get-roles');
            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }
            const data = await response.json();
            setRoles(data.roles);
        } catch (error) {
            console.error(error);
        }
    };

    const headers = ['ID', 'Role', 'Action'];

    const data = roles.map((role,index) => (
        {
            id: index + 1,
            Role: role.ROLE_NAME,
            action:
                [<span className='pl-4'><button id="1" onClick={() => handleEdit(role._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button></span>,
                <span className='pl-4'><button onClick={() => handleDelete(role._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button></span>]
        }
    ));

    const createRole = async () => {
        try {
            await axios.post('http://localhost:3000/api/role/create-role', {
                "ROLE_NAME": newRoleInput.current.value
            });
            setNewRoles(!newRoles); 
            newRoleInput.current.value = ''; 
        } catch (error) {
            console.error('Error creating role:', error);
        }
    };

    const onClickNewRole = () => {
        setNewRoles(!newRoles);
    };

    const handleEdit = (id) => {
        console.log('handleEdit', id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/role/delete-role/${id}`);
            setNewRoles(!newRoles); // Trigger page refresh by toggling newRoles state
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    const newRoleFormInput = (
        <form onSubmit={createRole} className="flex gap-4">
            <input type="text" placeholder="Role Name" ref={newRoleInput} className="py-2 px-4 ring-1 ring-black rounded-md"/>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md">Add Role</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md" onClick={() => setNewRoles(!newRoles)}>Cancel</button>
        </form>
    );
    
    return (
        <div className="w-full h-screen flex flex-col gap-10 items-center relative">
            <Navbar />
            <div className="container mx-auto px-4">
                {roles.length > 0 && <TableComponent headers={headers} datas={data} searchColumn={"Role"} />}
            </div>
            <div className="flex gap-5 absolute left-6 bottom-5">
                {newRoles? " ": <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md" onClick={onClickNewRole}>New Role</button>}
                {newRoles && newRoleFormInput}
            </div>
        </div>
    );
};

export default Page;
