import { createFileRoute } from "@tanstack/react-router";
import NFTDetailPage from "../../pages/NFTDetail/NFTDetailPage";

export const Route = createFileRoute("/nft/$id")({
  component: NFTDetailPage,
});