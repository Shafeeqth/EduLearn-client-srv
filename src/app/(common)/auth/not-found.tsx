import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function AuthNotFound() {
  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-slate-600 dark:text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Page not found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Sorry, the authentication page you are looking for does not exist.
        </p>
      </div>

      {/* Not Found Card */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Please check
              the URL or navigate to a valid page.
            </p>
            <div className="flex flex-col space-y-2">
              <Button
                asChild
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Link href="/auth/login">Go to Login</Link>
              </Button>
              <Button variant="outline" asChild className="w-full h-11">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Need help?{' '}
          <Link
            href="/support"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
