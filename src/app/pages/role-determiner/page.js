'use client'

import Navbar from "@/components/Navbar";
import TableComponent from "@/components/TableComponent";
import Link from "next/link";


const Page = () => {
    // Define the headers for the table
    const headers = ['ID', 'Role', 'Action'];

    const data = [
        { id: 1, Role: 'Admin', action: [<span className='pl-4'><button id="1" onClick={() => handleEdit(this)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button></span>, <span className='pl-4'><button onClick={() => handleDelete(1)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button></span>] },
        { id: 2, Role: 'Checker', action: [<span className='pl-4'><button id="1" onClick={() => handleEdit(this)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button></span>, <span className='pl-4'><button onClick={() => handleDelete(1)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button></span>] },
    ];

    const handleEdit = (event) => {
        console.log('use handleEdit');
    }

    const handleDelete = (event) => {
        console.log('use handleDelete');
    }

    return (
        <div className="w-full h-screen flex flex-col gap-10 items-center relative">
            <Navbar />
            <div className="container mx-auto px-4">
                <TableComponent headers={headers} datas={data} searchColumn={"Role"}/>
            </div>
            <div className="flex gap-5 absolute left-6 bottom-5">
                <Link href="/pages/role-edit" className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md">New Role</Link>
            </div>
        </div>
    );
};

export default Page;
