"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { logout } from "@/lib/auth-actions"
import { getPendingRequests, updateRequestStatus } from "@/lib/request-actions"
import Link from "next/link"

interface ManagerDashboardProps {
  userId: number
}

interface Request {
  id: number
  user: {
    username: string
  }
  software: {
    name: string
  }
  accessType: string
  reason: string
  createdAt: string
}

export default function ManagerDashboard({  }: ManagerDashboardProps) {
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    try {
      const data = await getPendingRequests()
    // Convert Date objects to strings
    const formattedRequests = data.map(request => ({
      ...request,
      createdAt: request.createdAt instanceof Date 
        ? request.createdAt.toISOString() 
        : String(request.createdAt)
    }))
    setRequests(formattedRequests)
    } catch (error) {
      console.error("Failed to load requests:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await logout()
    router.push("/")
    router.refresh()
  }

  async function handleUpdateStatus(requestId: number, status: "Approved" | "Rejected") {
    setProcessingId(requestId)

    try {
      const result = await updateRequestStatus(requestId, status)

      if (result.success) {
        // Remove the request from the list
        setRequests(requests.filter((req) => req.id !== requestId))
      }
    } catch (error) {
      console.error("Failed to update request:", error)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/profile">Profile</Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Access Requests</h2>

        {loading ? (
          <div className="text-center py-10">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p>No pending requests to review.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <CardTitle>
                    {request.user.username} requested access to {request.software.name}
                  </CardTitle>
                  <CardDescription>
                    Access Type: {request.accessType} • Requested on {new Date(request.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Reason:</h4>
                    <p>{request.reason}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(request.id, "Rejected")}
                    disabled={processingId === request.id}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(request.id, "Approved")}
                    disabled={processingId === request.id}
                  >
                    Approve
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
