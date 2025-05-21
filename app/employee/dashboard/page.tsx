import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import EmployeeDashboard from "@/components/employee-dashboard"

export default async function EmployeeDashboardPage() {
  // Verify user is authenticated
const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/")
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)

    return <EmployeeDashboard userId={payload.userId as number} username={payload.username as string} />
  } catch  {
    redirect("/")
  }
}
