import { Navigate, createBrowserRouter } from "react-router-dom";

import PlaygroundRoute, {
    loader as playgroundLoader,
} from "@/pages/playground/route.tsx";
import StartRoute from "@/pages/start/route.tsx";
import { AppRoute } from "@/types";

export const appRouter = createBrowserRouter([
    {
        path: AppRoute.Start,
        element: <StartRoute />,
    },
    {
        path: AppRoute.Playground,
        element: <PlaygroundRoute />,
        loader: playgroundLoader,
    },
    {
        path: AppRoute.Fallback,
        element: <Navigate to={AppRoute.Start} replace />,
    },
]);
