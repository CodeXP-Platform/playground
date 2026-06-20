import { Navigate, createBrowserRouter } from "react-router-dom";

import StartRoute from "@/pages/start/route.tsx";
import { AppRoute } from "@/types";
import PlaygroundRoute from "./playground/route";
import { playgroundLoaderData } from "./playground/loader";

export const appRouter = createBrowserRouter([
    {
        path: AppRoute.Start,
        element: <StartRoute />,
    },
    {
        path: AppRoute.Playground,
        element: <PlaygroundRoute />,
        loader: playgroundLoaderData,
    },
    {
        path: AppRoute.Fallback,
        element: <Navigate to={AppRoute.Start} replace />,
    },
]);
