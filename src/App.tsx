import { RouterProvider } from "react-router-dom"

import { appRouter } from "@/pages/router"

function App() {
  return (
    <div className="dark min-h-dvh bg-background text-foreground antialiased">
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
