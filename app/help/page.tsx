"use client"

import { useState } from "react"
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Book,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Users,
  BarChart3,
} from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "How do I create a new support ticket?",
    answer:
      'To create a new support ticket, navigate to the Tickets page and click the "New Ticket" button. Fill in the required information including subject, description, priority level, and assign it to a team member. You can also attach files if needed.',
    category: "Tickets",
  },
  {
    id: "2",
    question: "How do I manage user roles and permissions?",
    answer:
      "Go to the Users page where you can view all users, edit their roles, and manage permissions. Available roles include Super Admin, Admin, Support Admin, Read-Only, and User. Each role has different access levels to various features.",
    category: "Users",
  },
  {
    id: "3",
    question: "How do I view audit logs?",
    answer:
      "Audit logs can be accessed from the Audit Logs page in the admin panel. You can filter logs by date range, user, and action type. Logs track all important actions like user creation, ticket updates, and system changes.",
    category: "Audit",
  },
  {
    id: "4",
    question: "How do I export data from the portal?",
    answer:
      'Most pages have an "Export" button that allows you to download data in CSV format. This includes tickets, users, documents, and audit logs. You can filter the data before exporting to get exactly what you need.',
    category: "Data",
  },
  {
    id: "5",
    question: "How do I restore deleted items?",
    answer:
      'Items are soft-deleted, meaning they can be restored. Look for the "Recently Deleted" tab on the Tickets, Users, or Documents pages. From there, you can restore items or permanently delete them.',
    category: "Data",
  },
  {
    id: "6",
    question: "How do I enable maintenance mode?",
    answer:
      'Only Super Admins can enable maintenance mode. Go to Settings and toggle the "Maintenance Mode" switch. When active, the portal will show a maintenance banner and disable most functionality.',
    category: "System",
  },
]

const categories = ["All", "Portal Overview", "Tickets", "Users", "Audit", "Data", "System"]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-[#006699] mr-3" />
            <h1 className="text-4xl font-bold text-[#333333]">Help Center</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to use the NextPhase IT Admin Portal effectively.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] text-lg"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category ? "bg-[#006699] text-white" : "text-[#333333] hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#333333] mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a href="/admin/dashboard" className="flex items-center text-[#006699] hover:text-[#005588]">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </a>
                  <a href="/admin/tickets" className="flex items-center text-[#006699] hover:text-[#005588]">
                    <FileText className="w-4 h-4 mr-2" />
                    Tickets
                  </a>
                  <a href="/admin/users" className="flex items-center text-[#006699] hover:text-[#005588]">
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </a>
                  <a href="/admin/audit-logs" className="flex items-center text-[#006699] hover:text-[#005588]">
                    <Book className="w-4 h-4 mr-2" />
                    Audit Logs
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Portal Overview */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-6 flex items-center">
                <Book className="w-6 h-6 mr-3 text-[#006699]" />
                Portal Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#333333] mb-3">Key Features</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Ticket Management System</li>
                    <li>• User Role Management</li>
                    <li>• Document Upload & Storage</li>
                    <li>• Analytics & Reporting</li>
                    <li>• Audit & Activity Logging</li>
                    <li>• Calendar & Event Management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#333333] mb-3">Getting Started</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Review your user role and permissions</li>
                    <li>• Explore the dashboard for an overview</li>
                    <li>• Create your first support ticket</li>
                    <li>• Upload important documents</li>
                    <li>• Check audit logs for compliance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-6">Frequently Asked Questions</h2>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No FAQ items found for your search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                      >
                        <span className="font-medium text-[#333333]">{item.question}</span>
                        {expandedItems.includes(item.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {expandedItems.includes(item.id) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {item.category}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 mr-3 text-[#006699]" />
                Contact Support
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#006699] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#333333] mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-3">Get help via email</p>
                  <a
                    href="mailto:support@nextphaseit.com"
                    className="text-[#006699] hover:text-[#005588] flex items-center justify-center"
                  >
                    support@nextphaseit.com
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#006699] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#333333] mb-2">Phone Support</h3>
                  <p className="text-gray-600 mb-3">Call us for urgent issues</p>
                  <a href="tel:+1-555-123-4567" className="text-[#006699] hover:text-[#005588]">
                    +1 (555) 123-4567
                  </a>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#006699] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#333333] mb-2">Create Ticket</h3>
                  <p className="text-gray-600 mb-3">Submit a support request</p>
                  <a
                    href="/tickets/new"
                    className="text-[#006699] hover:text-[#005588] flex items-center justify-center"
                  >
                    New Ticket
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
