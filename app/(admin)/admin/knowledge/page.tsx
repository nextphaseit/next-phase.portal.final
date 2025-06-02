"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { KnowledgeArticleForm } from "@/components/admin/knowledge-article-form"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, FileText } from "lucide-react"

interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  authorId: string
}

export default function AdminKnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null)

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
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateArticle = async (articleData: Partial<KnowledgeArticle>) => {
    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      })

      if (response.ok) {
        const newArticle = await response.json()
        setArticles([newArticle, ...articles])
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating article:", error)
    }
  }

  const handleUpdateArticle = async (id: string, articleData: Partial<KnowledgeArticle>) => {
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      })

      if (response.ok) {
        const updatedArticle = await response.json()
        setArticles(articles.map((article) => (article.id === id ? updatedArticle : article)))
        setIsDialogOpen(false)
        setEditingArticle(null)
      }
    } catch (error) {
      console.error("Error updating article:", error)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setArticles(articles.filter((article) => article.id !== id))
      }
    } catch (error) {
      console.error("Error deleting article:", error)
    }
  }

  const handleTogglePublish = async (article: KnowledgeArticle) => {
    const updatedData = {
      ...article,
      publishedAt: article.publishedAt ? null : new Date().toISOString(),
    }

    await handleUpdateArticle(article.id, updatedData)
  }

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Separate published and draft articles
  const publishedArticles = filteredArticles.filter((article) => article.publishedAt)
  const draftArticles = filteredArticles.filter((article) => !article.publishedAt)

  // Get unique categories
  const categories = Array.from(new Set(articles.map((article) => article.category)))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const ArticleRow = ({ article }: { article: KnowledgeArticle }) => (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{article.title}</div>
          <div className="text-sm text-muted-foreground">{article.category}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {article.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{article.tags.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={article.publishedAt ? "default" : "secondary"}>
          {article.publishedAt ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{formatDate(article.updatedAt)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingArticle(article)
                setIsDialogOpen(true)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTogglePublish(article)}>
              <Eye className="mr-2 h-4 w-4" />
              {article.publishedAt ? "Unpublish" : "Publish"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteArticle(article.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage articles and documentation for your help desk.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingArticle(null)}>
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Edit Article" : "Create New Article"}</DialogTitle>
            </DialogHeader>
            <KnowledgeArticleForm
              article={editingArticle}
              onSubmit={editingArticle ? (data) => handleUpdateArticle(editingArticle.id, data) : handleCreateArticle}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingArticle(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedArticles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftArticles.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Articles ({filteredArticles.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({publishedArticles.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftArticles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No articles found. Create your first article to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => <ArticleRow key={article.id} article={article} />)
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="published">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publishedArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No published articles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  publishedArticles.map((article) => <ArticleRow key={article.id} article={article} />)
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No draft articles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  draftArticles.map((article) => <ArticleRow key={article.id} article={article} />)
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
