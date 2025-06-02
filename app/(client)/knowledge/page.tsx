"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, Calendar, Tag, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"

// Fallback data in case API fails
const fallbackArticles = [
  {
    id: "1",
    title: "How to Reset Your Password",
    content: "Step-by-step guide to reset your account password",
    category: "Account Management",
    tags: ["password", "account", "security"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    publishedAt: "2024-01-15T10:30:00Z",
    authorId: "admin",
    views: 1245,
  },
  {
    id: "2",
    title: "VPN Setup Guide",
    content: "Complete guide to setting up VPN on various devices",
    category: "Network",
    tags: ["vpn", "network", "security"],
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
    publishedAt: "2024-01-14T09:15:00Z",
    authorId: "admin",
    views: 982,
  },
  {
    id: "3",
    title: "Email Configuration on Mobile",
    content: "How to configure your work email on mobile devices",
    category: "Email",
    tags: ["email", "mobile", "configuration"],
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z",
    publishedAt: "2024-01-13T14:20:00Z",
    authorId: "admin",
    views: 876,
  },
]

interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  authorId: string
  views?: number
}

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    fetchPublishedArticles()
  }, [])

  const fetchPublishedArticles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setUsingFallback(false)

      // Add cache-busting query parameter
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/knowledge?published=true&t=${timestamp}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        console.warn(`API returned status: ${response.status}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.warn(`Invalid content type: ${contentType}`)
        throw new Error("Response is not JSON")
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        setArticles(data)
      } else {
        console.warn("API returned non-array data:", data)
        throw new Error("Invalid data format")
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      setError("Failed to load articles from the server. Showing sample content instead.")

      // Use fallback data
      setArticles(fallbackArticles)
      setUsingFallback(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter articles based on search term and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get unique categories from articles
  const categories = Array.from(new Set(articles.map((article) => article.category)))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getExcerpt = (content: string, maxLength = 150) => {
    const plainText = content.replace(/[#*`]/g, "").replace(/\n/g, " ")
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Knowledge Base</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of our services.
          </p>
        </div>

        {/* Error notification if using fallback */}
        {usingFallback && (
          <div className="max-w-4xl mx-auto mb-8 bg-amber-50 border border-amber-200 rounded-md p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
            <div className="text-amber-800 text-sm">
              {error}
              <Button
                variant="link"
                className="text-amber-800 underline p-0 h-auto ml-2"
                onClick={fetchPublishedArticles}
              >
                Try again
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Articles Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedCategory !== "all" ? "No articles found" : "No articles available"}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Check back later for new content"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        {article.views && (
                          <>
                            <Calendar className="h-3 w-3 mr-1" />
                            {article.views} views
                          </>
                        )}
                        {!article.views && (
                          <>
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(article.publishedAt)}
                          </>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{getExcerpt(article.content)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {article.tags.length > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Tag className="h-3 w-3 mr-1" />
                            <span>{article.tags.length} tags</span>
                          </div>
                        )}
                      </div>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/knowledge/${article.id}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {articles.length > 0 && (
          <div className="text-center mt-12 text-gray-600">
            <p>
              Showing {filteredArticles.length} of {articles.length} articles
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
