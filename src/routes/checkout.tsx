import { createFileRoute } from "@tanstack/react-router";
import CheckoutPage from "../pages/Checkout/CheckoutPage";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});
