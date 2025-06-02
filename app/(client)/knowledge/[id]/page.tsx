"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"

// Fallback article data
const fallbackArticles = {
  "1": {
    id: "1",
    title: "How to Reset Your Password",
    content:
      "## Password Reset Instructions\n\nFollow these steps to reset your password:\n\n1. Click on the 'Forgot Password' link on the login page\n2. Enter your email address\n3. Check your email for a reset link\n4. Click the link and enter your new password\n5. Log in with your new password",
    category: "Account Management",
    tags: ["password", "account", "security"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    publishedAt: "2024-01-15T10:30:00Z",
    authorId: "admin",
  },
  "2": {
    id: "2",
    title: "VPN Setup Guide",
    content:
      "## VPN Configuration\n\nThis guide will help you set up VPN access:\n\n1. Download the VPN client from the downloads section\n2. Install the client on your device\n3. Open the application and enter your credentials\n4. Select the appropriate server location\n5. Click Connect to establish a secure connection",
    category: "Network",
    tags: ["vpn", "network", "security"],
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
    publishedAt: "2024-01-14T09:15:00Z",
    authorId: "admin",
  },
  "3": {
    id: "3",
    title: "Email Configuration on Mobile",
    content:
      "## Mobile Email Setup\n\nConfigure your work email on your mobile device:\n\n1. Open the email app on your device\n2. Select 'Add Account'\n3. Choose 'Exchange' or 'Office 365'\n4. Enter your email address and password\n5. Accept the server settings\n6. Choose which data to sync (email, contacts, calendar)",
    category: "Email",
    tags: ["email", "mobile", "configuration"],
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z",
    publishedAt: "2024-01-13T14:20:00Z",
    authorId: "admin",
  },
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!params.id) return

    const fetchArticle = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Try to fetch from API
        const response = await fetch(`/api/knowledge/${params.id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setArticle(data)
      } catch (error) {
        console.error("Error fetching article:", error)

        // Use fallback data if available
        if (fallbackArticles[params.id]) {
          setArticle(fallbackArticles[params.id])
          setError("Using cached version of this article.")
        } else {
          setError("Failed to load article. It may have been moved or deleted.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Simple markdown renderer
  const renderMarkdown = (content) => {
    if (!content) return ""

    // Convert headers
    let html = content
      .replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/# (.*?)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')

    // Convert lists
    html = html.replace(/^\d+\. (.*?)$/gm, '<li class="ml-6 list-decimal">$1</li>')
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-6 list-disc">$1</li>')

    // Convert paragraphs (any line that's not a header or list item)
    html = html.replace(/^(?!<h|<li)(.*?)$/gm, '<p class="my-3">$1</p>')

    // Group list items
    html = html.replace(/(<li.*?>.*?<\/li>)\n(<li.*?>.*?<\/li>)/g, "$1$2")
    html = html.replace(/(<li class="ml-6 list-decimal">.*?<\/li>)+/g, '<ol class="my-4">$&</ol>')
    html = html.replace(/(<li class="ml-6 list-disc">.*?<\/li>)+/g, '<ul class="my-4">$&</ul>')

    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

    return html
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-6">{error}</p>
          <Button asChild>
            <Link href="/knowledge">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/knowledge">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/knowledge">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>

        {/* Error notification if using fallback */}
        {error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-amber-800 text-sm">{error}</p>
          </div>
        )}

        {/* Article header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{article.category}</Badge>
            <div className="text-sm text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(article.updatedAt)}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Article content */}
        <Card className="p-6">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }} />
        </Card>
      </div>
    </div>
  )
}
