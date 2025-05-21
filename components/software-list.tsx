"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSoftwareList } from "@/lib/software-actions"

interface Software {
  id: number
  name: string
  description: string
  accessLevels: string[]
}

export default function SoftwareList() {
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div className="text-center py-10">Loading software...</div>
  }

  if (software.length === 0) {
    return <div className="text-center py-10">No software found. Add some software to get started.</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {software.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="mb-2 text-sm font-medium">Access Levels:</h4>
              <div className="flex flex-wrap gap-2">
                {item.accessLevels.map((level) => (
                  <Badge key={level} variant="outline">
                    {level}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
