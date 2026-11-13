import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { I18nextProvider } from "react-i18next"
import { routeTree } from "./routes/routeTree.gen"
import i18n from "./i18n"
import "./index.css"

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
})

async function prepareApp() {
  // Always enable MSW in development and demo builds unless explicitly disabled
  if (import.meta.env.VITE_ENABLE_MOCKS !== "false") {
    const { initMSW } = await import("./mocks/init")
    await initMSW()
  }
}

prepareApp().then(() => {
  const rootElement = document.getElementById("root")
  if (!rootElement) {
    throw new Error("Root element not found")
  }

  createRoot(rootElement).render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </StrictMode>
  )
})
