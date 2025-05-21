import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminDashboardPage() {
  // Verify user is authenticated and has Admin role
const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/")
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)

    if (payload.role !== "Admin") {
      redirect("/")
    }

    return <AdminDashboard userId={payload.userId as number} />
  } catch {
    redirect("/")
  }
}
