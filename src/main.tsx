import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { routeTree } from "./routes/routeTree.gen"
import { createRouter } from "@tanstack/react-router"
import "./index.css"

if (import.meta.env.DEV) {
  import("./mocks/init")
}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)