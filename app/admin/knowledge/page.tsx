"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, FileText, Calendar, Tag } from "lucide-react"
import { KnowledgeArticleForm } from "@/components/admin/knowledge-article-form"
import { KnowledgeArticlePreview } from "@/components/admin/knowledge-article-preview"
import { useToast } from "@/components/ui/use-toast"
import type { KnowledgeArticle } from "@/types"

export default function AdminKnowledgeBasePage() {
  const { toast } = useToast()
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<KnowledgeArticle | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/knowledge")
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      } else {
        throw new Error("Failed to fetch articles")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter articles based on search term, category, and publication status
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && article.publishedAt) ||
      (activeTab === "drafts" && !article.publishedAt)

    return matchesSearch && matchesCategory && matchesTab
  })

  // Get unique categories from articles
  const categories = Array.from(new Set(articles.map((article) => article.category)))

  // Handle article creation/update
  const handleSaveArticle = async (article: KnowledgeArticle) => {
    try {
      const isEditing = !!article.id
      const url = isEditing ? `/api/knowledge/${article.id}` : "/api/knowledge"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          category: article.category,
          tags: article.tags,
          publishedAt: article.publishedAt,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Article ${isEditing ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        fetchArticles()
      } else {
        throw new Error("Failed to save article")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      })
    }
  }

  // Handle article deletion
  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        })
        fetchArticles()
      } else {
        throw new Error("Failed to delete article")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    }
  }

  // Handle article publishing/unpublishing
  const handlePublishArticle = async (id: string, publish: boolean) => {
    try {
      const article = articles.find((a) => a.id === id)
      if (!article) return

      const response = await fetch(`/api/knowledge/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...article,
          publishedAt: publish ? new Date().toISOString() : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Article ${publish ? "published" : "unpublished"} successfully`,
        })
        fetchArticles()
      } else {
        throw new Error("Failed to update article")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
      })
    }
  }

  // Format date for display
  const formatDate = (date: Date | string | null) => {
    if (!date) return "—"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage knowledge base articles and resources.</p>
        </div>
        <Button
          onClick={() => {
            setCurrentArticle(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Article
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Articles</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:w-[180px]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Articles</CardTitle>
              <CardDescription>
                Manage and organize your knowledge base content. {filteredArticles.length} articles found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No articles found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredArticles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>{article.category}</TableCell>
                          <TableCell>
                            {article.publishedAt ? (
                              <Badge variant="default">Published</Badge>
                            ) : (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(article.updatedAt)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentArticle(article)
                                    setIsPreviewOpen(true)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentArticle(article)
                                    setIsDialogOpen(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {article.publishedAt ? (
                                  <DropdownMenuItem onClick={() => handlePublishArticle(article.id, false)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Unpublish
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handlePublishArticle(article.id, true)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteArticle(article.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Articles</CardTitle>
              <CardDescription>Articles that are currently live on the knowledge base.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.length === 0 ? (
                  <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No published articles found</h3>
                    <p className="text-muted-foreground">Create and publish articles to see them here.</p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary">{article.category}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentArticle(article)
                                  setIsPreviewOpen(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentArticle(article)
                                  setIsDialogOpen(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePublishArticle(article.id, false)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Unpublish
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteArticle(article.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(article.publishedAt)}
                          </div>
                          <div className="flex items-center">
                            <Tag className="mr-1 h-3 w-3" />
                            {article.tags.length} tags
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Articles</CardTitle>
              <CardDescription>Articles that are still being worked on and not yet published.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.length === 0 ? (
                  <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No draft articles found</h3>
                    <p className="text-muted-foreground">Create new articles to see them here.</p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden border-dashed">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline">{article.category}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentArticle(article)
                                  setIsPreviewOpen(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setCurrentArticle(article)
                                  setIsDialogOpen(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePublishArticle(article.id, true)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteArticle(article.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            Last updated: {formatDate(article.updatedAt)}
                          </div>
                          <div className="flex items-center">
                            <Tag className="mr-1 h-3 w-3" />
                            {article.tags.length} tags
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Article Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentArticle ? "Edit Article" : "Create New Article"}</DialogTitle>
            <DialogDescription>
              {currentArticle
                ? "Make changes to the existing article."
                : "Fill in the details to create a new knowledge base article."}
            </DialogDescription>
          </DialogHeader>
          <KnowledgeArticleForm
            article={currentArticle}
            onSave={handleSaveArticle}
            onCancel={() => setIsDialogOpen(false)}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      {/* Article Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Article Preview</DialogTitle>
            <DialogDescription>Preview how the article will appear to users.</DialogDescription>
          </DialogHeader>
          {currentArticle && <KnowledgeArticlePreview article={currentArticle} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
