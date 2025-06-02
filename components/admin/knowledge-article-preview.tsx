"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, User, Tag } from "lucide-react"
import type { KnowledgeArticle } from "@/types"

interface KnowledgeArticlePreviewProps {
  article: KnowledgeArticle
}

export function KnowledgeArticlePreview({ article }: KnowledgeArticlePreviewProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Simple markdown-to-HTML converter
  const renderMarkdown = (content: string) => {
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4 text-gray-900">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-10 mb-6 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-6 text-gray-900">$1</h1>')
      .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, "<br>")
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Article Header */}
      <div className="border-b pb-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{article.category}</Badge>
          {article.publishedAt ? <Badge variant="default">Published</Badge> : <Badge variant="outline">Draft</Badge>}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>

        <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {article.publishedAt
                ? `Published ${formatDate(article.publishedAt)}`
                : `Created ${formatDate(article.createdAt)}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>By {article.authorId}</span>
          </div>
          {article.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{article.tags.length} tags</span>
            </div>
          )}
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: `<p class="mb-4">${renderMarkdown(article.content)}</p>`,
          }}
          className="text-gray-700 leading-relaxed"
        />
      </div>
    </div>
  )
}
