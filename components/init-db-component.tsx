"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { initializeDatabase } from "@/lib/init-db"

export default function InitDbComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  async function handleInitDb() {
    setIsLoading(true)
    setResult(null)

    try {
      const initResult = await initializeDatabase()
      setResult(initResult)
    } catch  {
      setResult({ success: false, error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Initialize Database</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          This will create default users and sample software in the database. This operation is safe to run multiple
          times as it will only initialize the database if it&apos;s empty.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <h3 className="font-medium text-yellow-800">Default Users:</h3>
          <ul className="mt-2 space-y-1 text-sm text-yellow-700">
            <li>Admin: username = &quot;admin&quot;, password = &quot;admin123&quot;</li>
            <li>Manager: username = &quot;manager&quot;, password = &quot;manager123&quot;</li>
            <li>Employee: username = &quot;employee&quot;, password = &quot;employee123&quot;</li>
          </ul>
        </div>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            <AlertDescription>{result.message || result.error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleInitDb} disabled={isLoading}>
          {isLoading ? "Initializing..." : "Initialize Database"}
        </Button>
      </CardFooter>
    </Card>
  )
}
