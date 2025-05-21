import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import ManagerDashboard from "@/components/manager-dashboard"

export default async function ManagerDashboardPage() {
  // Verify user is authenticated and has Manager role
const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/")
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)

    if (payload.role !== "Manager") {
      redirect("/")
    }

    return <ManagerDashboard userId={payload.userId as number} />
  } catch  {
    redirect("/")
  }
}
