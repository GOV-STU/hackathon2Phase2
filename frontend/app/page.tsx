import Link from "next/link";
import { CheckCircle2, Shield, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Simple, Powerful
              <br />
              Todo Management
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Stay organized and productive with our beautiful, intuitive task
              management application. Built for modern teams and individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              Everything you need to stay productive
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks efficiently
              and achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card variant="elevated" padding="md">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-950/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                  Clean Interface
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beautiful, intuitive design that helps you focus on what
                  matters most.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card variant="elevated" padding="md">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-950/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                  Secure & Private
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your data is encrypted and protected with industry-standard
                  security.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card variant="elevated" padding="md">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built with modern technology for instant performance and
                  responsiveness.
                </p>
              </div>
            </Card>

            {/* Feature 4 */}
            <Card variant="elevated" padding="md">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                  AI-Powered (Coming Soon)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smart features and automation to help you work smarter, not
                  harder.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              Ready to get organized?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of users who are already managing their tasks more
              effectively.
            </p>
            <Link href="/signup">
              <Button size="lg">Start Free Today</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
