"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logout } from "@/lib/auth-actions"
import { useRouter } from "next/navigation"
import SoftwareList from "@/components/software-list"
import { getUserRequests } from "@/lib/request-actions"

interface EmployeeDashboardProps {
  userId: number
  username: string
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

export default function EmployeeDashboard({ userId, username }: EmployeeDashboardProps) {
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRequests() {
      try {
      const data = await getUserRequests(userId)
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

    loadRequests()
  }, [userId])

  async function handleLogout() {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-500">Welcome, {username}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/profile">Profile</Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="software">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="software">Available Software</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="software" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Software List</h2>
            <Button asChild>
              <Link href="/employee/request-access">Request Access</Link>
            </Button>
          </div>
          <SoftwareList />
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">My Access Requests</h2>
          {loading ? (
            <div className="text-center py-10">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-10">
              <p>You haven&apos;t made any access requests yet.</p>
              <Button asChild className="mt-4">
                <Link href="/employee/request-access">Request Access</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle>{request.software.name}</CardTitle>
                    <CardDescription>Access Type: {request.accessType}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Requested on {new Date(request.createdAt).toLocaleDateString()}
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
