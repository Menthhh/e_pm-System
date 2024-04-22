"use client"
import SALayout from "@/components/SALayout";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import useFetch from "@/lib/hooks/useFetch";
import Listbox from "@/components/listboxComponent";

// const getRoleInfor = (role_id) => {
//     const { data, loading, error } = useFetch(`/api/role/get-role/${role_id}`);
//     
//     return {
//         "role":data.role,
//         "loading":loading
//     }
// }

const getActions =()=>{
    const { data, loading} = useFetch(`/api/action/get-actions`);
    return {"actionData":data.actions , "actionLoading":loading}

}
const getRole =(role_id)=>{
    const { data, loading} = useFetch(`/api/role/get-role/${role_id}`);
    return {"roleData":data.role , "roleLoading":loading}

}


const Page = ({ searchParam }) => {
    const searchParams = useSearchParams();
    const role_id = searchParams.get("role_id");
    const { data: actionData, loading: actionLoading } = useFetch(`/api/action/get-actions`);
    const { data: roleData, loading: roleLoading } = useFetch(`/api/role/get-role/${role_id}`);

    
    if (actionLoading || roleLoading) {
        return <div>Loading...</div>;
    }
    
    // Check if roleData exists before accessing its properties
    if (!roleData || !roleData.role || !roleData.role.ROLE_NAME) {
        return <div>Error: Role data not found</div>;
    }

    console.log(roleData.role.ROLE_NAME);

    const functions = [

    ]

    const roleFunctions = [
        'Apple',
        'Banana',
        // Add more role functions here
    ];


    return (
        <SALayout className="flex flex-col items-center gap-9 p-12">
        {actionLoading ? (
            "Loading..."
        ) : (
            <>
                <h1 className="text-2xl font-bold">Role {roleData.role.ROLE_NAME}</h1>
                <div className="flex gap-20 container mx-auto left-0 right-0 justify-center p-6 items-center">
                
                    {/* <Listbox datas={actionData} />
                    <div className="flex flex-col gap-4">
                        <button className="bg-green-500 px-5 py-2 rounded-md hover:bg-green-600">
                            Add to role
                        </button>
                        <button className="bg-red-500 px-5 py-2 rounded-md hover:bg-red-600">
                            Remove from role
                        </button>
                    </div>
                    <Listbox datas={roleData} /> */}
                </div>
                <Link href="/pages/role-determiner" className="absolute right-5 bottom-2 bg-yellow-400 px-5 py-2 rounded-md hover:bg-yellow-500">
                    Back to Role determiner
                </Link>
            </>
        )}
    </SALayout>
    
    );
}

export default Page;
