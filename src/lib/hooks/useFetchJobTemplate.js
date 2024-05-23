import { useEffect, useState } from "react";
import { config } from "../../config/config";

const useFetchJobTemplate = (jobTemplate_id, refresh = null) => {
    const [jobTemplate, setJobTemplate] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobTemplate = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${config.host}/api/job-template/get-job-template/${jobTemplate_id}`);
                const data = await response.json();
                if (data.status === 200) {
                    setJobTemplate(data.jobTemplate);
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobTemplate();
    }, [jobTemplate_id, refresh]);

    return { jobTemplate, isLoading, error };
}

export default useFetchJobTemplate;