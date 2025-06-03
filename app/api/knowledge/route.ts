import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  authorId: string
}

const dbPath = path.join(process.cwd(), "data", "knowledge-articles.json")

async function ensureDbExists() {
  try {
    await fs.access(path.dirname(dbPath))
  } catch {
    await fs.mkdir(path.dirname(dbPath), { recursive: true })
  }

  try {
    await fs.access(dbPath)
  } catch {
    await fs.writeFile(dbPath, JSON.stringify([]))
  }
}

async function getArticles(): Promise<KnowledgeArticle[]> {
  await ensureDbExists()
  const data = await fs.readFile(dbPath, "utf-8")
  return JSON.parse(data)
}

async function saveArticles(articles: KnowledgeArticle[]) {
  await ensureDbExists()
  await fs.writeFile(dbPath, JSON.stringify(articles, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publishedOnly = searchParams.get("published") === "true"

    const articles = await getArticles()

    if (publishedOnly) {
      const publishedArticles = articles.filter((article) => article.publishedAt)
      return NextResponse.json(publishedArticles)
    }

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category, tags, publishedAt } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 })
    }

    const articles = await getArticles()
    const newArticle: KnowledgeArticle = {
      id: Date.now().toString(),
      title,
      content,
      category,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: publishedAt ? new Date().toISOString() : null,
      authorId: "admin", // In a real app, get from session
    }

    articles.push(newArticle)
    await saveArticles(articles)

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
