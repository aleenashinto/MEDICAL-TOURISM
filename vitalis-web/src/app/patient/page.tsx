import { redirect } from "next/navigation";

/**
 * PP-001/003: Redirect /patient root to /patient/dashboard.
 * Without this file, navigating to /patient causes a 404.
 */
export default function PatientRootPage() {
  redirect("/patient/dashboard");
}
