"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FolderOpen,
  File,
  Download,
  Trash2,
  Search,
  Upload,
  FileText,
  ImageIcon,
  Archive,
  Video,
  Music,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileItem {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  uploadedBy: string
  ticketId?: string
  category: "ticket-attachment" | "knowledge-base" | "system" | "user-upload"
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon
  if (type.startsWith("video/")) return Video
  if (type.startsWith("audio/")) return Music
  if (type.includes("pdf") || type.includes("document")) return FileText
  if (type.includes("zip") || type.includes("archive")) return Archive
  return File
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export default function FilesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "error-screenshot.png",
      type: "image/png",
      size: 245760,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      uploadedBy: "john.doe@company.com",
      ticketId: "TKT-001",
      category: "ticket-attachment",
    },
    {
      id: "2",
      name: "network-troubleshooting-guide.pdf",
      type: "application/pdf",
      size: 1048576,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      uploadedBy: "admin@company.com",
      category: "knowledge-base",
    },
    {
      id: "3",
      name: "system-logs.zip",
      type: "application/zip",
      size: 5242880,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      uploadedBy: "jane.smith@company.com",
      ticketId: "TKT-002",
      category: "ticket-attachment",
    },
    {
      id: "4",
      name: "company-logo.svg",
      type: "image/svg+xml",
      size: 12288,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      uploadedBy: "admin@company.com",
      category: "system",
    },
    {
      id: "5",
      name: "training-video.mp4",
      type: "video/mp4",
      size: 52428800,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      uploadedBy: "admin@company.com",
      category: "knowledge-base",
    },
  ])

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const ticketAttachments = files.filter((file) => file.category === "ticket-attachment")
  const knowledgeBaseFiles = files.filter((file) => file.category === "knowledge-base")
  const systemFiles = files.filter((file) => file.category === "system")
  const userUploads = files.filter((file) => file.category === "user-upload")

  const handleDelete = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
    toast({
      title: "File Deleted",
      description: "The file has been successfully deleted.",
    })
  }

  const handleDownload = (file: FileItem) => {
    // In a real app, this would trigger a download
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}...`,
    })
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Management</h1>
          <p className="text-muted-foreground">Manage uploaded files and attachments.</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-muted-foreground">{formatFileSize(totalSize)} total size</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Attachments</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketAttachments.length}</div>
            <p className="text-xs text-muted-foreground">From support tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{knowledgeBaseFiles.length}</div>
            <p className="text-xs text-muted-foreground">Documentation files</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Files</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemFiles.length}</div>
            <p className="text-xs text-muted-foreground">System resources</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Files ({files.length})</TabsTrigger>
          <TabsTrigger value="attachments">Attachments ({ticketAttachments.length})</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base ({knowledgeBaseFiles.length})</TabsTrigger>
          <TabsTrigger value="system">System ({systemFiles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredFiles.map((file) => {
              const IconComponent = getFileIcon(file.type)

              return (
                <Card key={file.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>Uploaded by {file.uploadedBy}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleDateString()}</span>
                          {file.ticketId && (
                            <>
                              <span>•</span>
                              <Badge variant="outline">{file.ticketId}</Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{file.category.replace("-", " ")}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <div className="grid gap-4">
            {ticketAttachments.map((file) => {
              const IconComponent = getFileIcon(file.type)

              return (
                <Card key={file.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{file.ticketId}</Badge>
                          <span>•</span>
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="grid gap-4">
            {knowledgeBaseFiles.map((file) => {
              const IconComponent = getFileIcon(file.type)

              return (
                <Card key={file.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4">
            {systemFiles.map((file) => {
              const IconComponent = getFileIcon(file.type)

              return (
                <Card key={file.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
