"use client"
import AdminLayout from "@/components/AdminLayout";
import Navbar from "@/components/Navbar";
import TableComponent from "@/components/TableComponent";

import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';

const menus = [
    {
        "name": <div className="flex justify-start items-center gap-2"><HomeIcon className="size-6"/> <p className="text-xl">Home</p></div>,
        "path": "/pages/dashboard"
    }
];

const headers = ["ID", "Role", "Action"];
const body = [
    {
        "id": 1,
        "Role": "Admin",
        "Action": "Edit"
    },
    {
        "id": 1,
        "Role": "Admin",
        "Action": "Edit"
    },
    {
        "id": 1,
        "Role": "Admin",
        "Action": "Edit"
    },
    {
        "id": 1,
        "Role": "Admin",
        "Action": "Edit"
    },
]

const Page = () => {
    return (
        <div className="h-auto w-screen z-0 absolute bg-gray-100 pb-24">
            <Navbar
                menu={menus}
            />
            <div className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6">
                <div className="h-[400px] bg-gray-100 w-screen absolute left-0 rounded-t-lg ">
                </div>
                <div className="z-50">
                    <h1 className="text-3xl text-black font-bold pt-4"> Dashboard</h1>

                    <div className="flex flex-wrap mt-9 gap-8 justify-between">
                        <div className="w-52 h-48  bg-white drop-shadow-lg rounded-sm hover:shadow-2xl cursor-pointer flex flex-col gap-3 p-2 pl-6 justify-center items-start">
                            <GroupIcon className="size-12 align-items-center"/>
                            <div className="flex flex-col gap-3">
                                <h1 className="text-2xl font-bold">Workgroup</h1>
                                <p className="text-sm text-secondary">Manage Workgroup</p>
                            </div>
                        </div> 

                    </div>

                    <div>
                        <TableComponent
                            headers={headers}
                            datas={body}
                            searchColumn={"Role"}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Page;