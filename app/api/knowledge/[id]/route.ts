import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { KnowledgeArticle } from "../route"

const dbPath = path.join(process.cwd(), "data", "knowledge-articles.json")

async function getArticles(): Promise<KnowledgeArticle[]> {
  try {
    const data = await fs.readFile(dbPath, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveArticles(articles: KnowledgeArticle[]) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true })
  await fs.writeFile(dbPath, JSON.stringify(articles, null, 2))
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const articles = await getArticles()
    const article = articles.find((a) => a.id === id)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, content, category, tags, publishedAt } = body

    const articles = await getArticles()
    const articleIndex = articles.findIndex((a) => a.id === id)

    if (articleIndex === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    articles[articleIndex] = {
      ...articles[articleIndex],
      title,
      content,
      category,
      tags: tags || [],
      updatedAt: new Date().toISOString(),
      publishedAt: publishedAt ? new Date().toISOString() : null,
    }

    await saveArticles(articles)
    return NextResponse.json(articles[articleIndex])
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const articles = await getArticles()
    const filteredArticles = articles.filter((a) => a.id !== id)

    if (filteredArticles.length === articles.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    await saveArticles(filteredArticles)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
