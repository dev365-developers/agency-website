import type { Metadata } from "next";
import ServicesClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact dev365 — Talk to Our Team",
  description:
    "Contact dev365 to get your business website built for free. Talk to our team today.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}