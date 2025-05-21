import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import RequestAccessForm from "@/components/request-access-form"

export default async function RequestAccessPage() {
  // Verify user is authenticated
const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/")
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Request Software Access</h1>
        <RequestAccessForm userId={payload.userId as number} />
      </div>
    )
  } catch  {
    redirect("/")
  }
}
