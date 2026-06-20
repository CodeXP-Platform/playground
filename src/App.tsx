import { RouterProvider } from "react-router-dom";

import { appRouter } from "@/pages/router";

function App() {
    return (
        <div className="dark h-dvh overflow-hidden bg-background text-foreground antialiased">
            <RouterProvider router={appRouter} />
        </div>
    );
}

export default App;
