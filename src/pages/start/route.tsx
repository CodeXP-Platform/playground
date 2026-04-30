import { IamController } from "@/services/iam/controller";
import useAuth from "@/store/use-auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function StartRoute() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    async function handleStart() {
        const accessToken = searchParams.get("access_token");

        if (!accessToken) {
            return null;
        }

        const response = await IamController.login(accessToken);

        const jwtPayload = JSON.parse(atob(response.jwt.split(".")[1]));

        setUser({ ...jwtPayload, jwt: response.jwt });

        navigate(`/playground?challenge=${searchParams.get("challenge")}`);
    }

    useEffect(() => {
        handleStart();
    }, []);

    return <>loading</>;
}
