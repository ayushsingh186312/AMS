import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import CreateSoftwareForm from "@/components/create-software-form"

export default async function CreateSoftwarePage() {
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

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Create New Software</h1>
        <CreateSoftwareForm />
      </div>
    )
  } catch  {
    redirect("/")
  }
}
