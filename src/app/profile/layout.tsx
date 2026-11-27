import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your BookNook account profile.",
};

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}