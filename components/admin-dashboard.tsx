"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logout } from "@/lib/auth-actions"
import { useRouter } from "next/navigation"
import SoftwareList from "@/components/software-list"
import UserList from "@/components/user-list"
import RequestList from "@/components/request-list" // Import RequestList component

interface AdminDashboardProps {
  userId: number
}

export default function AdminDashboard({  }: AdminDashboardProps) {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="software">Software Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="requests">Access Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="software" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Software List</h2>
            <Button asChild>
              <Link href="/admin/create-software">Add New Software</Link>
            </Button>
          </div>
          <SoftwareList />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <UserList />
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Access Requests</h2>
          <RequestList isAdmin={true} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
