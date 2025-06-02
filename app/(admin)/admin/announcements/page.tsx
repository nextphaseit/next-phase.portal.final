"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Megaphone, Plus, Edit, Trash2, Eye, EyeOff, Users, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Announcement } from "@/types"

export default function AnnouncementsPage() {
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "System Maintenance Scheduled",
      content:
        "Our help desk system will undergo scheduled maintenance on Sunday, December 15th from 2:00 AM to 4:00 AM EST. During this time, the system may be temporarily unavailable.",
      isActive: true,
      isInternal: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    },
    {
      id: "2",
      title: "New Knowledge Base Articles",
      content:
        "We've added new troubleshooting guides for common email and network issues. Check out the Knowledge Base for the latest resources.",
      isActive: true,
      isInternal: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: "3",
      title: "Staff Meeting - IT Department",
      content:
        "Monthly IT department meeting scheduled for Friday at 3:00 PM in Conference Room B. Please review the agenda beforehand.",
      isActive: true,
      isInternal: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isActive: true,
    isInternal: false,
    expiresAt: "",
  })

  const handleSubmit = () => {
    if (editingAnnouncement) {
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === editingAnnouncement.id
            ? {
                ...ann,
                ...formData,
                expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
              }
            : ann,
        ),
      )
      toast({
        title: "Announcement Updated",
        description: "The announcement has been successfully updated.",
      })
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
      }
      setAnnouncements([newAnnouncement, ...announcements])
      toast({
        title: "Announcement Created",
        description: "The announcement has been successfully created.",
      })
    }

    setIsDialogOpen(false)
    setEditingAnnouncement(null)
    setFormData({
      title: "",
      content: "",
      isActive: true,
      isInternal: false,
      expiresAt: "",
    })
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      isActive: announcement.isActive,
      isInternal: announcement.isInternal,
      expiresAt: announcement.expiresAt ? announcement.expiresAt.toISOString().split("T")[0] : "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id))
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been successfully deleted.",
    })
  }

  const toggleStatus = (id: string) => {
    setAnnouncements(announcements.map((ann) => (ann.id === id ? { ...ann, isActive: !ann.isActive } : ann)))
  }

  const activeAnnouncements = announcements.filter((ann) => ann.isActive)
  const inactiveAnnouncements = announcements.filter((ann) => !ann.isActive)
  const publicAnnouncements = announcements.filter((ann) => !ann.isInternal)
  const internalAnnouncements = announcements.filter((ann) => ann.isInternal)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Manage system announcements and notifications.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}</DialogTitle>
              <DialogDescription>
                Create announcements to inform users about system updates, maintenance, or important notices.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter announcement content"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expires">Expires On (Optional)</Label>
                  <Input
                    id="expires"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="internal"
                      checked={formData.isInternal}
                      onCheckedChange={(checked) => setFormData({ ...formData, isInternal: checked })}
                    />
                    <Label htmlFor="internal">Internal Only</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>{editingAnnouncement ? "Update" : "Create"} Announcement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Announcements</TabsTrigger>
          <TabsTrigger value="active">Active ({activeAnnouncements.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveAnnouncements.length})</TabsTrigger>
          <TabsTrigger value="public">Public ({publicAnnouncements.length})</TabsTrigger>
          <TabsTrigger value="internal">Internal ({internalAnnouncements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <Megaphone className="h-5 w-5" />
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge variant={announcement.isActive ? "default" : "secondary"}>
                        {announcement.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={announcement.isInternal ? "outline" : "default"}>
                        {announcement.isInternal ? "Internal" : "Public"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(announcement.id)}>
                      {announcement.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(announcement)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(announcement.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{announcement.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span>
                        <strong>Created:</strong> {announcement.createdAt.toLocaleDateString()}
                      </span>
                      {announcement.expiresAt && (
                        <span>
                          <strong>Expires:</strong> {announcement.expiresAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {announcement.isInternal ? (
                        <Building className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Users className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Megaphone className="h-5 w-5" />
                    <span>{announcement.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <div className="grid gap-4">
            {inactiveAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Megaphone className="h-5 w-5" />
                    <span>{announcement.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="public" className="space-y-4">
          <div className="grid gap-4">
            {publicAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{announcement.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          <div className="grid gap-4">
            {internalAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>{announcement.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
