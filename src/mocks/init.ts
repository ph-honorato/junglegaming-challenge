import { worker } from "./browser"

if (import.meta.env.DEV) {
  worker.start({
    quiet: false,
  }).then(() => {
    console.log("[MSW] Mock Service Worker started")
  })
}