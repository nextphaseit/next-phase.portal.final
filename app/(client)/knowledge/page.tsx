"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Download, Eye } from "lucide-react"

const mockArticles = [
  {
    id: "1",
    title: "How to Reset Your Password",
    description: "Step-by-step guide to reset your account password",
    category: "Account Management",
    tags: ["password", "account", "security"],
    views: 1245,
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "VPN Setup Guide",
    description: "Complete guide to setting up VPN on various devices",
    category: "Network",
    tags: ["vpn", "network", "security"],
    views: 982,
    updatedAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Email Configuration on Mobile",
    description: "How to configure your work email on mobile devices",
    category: "Email",
    tags: ["email", "mobile", "configuration"],
    views: 876,
    updatedAt: "2024-01-13",
  },
  {
    id: "4",
    title: "Software Installation Requests",
    description: "How to request new software installations",
    category: "Software",
    tags: ["software", "installation", "requests"],
    views: 654,
    updatedAt: "2024-01-12",
  },
]

const mockDownloads = [
  {
    id: "1",
    title: "Employee IT Handbook",
    description: "Complete guide for all IT policies and procedures",
    type: "PDF",
    size: "2.4 MB",
    downloads: 432,
  },
  {
    id: "2",
    title: "VPN Client Software",
    description: "Official VPN client for secure remote access",
    type: "EXE",
    size: "15.2 MB",
    downloads: 289,
  },
  {
    id: "3",
    title: "Email Signature Template",
    description: "Standard email signature template for all employees",
    type: "DOCX",
    size: "45 KB",
    downloads: 567,
  },
]

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Account Management", "Network", "Email", "Software", "Hardware"]

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions and access helpful resources to resolve issues quickly.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles, guides, and resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{article.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="mr-1 h-3 w-3" />
                      {article.views}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Updated {article.updatedAt}</div>
                    <Button size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockDownloads.map((download) => (
              <Card key={download.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{download.type}</Badge>
                    <div className="text-sm text-muted-foreground">{download.size}</div>
                  </div>
                  <CardTitle className="text-lg">{download.title}</CardTitle>
                  <CardDescription>{download.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">{download.downloads} downloads</div>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Video tutorials coming soon</h3>
            <p className="text-muted-foreground">
              We're working on creating helpful video tutorials for common IT tasks.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
