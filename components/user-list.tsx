"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUserList } from "@/lib/user-actions"

interface User {
  id: number
  username: string
  role: string
  createdAt: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUserList()
        setUsers(data)
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Loading users...</div>
  }

  if (users.length === 0) {
    return <div className="text-center py-10">No users found.</div>
  }

  return (
    <div className="grid gap-6">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{user.username}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Badge variant={user.role === "Admin" ? "destructive" : user.role === "Manager" ? "default" : "outline"}>
                {user.role}
              </Badge>
              <span className="text-sm text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
