"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPendingRequests, updateRequestStatus } from "@/lib/request-actions"

interface RequestListProps {
  isAdmin?: boolean
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
  status: string
  createdAt: string
}

export default function RequestList({ isAdmin = false }: RequestListProps) {
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

  if (loading) {
    return <div className="text-center py-10">Loading requests...</div>
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p>No pending requests to review.</p>
      </div>
    )
  }

  return (
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
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Reason:</h4>
                <p>{request.reason}</p>
              </div>

              {isAdmin && (
                <div className="flex justify-end space-x-2">
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
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
