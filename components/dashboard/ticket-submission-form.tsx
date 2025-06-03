"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Send, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TicketFormData {
  fullName: string
  email: string
  issueCategory: string
  description: string
  priority: "low" | "medium" | "high"
  department?: string
}

export function TicketSubmissionForm() {
  const [formData, setFormData] = useState<TicketFormData>({
    fullName: "",
    email: "",
    issueCategory: "",
    description: "",
    priority: "medium",
    department: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [ticketReference, setTicketReference] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create form data for submission
      const submissionData = {
        ...formData,
        submissionDate: new Date().toISOString(), // Convert Date to string
        attachments: files.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(), // Convert Date to string
        })),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate ticket reference
      const reference = `TKT-${Date.now().toString().slice(-6)}`
      setTicketReference(reference)
      setIsSubmitted(true)

      toast({
        title: "Ticket Submitted Successfully",
        description: `Your ticket reference is ${reference}`,
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="text-lg font-semibold">Ticket Submitted Successfully!</h3>
            <p className="text-muted-foreground">
              Your ticket reference number is: <strong>{ticketReference}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly. You can track your ticket status using the reference
              number.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  fullName: "",
                  email: "",
                  issueCategory: "",
                  description: "",
                  priority: "medium",
                  department: "",
                })
                setFiles([])
              }}
            >
              Submit Another Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Support Ticket</CardTitle>
        <CardDescription>Describe your issue and we'll get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Issue Category</Label>
              <Select
                value={formData.issueCategory}
                onValueChange={(value) => setFormData({ ...formData, issueCategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Issues</SelectItem>
                  <SelectItem value="network">Network Problems</SelectItem>
                  <SelectItem value="software">Software Installation</SelectItem>
                  <SelectItem value="hardware">Hardware Issues</SelectItem>
                  <SelectItem value="account">Account Access</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="department">Department (Optional)</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g., Sales, Marketing, Operations"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please describe your issue in detail..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="files">Attachments (Optional)</Label>
            <div className="mt-1">
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
            </div>
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Selected files:</p>
                <ul className="text-sm">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Upload className="h-3 w-3" />
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Alert>
            <AlertDescription>
              Your ticket will be reviewed by our support team. You'll receive an email confirmation with your ticket
              reference number.
            </AlertDescription>
          </Alert>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Ticket
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
