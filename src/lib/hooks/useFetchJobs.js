import { useEffect, useState } from "react";
import { config } from "@/config/config.js";
import useFetchUser from "./useFetchUser";


const useFetchJobs = (refresh = null) => {
    const { user, isLoading: userLoading, error:userError } = useFetchUser();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async (workgroup_id) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${config.host}/api/job/get-jobs-from-workgroup/${workgroup_id}`,
                { next: { revalidate: 10 } }
                );
                const data = await response.json();
                if (data.status === 200) {
                    setJobs(data.jobs);
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
           
            fetchJobs(user.workgroup_id);
        }

    }, [user,refresh]);

    return { jobs, isLoading, error };
}

export default useFetchJobs;