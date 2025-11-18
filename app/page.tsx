import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layouts/header"
import { Footer } from "@/components/layouts/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Find trusted local{" "}
              <span className="text-primary">service professionals</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Get quotes from top-rated professionals in your area. Compare
              prices, read reviews, and hire with confidence.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto">
                  Find Professionals
                </Button>
              </Link>
              <Link href="/register?role=professional">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Join as a Professional
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="mt-4 text-muted-foreground">
                Get the help you need in three simple steps
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    1
                  </div>
                  <CardTitle>Tell us what you need</CardTitle>
                  <CardDescription>
                    Answer a few questions about your project and we'll match you
                    with the right professionals
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    2
                  </div>
                  <CardTitle>Compare quotes</CardTitle>
                  <CardDescription>
                    Review detailed quotes from multiple professionals. Check
                    ratings, reviews, and credentials
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    3
                  </div>
                  <CardTitle>Hire with confidence</CardTitle>
                  <CardDescription>
                    Choose the best professional for your needs. Pay securely and
                    leave a review when done
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Popular Categories
            </h2>
            <p className="mt-4 text-muted-foreground">
              Browse services by category
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Home Improvement", count: "1,234 pros" },
              { name: "Cleaning Services", count: "892 pros" },
              { name: "Event Services", count: "567 pros" },
              { name: "Lessons & Training", count: "445 pros" },
              { name: "Wellness", count: "321 pros" },
              { name: "Business Services", count: "678 pros" },
              { name: "Pet Services", count: "234 pros" },
              { name: "Auto Services", count: "456 pros" },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Card className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.count}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-primary py-20 text-primary-foreground">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to get started?
              </h2>
              <p className="mt-4 text-lg opacity-90">
                Join thousands of customers who trust ServiceHub to find quality
                service professionals
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
