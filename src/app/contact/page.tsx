import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { baseOpenGraph } from "../shared-metadata";

const siteUrl = process.env.NEXT_PUBLIC_URL || "";
const url = `${siteUrl}/contact`;
const urlImage = `${siteUrl}/images/logo.png`;

export const metadata: Metadata = {
  title: "Contact",
  description: "Dai & Partners - Contact",
  openGraph: {
    ...baseOpenGraph,
    url,
    images: [{ url: urlImage }],
  },
  alternates: {
    canonical: url,
  },
};

export default function Page() {
  return <ContactClient />;
}
