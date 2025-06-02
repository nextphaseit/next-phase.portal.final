"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle, AlertCircle, X } from "lucide-react"
import type { PowerAutomateResponse } from "@/types/sharepoint"

const issueCategories = [
  "Hardware Issues",
  "Software Problems",
  "Network Connectivity",
  "Email & Communication",
  "Security & Access",
  "Printer & Peripherals",
  "Mobile Device Support",
  "Other",
]

export function TicketSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<PowerAutomateResponse | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    issueCategory: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.issueCategory) {
      newErrors.issueCategory = "Please select an issue category"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024) // 10MB limit

    if (files.length !== validFiles.length) {
      setErrors((prev) => ({ ...prev, files: "Some files exceed the 10MB limit" }))
    } else {
      setErrors((prev) => ({ ...prev, files: "" }))
    }

    setSelectedFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("fullName", formData.fullName)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("issueCategory", formData.issueCategory)
      formDataToSend.append("description", formData.description)

      selectedFiles.forEach((file) => {
        formDataToSend.append("attachments", file)
      })

      const response = await fetch("/api/tickets/submit", {
        method: "POST",
        body: formDataToSend,
      })

      const result: PowerAutomateResponse = await response.json()
      setSubmitResult(result)

      if (result.success) {
        // Reset form on success
        setFormData({
          fullName: "",
          email: "",
          issueCategory: "",
          description: "",
        })
        setSelectedFiles([])
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Network error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-brand-blue/10 rounded-lg">
            <Upload className="h-5 w-5 text-brand-blue" />
          </div>
          Submit Support Ticket
        </CardTitle>
        <CardDescription>
          Fill out the form below to submit a new support request. Our NextPhase IT team will respond within 4 business
          hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitResult && (
          <Alert
            className={`mb-6 ${submitResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <div className="flex items-center gap-2">
              {submitResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={submitResult.success ? "text-green-800" : "text-red-800"}>
                {submitResult.message}
                {submitResult.success && submitResult.ticketReference && (
                  <span className="block font-medium mt-1">Ticket Reference: {submitResult.ticketReference}</span>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                className={errors.fullName ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={errors.email ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueCategory">Issue Category *</Label>
            <Select
              value={formData.issueCategory}
              onValueChange={(value) => handleInputChange("issueCategory", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.issueCategory ? "border-red-500" : ""}>
                <SelectValue placeholder="Select the category that best describes your issue" />
              </SelectTrigger>
              <SelectContent>
                {issueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.issueCategory && <p className="text-sm text-red-600">{errors.issueCategory}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Please provide a detailed description of your issue, including any error messages and steps to reproduce the problem..."
              className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            <p className="text-sm text-muted-foreground">
              Minimum 10 characters. Be as specific as possible to help us resolve your issue quickly.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">File Attachments (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              <input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.zip"
                disabled={isSubmitting}
              />
              <label htmlFor="attachments" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload files</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, Word, Images, or ZIP files (max 10MB each)</p>
              </label>
            </div>
            {errors.files && <p className="text-sm text-red-600">{errors.files}</p>}

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files:</p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium truncate max-w-[200px]">{file.name}</div>
                      <div className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Ticket...
              </>
            ) : (
              "Submit Support Ticket"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
