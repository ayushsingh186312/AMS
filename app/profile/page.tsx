import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import UserProfile from "@/components/user-profile"

export default async function ProfilePage() {
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
        <h1 className="text-3xl font-bold mb-8">User Profile</h1>
        <UserProfile
          userId={payload.userId as number}
          username={payload.username as string}
          role={payload.role as string}
        />
      </div>
    )
  } catch {
    redirect("/")
  }
}
