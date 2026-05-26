import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isAdminEnabled } from "@/lib/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: null,
  twitter: null,
};

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  if (!isAdminEnabled()) {
    notFound();
  }

  return children;
}
