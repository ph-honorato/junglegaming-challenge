import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "../pages/Profile/ProfilePage";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});
