import { createFileRoute } from "@tanstack/react-router";
import WalletsPage from "../pages/Wallets/WalletsPage";

export const Route = createFileRoute("/wallets")({
  component: WalletsPage,
});
