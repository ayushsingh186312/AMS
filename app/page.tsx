import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import LoginForm from "@/components/login-form"

export default async function Home() {
  // Check if user is already logged in
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
      const { payload } = await jwtVerify(token, secret)

      // Redirect based on role
      if (payload.role === "Admin") {
        redirect("/admin/dashboard")
      } else if (payload.role === "Manager") {
        redirect("/manager/dashboard")
      } else {
        redirect("/employee/dashboard")
      }
    } catch  {
      // Invalid token, continue to login page
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">User Access Management</h1>
          <p className="text-gray-600 mt-2">Login to access the system</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
