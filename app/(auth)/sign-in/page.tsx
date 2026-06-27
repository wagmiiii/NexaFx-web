import type { Metadata } from "next";
import SignInPageClient from "./sign-in-client";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return <SignInPageClient />;
}
