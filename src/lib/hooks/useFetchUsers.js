// {
// 	"status": 200,
// 	"users": [
// 		{
// 			"_id": "6628c2b2206fae3d390ca741",
// 			"emp_number": "1001",
// 			"email": "john.doe@example.com",
// 			"name": "John Doe",
// 			"role": "SA"
// 		},
// 		{
// 			"_id": "6628c301206fae3d390ca743",
// 			"emp_number": "1002",
// 			"email": "jane.smith@example.com",
// 			"name": "Jane Smith",
// 			"role": "Admin Group"
// 		},
// 		{
// 			"_id": "6628c309206fae3d390ca745",
// 			"emp_number": "1003",
// 			"email": "michael.johnson@example.com",
// 			"name": "Michael Johnson",
// 			"role": "Admin Group"
// 		},
// 		{
// 			"_id": "6628c30e206fae3d390ca747",
// 			"emp_number": "1004",
// 			"email": "emily.brown@example.com",
// 			"name": "Emily Brown",
// 			"role": "Admin Group"
// 		},
// 		{
// 			"_id": "6628c319206fae3d390ca749",
// 			"emp_number": "1005",
// 			"email": "david.wilson@example.com",
// 			"name": "David Wilson",
// 			"role": "Admin Group"
// 		},
// 		{
// 			"_id": "6628c31e206fae3d390ca74b",
// 			"emp_number": "1006",
// 			"email": "sarah.lee@example.com",
// 			"name": "Sarah Lee",
// 			"role": "Admin Group"
// 		},
// 		{
// 			"_id": "662a1ee1f49941aaf8917a7a",
// 			"emp_number": "EMP001",
// 			"email": "john.doe@example.com",
// 			"name": "John Doe",
// 			"role": "No role"
// 		},
// 		{
// 			"_id": "662b220ce907be7c16cca634",
// 			"emp_number": "312",
// 			"email": "qweqw",
// 			"name": "sA",
// 			"role": "Admin Group"
// 		},
// 		{
// 			"_id": "662b24e85baea04d1c7a5cb7",
// 			"emp_number": "312",
// 			"email": "qweqw",
// 			"name": "rqwrq",
// 			"role": "Admin Group"
// 		},
// 		{
// 			"_id": "662b71e67c47a21abccd4556",
// 			"emp_number": "1007",
// 			"email": "Ibrahim@gmail.com",
// 			"name": "Ibrahim Ibn Muhamed",
// 			"role": "Admin Group"
// 		},
// 		{
// 			"_id": "6632fae0a67bf44b884f39be",
// 			"emp_number": "1005",
// 			"email": "markzuck@gmail.com",
// 			"name": "Mark Zuck",
// 			"role": "Admin Group"
// 		}
// 	]
// }
// http://localhost:3000/api/user/get-users
import { useEffect, useState } from "react";


const useFetchUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/user/get-users");
                const data = await res.json();
                setUsers(data.users);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return { users, loading, error };
};

export default useFetchUsers;