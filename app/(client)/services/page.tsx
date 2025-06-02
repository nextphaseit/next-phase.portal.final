import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Zap, Shield, Monitor, Wifi, Mail, HardDrive } from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: "1",
    name: "Hardware Support",
    description: "Computer, laptop, and peripheral device support and repairs",
    category: "Hardware",
    icon: Monitor,
    features: ["On-site support", "Remote diagnostics", "Hardware replacement", "Preventive maintenance"],
    sla: "4 hours",
    availability: "24/7",
  },
  {
    id: "2",
    name: "Network Support",
    description: "Network connectivity, VPN, and infrastructure support",
    category: "Network",
    icon: Wifi,
    features: ["Network troubleshooting", "VPN setup", "WiFi configuration", "Security monitoring"],
    sla: "2 hours",
    availability: "Business hours",
  },
  {
    id: "3",
    name: "Email & Communication",
    description: "Email setup, troubleshooting, and communication tools support",
    category: "Communication",
    icon: Mail,
    features: ["Email configuration", "Calendar setup", "Teams support", "Mobile sync"],
    sla: "1 hour",
    availability: "Business hours",
  },
  {
    id: "4",
    name: "Data Backup & Recovery",
    description: "Data protection, backup solutions, and disaster recovery",
    category: "Data",
    icon: HardDrive,
    features: ["Automated backups", "Data recovery", "Cloud storage", "Disaster planning"],
    sla: "6 hours",
    availability: "24/7",
  },
  {
    id: "5",
    name: "Security Services",
    description: "Cybersecurity, antivirus, and security awareness training",
    category: "Security",
    icon: Shield,
    features: ["Antivirus management", "Security training", "Threat monitoring", "Incident response"],
    sla: "1 hour",
    availability: "24/7",
  },
  {
    id: "6",
    name: "Software Support",
    description: "Software installation, updates, and application support",
    category: "Software",
    icon: Zap,
    features: ["Software installation", "License management", "Updates & patches", "Training"],
    sla: "4 hours",
    availability: "Business hours",
  },
]

export default function ServicesPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Service Catalog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive IT services designed to keep your business running smoothly.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const IconComponent = service.icon
          return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-blue/10 rounded-lg">
                    <IconComponent className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-brand-green rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    SLA: {service.sla}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-1 h-3 w-3" />
                    {service.availability}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/tickets/new?service=${service.id}`}>Request Service</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold">Need Custom Support?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Don't see what you're looking for? Our IT team can provide custom solutions tailored to your specific needs.
        </p>
        <Button asChild size="lg">
          <Link href="/tickets/new">Submit Custom Request</Link>
        </Button>
      </div>
    </div>
  )
}
