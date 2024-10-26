// dashboard/page.tsx
import { redirect } from "next/navigation";

export default function Dashboard() {
  redirect("/dashboard/overview");
  return null;
}
