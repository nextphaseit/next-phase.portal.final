"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { KnowledgeArticleForm } from "@/components/admin/knowledge-article-form"
import { KnowledgeArticlePreview } from "@/components/admin/knowledge-article-preview"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, FileText, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
  publishedAt?: string
  author: string
}

export default function AdminKnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null)
  const [previewArticle, setPreviewArticle] = useState<KnowledgeArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const categories = ["General", "Technical", "Billing", "Account", "Troubleshooting"]

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/knowledge?admin=true")
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      } else {
        // Fallback to sample data if API fails
        setArticles([
          {
            id: "1",
            title: "Getting Started with Our Platform",
            content: "# Getting Started\n\nWelcome to our platform! This guide will help you get started...",
            category: "General",
            tags: ["getting-started", "basics"],
            published: true,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
            publishedAt: "2024-01-15T10:00:00Z",
            author: "Admin",
          },
          {
            id: "2",
            title: "Troubleshooting Common Issues",
            content: "# Troubleshooting\n\nHere are solutions to common problems...",
            category: "Technical",
            tags: ["troubleshooting", "support"],
            published: false,
            createdAt: "2024-01-16T14:30:00Z",
            updatedAt: "2024-01-16T14:30:00Z",
            author: "Admin",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      toast({
        title: "Error",
        description: "Failed to fetch articles. Using sample data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveArticle = async (articleData: Omit<KnowledgeArticle, "id" | "createdAt" | "updatedAt">) => {
    try {
      const method = editingArticle ? "PUT" : "POST"
      const url = editingArticle ? `/api/knowledge/${editingArticle.id}` : "/api/knowledge"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      })

      if (response.ok) {
        const savedArticle = await response.json()

        if (editingArticle) {
          setArticles((prev) => prev.map((article) => (article.id === editingArticle.id ? savedArticle : article)))
          toast({
            title: "Success",
            description: "Article updated successfully!",
          })
        } else {
          setArticles((prev) => [...prev, savedArticle])
          toast({
            title: "Success",
            description: "Article created successfully!",
          })
        }

        setIsFormOpen(false)
        setEditingArticle(null)
      } else {
        throw new Error("Failed to save article")
      }
    } catch (error) {
      console.error("Error saving article:", error)
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setArticles((prev) => prev.filter((article) => article.id !== id))
        toast({
          title: "Success",
          description: "Article deleted successfully!",
        })
      } else {
        throw new Error("Failed to delete article")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const publishedArticles = filteredArticles.filter((article) => article.published)
  const draftArticles = filteredArticles.filter((article) => !article.published)

  const ArticleTable = ({ articles: tableArticles }: { articles: KnowledgeArticle[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableArticles.map((article) => (
          <TableRow key={article.id}>
            <TableCell className="font-medium">{article.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{article.category}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {article.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{article.tags.length - 2}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {article.published ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-700">Published</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-yellow-700">Draft</span>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>{new Date(article.updatedAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setPreviewArticle(article)
                      setIsPreviewOpen(true)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingArticle(article)
                      setIsFormOpen(true)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteArticle(article.id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage articles and documentation for your help desk</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingArticle(null)}>
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Edit Article" : "Create New Article"}</DialogTitle>
              <DialogDescription>
                {editingArticle
                  ? "Update the article information below."
                  : "Fill in the details to create a new knowledge base article."}
              </DialogDescription>
            </DialogHeader>
            <KnowledgeArticleForm
              article={editingArticle}
              onSave={handleSaveArticle}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingArticle(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{articles.filter((a) => a.published).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{articles.filter((a) => !a.published).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Badge className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(articles.map((a) => a.category)).size}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>Manage your knowledge base articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Articles ({filteredArticles.length})</TabsTrigger>
              <TabsTrigger value="published">Published ({publishedArticles.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftArticles.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <ArticleTable articles={filteredArticles} />
            </TabsContent>
            <TabsContent value="published" className="space-y-4">
              <ArticleTable articles={publishedArticles} />
            </TabsContent>
            <TabsContent value="drafts" className="space-y-4">
              <ArticleTable articles={draftArticles} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Article Preview</DialogTitle>
            <DialogDescription>Preview how this article will appear to users</DialogDescription>
          </DialogHeader>
          {previewArticle && <KnowledgeArticlePreview article={previewArticle} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
