'use client'
import Layout from "@/components/Layout.js";
import TableComponent from "@/components/TableComponent.js";


const jobItemTemplateHeader = ["ID", "Job Template Name", "Action"];
const jobItemTemplateBody = [
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
    {
        "id": 1,
        "Job Template Name": "Job Template 1",
        "Action": 
        <div className="flex gap-2 items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"> Remove </button> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"> Add Item </button> 
        </div>
    },
  
]

const Page = () => {
    

    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6 gap-5">
            <h1 className="text-2xl font-bold">Job Templates</h1>
            <TableComponent headers={jobItemTemplateHeader} datas={jobItemTemplateBody} TableName="Job Templates" searchColumn="Job Template Name" PageSize={8} />
            
        </Layout>

    );
};

export default Page;