"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LifeBuoy,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Monitor,
  Wifi,
  Mail,
  HardDrive,
  Smartphone,
  Shield,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ServiceCatalogItem } from "@/types"

const categoryIcons = {
  Hardware: HardDrive,
  Software: Monitor,
  Network: Wifi,
  Email: Mail,
  Mobile: Smartphone,
  Security: Shield,
  Other: LifeBuoy,
}

export default function ServicesPage() {
  const { toast } = useToast()
  const [services, setServices] = useState<ServiceCatalogItem[]>([
    {
      id: "1",
      name: "Password Reset",
      description: "Reset your Windows domain password or email password",
      category: "Security",
      isActive: true,
    },
    {
      id: "2",
      name: "Software Installation",
      description: "Request installation of approved business software",
      category: "Software",
      isActive: true,
    },
    {
      id: "3",
      name: "Hardware Repair",
      description: "Report hardware issues with computers, printers, or peripherals",
      category: "Hardware",
      isActive: true,
    },
    {
      id: "4",
      name: "Email Setup",
      description: "Configure email on new devices or troubleshoot email issues",
      category: "Email",
      isActive: true,
    },
    {
      id: "5",
      name: "Network Access",
      description: "Request network access or troubleshoot connectivity issues",
      category: "Network",
      isActive: true,
    },
    {
      id: "6",
      name: "Mobile Device Support",
      description: "Setup and support for company mobile devices",
      category: "Mobile",
      isActive: false,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceCatalogItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    isActive: true,
  })

  const categories = ["Hardware", "Software", "Network", "Email", "Mobile", "Security", "Other"]

  const handleSubmit = () => {
    if (editingService) {
      setServices(services.map((service) => (service.id === editingService.id ? { ...service, ...formData } : service)))
      toast({
        title: "Service Updated",
        description: "The service has been successfully updated.",
      })
    } else {
      const newService: ServiceCatalogItem = {
        id: Date.now().toString(),
        ...formData,
      }
      setServices([...services, newService])
      toast({
        title: "Service Created",
        description: "The service has been successfully created.",
      })
    }

    setIsDialogOpen(false)
    setEditingService(null)
    setFormData({
      name: "",
      description: "",
      category: "",
      isActive: true,
    })
  }

  const handleEdit = (service: ServiceCatalogItem) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      isActive: service.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
    toast({
      title: "Service Deleted",
      description: "The service has been successfully deleted.",
    })
  }

  const toggleStatus = (id: string) => {
    setServices(services.map((service) => (service.id === id ? { ...service, isActive: !service.isActive } : service)))
  }

  const activeServices = services.filter((service) => service.isActive)
  const inactiveServices = services.filter((service) => !service.isActive)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Catalog</h1>
          <p className="text-muted-foreground">Manage available support services and offerings.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
              <DialogDescription>Create or modify services available in the service catalog.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter service description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>{editingService ? "Update" : "Create"} Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeServices.length} active, {inactiveServices.length} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Password Reset</div>
            <p className="text-xs text-muted-foreground">45% of all service requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Service categories available</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Services</h2>
          <div className="flex space-x-2">
            <Badge variant="outline">{activeServices.length} Active</Badge>
            <Badge variant="secondary">{inactiveServices.length} Inactive</Badge>
          </div>
        </div>

        <div className="grid gap-4">
          {services.map((service) => {
            const IconComponent = categoryIcons[service.category as keyof typeof categoryIcons] || LifeBuoy

            return (
              <Card key={service.id} className={!service.isActive ? "opacity-60" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={service.isActive ? "default" : "secondary"}>
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{service.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(service.id)}>
                      {service.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
