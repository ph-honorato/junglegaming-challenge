// MSW Browser Initialization
import { worker } from "./browser"
import { handlers } from "./handlers"

export async function initMSW() {
  if (typeof window === "undefined") return

  try {
    await worker.start({
      onUnhandledFrame: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    })
    console.log("[MSW] Mock Service Worker started successfully")
  } catch (error) {
    console.error("[MSW] Failed to start:", error)
  }
}

// Export worker and handlers
export { handlers, worker }
