import { useState, useEffect } from 'react';
import { config } from '@/config/config.js';

const useFetchReport = (refresh) => {
    const [report, setReport] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`${config.host}/api/job/job-report`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                console.log('data:', data); 
                setReport(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        };
        fetchReport();
    }, [refresh]);

    return { report, isLoading };
};

export default useFetchReport;
