import useSession from "./useSession";
import { useState, useEffect } from "react";
import { config } from "../../config/config";

const useFetchUser = (refresh = null) => {
    const { session, isLoading: sessionLoading, error: sessionError } = useSession();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchUser = async (user_id) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${config.host}/api/user/get-user/${user_id}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchUser(session.user_id);
        }

        if (sessionError) {
            console.log(sessionError);
        }
    }, [sessionLoading, refresh]);

    return { user, isLoading, error };
}

export default useFetchUser;
