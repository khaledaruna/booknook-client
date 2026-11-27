import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your BookNook account.",
};

export default function RegisterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}