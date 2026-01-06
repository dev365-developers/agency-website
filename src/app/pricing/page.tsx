import type { Metadata } from "next";
import ServicesClient from "./pricingClient";

export const metadata: Metadata = {
  title: "Pricing — dev365 Website Plans",
  description:
    "View dev365 pricing plans. Get a professional business website built for free with simple monthly pricing.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}