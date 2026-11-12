import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { I18nextProvider } from "react-i18next"
import { routeTree } from "./routes/routeTree.gen"
import { createRouter } from "@tanstack/react-router"
import "./i18n"
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
    <I18nextProvider i18n={await import("./i18n").then((m) => m.default)}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </StrictMode>
)