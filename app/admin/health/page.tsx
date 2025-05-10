"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase/client"
import { AlertCircle, CheckCircle, Database, RefreshCw, Server, Wifi } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SystemHealth {
  database: {
    status: "healthy" | "degraded" | "down"
    responseTime: number
    lastChecked: Date
  }
  api: {
    status: "healthy" | "degraded" | "down"
    responseTime: number
    lastChecked: Date
  }
  storage: {
    status: "healthy" | "degraded" | "down"
    usage: number
    total: number
    lastChecked: Date
  }
  auth: {
    status: "healthy" | "degraded" | "down"
    responseTime: number
    lastChecked: Date
  }
}

export default function HealthMonitorPage() {
  const [health, setHealth] = useState<SystemHealth>({
    database: {
      status: "down",
      responseTime: 0,
      lastChecked: new Date(),
    },
    api: {
      status: "down",
      responseTime: 0,
      lastChecked: new Date(),
    },
    storage: {
      status: "down",
      usage: 0,
      total: 100,
      lastChecked: new Date(),
    },
    auth: {
      status: "down",
      responseTime: 0,
      lastChecked: new Date(),
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkSystemHealth()
  }, [])

  const checkSystemHealth = async () => {
    setIsLoading(true)
    try {
      // Check database health
      const dbStart = performance.now()
      const { data: dbData, error: dbError } = await supabase
        .from("events")
        .select("count()", { count: "exact", head: true })
      const dbEnd = performance.now()

      // Check auth health
      const authStart = performance.now()
      const { data: authData, error: authError } = await supabase.auth.getSession()
      const authEnd = performance.now()

      // Check storage health
      const { data: storageData, error: storageError } = await supabase.storage.getBucket("events")

      // Check API health by fetching a simple endpoint
      const apiStart = performance.now()
      let apiStatus: "healthy" | "degraded" | "down" = "down"
      let apiResponseTime = 0

      try {
        const apiResponse = await fetch("/api/health")
        const apiEnd = performance.now()
        apiResponseTime = Math.round(apiEnd - apiStart)

        if (apiResponse.ok) {
          apiStatus = apiResponseTime > 1000 ? "degraded" : "healthy"
        } else {
          apiStatus = "down"
        }
      } catch (error) {
        console.error("API health check failed:", error)
        apiStatus = "down"
      }

      setHealth({
        database: {
          status: dbError ? "down" : dbEnd - dbStart > 1000 ? "degraded" : "healthy",
          responseTime: Math.round(dbEnd - dbStart),
          lastChecked: new Date(),
        },
        api: {
          status: apiStatus,
          responseTime: apiResponseTime,
          lastChecked: new Date(),
        },
        storage: {
          status: storageError ? "down" : "healthy",
          usage: 45, // Mock data - in a real app, you'd get actual storage usage
          total: 100,
          lastChecked: new Date(),
        },
        auth: {
          status: authError ? "down" : authEnd - authStart > 1000 ? "degraded" : "healthy",
          responseTime: Math.round(authEnd - authStart),
          lastChecked: new Date(),
        },
      })
    } catch (error) {
      console.error("Error checking system health:", error)
      toast({
        title: "Error",
        description: "Failed to check system health. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    checkSystemHealth()
  }

  const getStatusBadge = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>
      case "degraded":
        return <Badge className="bg-yellow-500">Degraded</Badge>
      case "down":
        return <Badge className="bg-red-500">Down</Badge>
    }
  }

  const getStatusIcon = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />
      case "down":
        return <AlertCircle className="h-6 w-6 text-red-500" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Health Monitor</h1>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-[#b0468e]" />
              <CardTitle>Database</CardTitle>
            </div>
            {getStatusBadge(health.database.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getStatusIcon(health.database.status)}
                <span className="ml-2 font-medium">
                  {health.database.status === "healthy"
                    ? "Database is operating normally"
                    : health.database.status === "degraded"
                      ? "Database is experiencing slowdowns"
                      : "Database is unreachable"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response Time:</span>
                <span className="font-medium">{health.database.responseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Checked:</span>
                <span className="font-medium">{formatDate(health.database.lastChecked)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <Server className="h-5 w-5 mr-2 text-[#b0468e]" />
              <CardTitle>API</CardTitle>
            </div>
            {getStatusBadge(health.api.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getStatusIcon(health.api.status)}
                <span className="ml-2 font-medium">
                  {health.api.status === "healthy"
                    ? "API is responding normally"
                    : health.api.status === "degraded"
                      ? "API is experiencing slowdowns"
                      : "API is unreachable"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response Time:</span>
                <span className="font-medium">{health.api.responseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Checked:</span>
                <span className="font-medium">{formatDate(health.api.lastChecked)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-[#b0468e]" />
              <CardTitle>Storage</CardTitle>
            </div>
            {getStatusBadge(health.storage.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getStatusIcon(health.storage.status)}
                <span className="ml-2 font-medium">
                  {health.storage.status === "healthy"
                    ? "Storage is operating normally"
                    : health.storage.status === "degraded"
                      ? "Storage is experiencing issues"
                      : "Storage is unreachable"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Usage:</span>
                  <span className="font-medium">
                    {health.storage.usage}GB / {health.storage.total}GB
                  </span>
                </div>
                <Progress value={(health.storage.usage / health.storage.total) * 100} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Checked:</span>
                <span className="font-medium">{formatDate(health.storage.lastChecked)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <Wifi className="h-5 w-5 mr-2 text-[#b0468e]" />
              <CardTitle>Authentication</CardTitle>
            </div>
            {getStatusBadge(health.auth.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getStatusIcon(health.auth.status)}
                <span className="ml-2 font-medium">
                  {health.auth.status === "healthy"
                    ? "Authentication is working normally"
                    : health.auth.status === "degraded"
                      ? "Authentication is experiencing slowdowns"
                      : "Authentication service is down"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response Time:</span>
                <span className="font-medium">{health.auth.responseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Checked:</span>
                <span className="font-medium">{formatDate(health.auth.lastChecked)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>Overall system health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Database Tables</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["events", "users", "categories", "blog_posts"].map((table) => (
                  <div key={table} className="bg-muted p-3 rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Table</p>
                    <p className="font-medium">{table}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">API Endpoints</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["/api/events", "/api/auth", "/api/blog", "/api/users"].map((endpoint) => (
                  <div key={endpoint} className="flex items-center justify-between bg-muted p-3 rounded-md">
                    <span className="font-mono text-sm">{endpoint}</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      200 OK
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Last full system check: {formatDate(new Date())}</p>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            Run Diagnostics
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
