import { config } from "@/config/config.js";
import { useState, useEffect } from "react";

const useFetchMachines = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const res = await fetch(`${config.host}/api/machine/get-machines`);
                const data = await res.json();
                setMachines(data.machines);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchMachines();
    }, []);

    return { machines, loading, error };
};

export default useFetchMachines;