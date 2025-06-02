"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Workflow, Play, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AutomationFlow {
  id: string
  name: string
  description: string
  trigger: string
  status: "active" | "inactive" | "error"
  lastRun?: Date
  nextRun?: Date
  webhookUrl?: string
}

export default function AutomationPage() {
  const { toast } = useToast()
  const [flows, setFlows] = useState<AutomationFlow[]>([
    {
      id: "1",
      name: "New Ticket Notification",
      description: "Send email notification when a new ticket is created",
      trigger: "Ticket Created",
      status: "active",
      lastRun: new Date(Date.now() - 1000 * 60 * 30),
      webhookUrl: process.env.POWER_AUTOMATE_WEBHOOK_URL,
    },
    {
      id: "2",
      name: "Ticket Assignment",
      description: "Auto-assign tickets based on category and workload",
      trigger: "Ticket Created",
      status: "active",
      lastRun: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "3",
      name: "SLA Reminder",
      description: "Send reminder when tickets approach SLA deadline",
      trigger: "Scheduled",
      status: "inactive",
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 2),
    },
  ])

  const [newFlow, setNewFlow] = useState({
    name: "",
    description: "",
    trigger: "",
    webhookUrl: "",
  })

  const toggleFlowStatus = (id: string) => {
    setFlows(
      flows.map((flow) =>
        flow.id === id ? { ...flow, status: flow.status === "active" ? "inactive" : ("active" as const) } : flow,
      ),
    )
    toast({
      title: "Flow Updated",
      description: "Automation flow status has been updated.",
    })
  }

  const testWebhook = async () => {
    try {
      const response = await fetch("/api/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      })

      if (response.ok) {
        toast({
          title: "Webhook Test Successful",
          description: "Power Automate webhook is working correctly.",
        })
      }
    } catch (error) {
      toast({
        title: "Webhook Test Failed",
        description: "Could not connect to Power Automate webhook.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automation</h1>
        <p className="text-muted-foreground">Manage Power Automate workflows and integrations.</p>
      </div>

      <Tabs defaultValue="flows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flows">Automation Flows</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="flows" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Flows</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Flow
            </Button>
          </div>

          <div className="grid gap-4">
            {flows.map((flow) => (
              <Card key={flow.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <Workflow className="h-5 w-5" />
                    <CardTitle className="text-lg">{flow.name}</CardTitle>
                    <Badge variant={flow.status === "active" ? "default" : "secondary"}>{flow.status}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={flow.status === "active"} onCheckedChange={() => toggleFlowStatus(flow.id)} />
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{flow.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span>
                        <strong>Trigger:</strong> {flow.trigger}
                      </span>
                      {flow.lastRun && (
                        <span>
                          <strong>Last Run:</strong> {flow.lastRun.toLocaleString()}
                        </span>
                      )}
                      {flow.nextRun && (
                        <span>
                          <strong>Next Run:</strong> {flow.nextRun.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Test Run
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Power Automate Webhooks</CardTitle>
              <CardDescription>Configure webhook endpoints for Power Automate integration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="ticket-webhook">Ticket Submission Webhook</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="ticket-webhook"
                      value={process.env.POWER_AUTOMATE_WEBHOOK_URL || ""}
                      placeholder="https://prod-xx.westus.logic.azure.com:443/workflows/..."
                      readOnly
                    />
                    <Button onClick={testWebhook}>Test</Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="search-webhook">Search Webhook</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="search-webhook"
                      value={process.env.POWER_AUTOMATE_SEARCH_WEBHOOK_URL || ""}
                      placeholder="https://prod-xx.westus.logic.azure.com:443/workflows/..."
                      readOnly
                    />
                    <Button>Test</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure global automation preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Automatic Ticket Assignment</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign tickets based on category and workload
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Send SLA Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications when tickets approach SLA deadlines
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-close Resolved Tickets</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically close tickets after 7 days in resolved status
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
