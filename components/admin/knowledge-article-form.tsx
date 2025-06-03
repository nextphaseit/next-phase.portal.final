"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { KnowledgeArticle } from "@/types"

interface KnowledgeArticleFormProps {
  article?: KnowledgeArticle | null
  onSave: (article: KnowledgeArticle) => void
  onCancel: () => void
  categories: string[]
}

export function KnowledgeArticleForm({ article, onSave, onCancel, categories }: KnowledgeArticleFormProps) {
  const [formData, setFormData] = useState<Partial<KnowledgeArticle>>({
    title: "",
    content: "",
    category: "",
    tags: [],
    publishedAt: null,
  })
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (article) {
      setFormData({
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags,
        publishedAt: article.publishedAt,
        authorId: article.authorId,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      })
    } else {
      setFormData({
        title: "",
        content: "",
        category: "",
        tags: [],
        publishedAt: null,
      })
    }
  }, [article])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure required fields are present
    if (!formData.title || !formData.content || !formData.category) {
      return
    }

    // Create the article with proper type handling
    const articleToSave: KnowledgeArticle = {
      id: formData.id || crypto.randomUUID(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags || [],
      publishedAt: formData.publishedAt || null,
      authorId: formData.authorId || "current-user",
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(articleToSave)
  }

  const addTag = () => {
    if (newTag.trim() && formData.tags && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((tag) => tag !== tagToRemove),
    })
  }

  const togglePublished = (published: boolean) => {
    setFormData({
      ...formData,
      publishedAt: published ? new Date().toISOString() : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title *
        </label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter article title"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category *
        </label>
        <Select
          value={formData.category || ""}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Account Management">Account Management</SelectItem>
            <SelectItem value="Network">Network</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Software">Software</SelectItem>
            <SelectItem value="Hardware">Hardware</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Troubleshooting">Troubleshooting</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content *
        </label>
        <Textarea
          id="content"
          value={formData.content || ""}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your article content using Markdown..."
          className="min-h-[300px] font-mono"
          required
        />
        <p className="text-xs text-muted-foreground">You can use Markdown formatting (headings, lists, links, etc.)</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTag()
              }
            }}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch checked={!!formData.publishedAt} onCheckedChange={togglePublished} />
        <label className="text-sm font-medium">Publish article (make visible to users)</label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">{article ? "Update Article" : "Create Article"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
