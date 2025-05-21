"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { createSoftware } from "@/lib/software-actions"

export default function CreateSoftwareForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [accessLevels, setAccessLevels] = useState({
    Read: true,
    Write: false,
    Admin: false,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    // Get selected access levels
    const selectedLevels = Object.entries(accessLevels)
      .filter(([, isSelected]) => isSelected)
      .map(([level]) => level)

    if (selectedLevels.length === 0) {
      setError("Please select at least one access level")
      setIsLoading(false)
      return
    }

    try {
      const result = await createSoftware(name, description, selectedLevels)

      if (result.success) {
        router.push("/admin/dashboard")
        router.refresh()
      } else {
        setError(result.error || "Failed to create software")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Software</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Software Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} required />
          </div>
          <div className="space-y-2">
            <Label>Access Levels</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="read"
                  checked={accessLevels.Read}
                  onCheckedChange={(checked) => setAccessLevels({ ...accessLevels, Read: checked === true })}
                />
                <Label htmlFor="read" className="font-normal">
                  Read
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="write"
                  checked={accessLevels.Write}
                  onCheckedChange={(checked) => setAccessLevels({ ...accessLevels, Write: checked === true })}
                />
                <Label htmlFor="write" className="font-normal">
                  Write
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="admin"
                  checked={accessLevels.Admin}
                  onCheckedChange={(checked) => setAccessLevels({ ...accessLevels, Admin: checked === true })}
                />
                <Label htmlFor="admin" className="font-normal">
                  Admin
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Software"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
