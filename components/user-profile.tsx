"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { logout } from "@/lib/auth-actions"
import { getUserRequests } from "@/lib/request-actions"

interface UserProfileProps {
  userId: number
  username: string
  role: string
}

interface Request {
  id: number
  software: {
    name: string
  }
  accessType: string
  status: string
  createdAt: string
}

export default function UserProfile({ userId, username, role }: UserProfileProps) {
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await getUserRequests(userId)
        setRequests(data)
      } catch (error) {
        console.error("Failed to load requests:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [userId])

  async function handleLogout() {
    await logout()
    router.push("/")
    router.refresh()
  }

  function handleBackToDashboard() {
    if (role === "Admin") {
      router.push("/admin/dashboard")
    } else if (role === "Manager") {
      router.push("/manager/dashboard")
    } else {
      router.push("/employee/dashboard")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="text-lg">{username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-lg">{role}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Request History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-10">
              <p>You haven&apos;t made any access requests yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{request.software.name}</h3>
                      <p className="text-sm text-gray-500">
                        Access Type: {request.accessType} • Requested on{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          request.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
