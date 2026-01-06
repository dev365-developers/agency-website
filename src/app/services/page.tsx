import type { Metadata } from "next";
import ServicesClient from "./serviceClient";

export const metadata: Metadata = {
  title: "Services — dev365 Website Development & Maintenance",
  description:
  "Explore dev365 services including website design, development, hosting, maintenance, and ongoing updates with zero upfront cost.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}