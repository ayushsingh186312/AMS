"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSoftwareList } from "@/lib/software-actions"
import { createRequest } from "@/lib/request-actions"

interface Software {
  id: number
  name: string
  accessLevels: string[]
}

interface RequestAccessFormProps {
  userId: number
}

export default function RequestAccessForm({ userId }: RequestAccessFormProps) {
  const router = useRouter()
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null)
  const [accessType, setAccessType] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadSoftware() {
      try {
        const data = await getSoftwareList()
        setSoftware(data)
      } catch (error) {
        console.error("Failed to load software:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSoftware()
  }, [])

  function handleSoftwareChange(softwareId: string) {
    const selected = software.find((s) => s.id === Number.parseInt(softwareId))
    setSelectedSoftware(selected || null)
    setAccessType("")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedSoftware) {
      setError("Please select a software")
      return
    }

    if (!accessType) {
      setError("Please select an access type")
      return
    }

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const reason = formData.get("reason") as string

    try {
      const result = await createRequest(userId, selectedSoftware.id, accessType, reason)

      if (result.success) {
        router.push("/employee/dashboard")
        router.refresh()
      } else {
        setError(result.error || "Failed to submit request")
      }
    } catch  {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading software...</div>
  }

  if (software.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p>No software available to request access to.</p>
            <Button className="mt-4" onClick={() => router.push("/employee/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request Software Access</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="software">Software</Label>
            <Select onValueChange={handleSoftwareChange}>
              <SelectTrigger id="software">
                <SelectValue placeholder="Select software" />
              </SelectTrigger>
              <SelectContent>
                {software.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSoftware && (
            <div className="space-y-2">
              <Label htmlFor="accessType">Access Type</Label>
              <Select disabled={!selectedSoftware} onValueChange={setAccessType}>
                <SelectTrigger id="accessType">
                  <SelectValue placeholder="Select access type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSoftware.accessLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Request</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Please explain why you need access to this software"
              rows={4}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/employee/dashboard")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !selectedSoftware || !accessType}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
