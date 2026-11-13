import { createFileRoute } from "@tanstack/react-router";
import OrderConfirmationPage from "../../pages/OrderConfirmation/OrderConfirmationPage";

export const Route = createFileRoute("/order/$id")({
  component: OrderConfirmationPage,
});