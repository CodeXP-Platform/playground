import { createBrowserRouter } from "react-router-dom"

import StartRoute from "@/pages/start/route"
import { AppRoute } from "@/types"

export const appRouter = createBrowserRouter([
  {
    path: AppRoute.Start,
    element: <StartRoute />,
  },
])
