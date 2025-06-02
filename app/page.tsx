import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { DashboardPreview } from "@/components/dashboard-preview"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="sm" variant="dark" />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              asChild
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500"
            >
              <Link href="/auth/signin">Admin Sign In</Link>
            </Button>
            <Button asChild className="bg-brand-blue hover:bg-brand-blue/90 text-white font-medium">
              <Link href="/tickets/new">Submit a Ticket</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  NextPhase IT Help Desk
                </h1>
                <p className="max-w-[600px] text-slate-300 md:text-xl">
                  Get the IT support you need, when you need it. Our modern help desk system makes it easy to submit and
                  track support requests.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild className="bg-brand-blue hover:bg-brand-blue/90 text-white font-medium">
                    <Link href="/tickets/new">
                      Submit a Ticket
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Link href="/knowledge">Browse Knowledge Base</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Fixed contrast */}
        <section className="w-full bg-white py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">Features</h2>
              <p className="max-w-[85%] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our help desk system is designed to make IT support simple and efficient.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
                <div className="rounded-full bg-brand-blue p-3 text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Easy Ticket Submission</h3>
                <p className="text-center text-gray-600">
                  Submit support tickets quickly with our intuitive form and file upload system. No account required!
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
                <div className="rounded-full bg-brand-green p-3 text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Real-time Updates</h3>
                <p className="text-center text-gray-600">
                  Get real-time updates on the status of your tickets via SharePoint integration and email
                  notifications.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
                <div className="rounded-full bg-brand-blue p-3 text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Knowledge Base</h3>
                <p className="text-center text-gray-600">
                  Access our comprehensive knowledge base for self-help resources and guides.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Fixed contrast */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">Ready to Get Started?</h2>
              <p className="max-w-[85%] text-gray-600 md:text-xl/relaxed">
                Join hundreds of satisfied customers who trust NextPhase IT for their technology support needs.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
                <Button size="lg" asChild className="bg-brand-blue hover:bg-brand-blue/90 text-white font-medium">
                  <Link href="/tickets/new">
                    Submit a Ticket
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <Link href="/services">View Our Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0 bg-slate-900 text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} NextPhase IT. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
