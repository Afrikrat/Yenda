import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DeploymentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#b0468e]">Deployment Guide</CardTitle>
          <CardDescription>Follow these steps to deploy your Yenda app</CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>Prerequisites</h2>
          <ul>
            <li>A Vercel account</li>
            <li>A Supabase account</li>
            <li>Your project code on GitHub, GitLab, or Bitbucket</li>
          </ul>

          <h2>Step 1: Set Up Supabase</h2>
          <ol>
            <li>Create a new project in Supabase</li>
            <li>Go to the SQL Editor and run the necessary database setup scripts</li>
            <li>Get your Supabase URL and API keys from the project settings</li>
          </ol>

          <h2>Step 2: Deploy to Vercel</h2>
          <ol>
            <li>Connect your repository to Vercel</li>
            <li>
              Configure the following environment variables:
              <ul>
                <li>
                  <code>NEXT_PUBLIC_SUPABASE_URL</code>: Your Supabase project URL
                </li>
                <li>
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>: Your Supabase anonymous key
                </li>
                <li>
                  <code>SUPABASE_SERVICE_ROLE_KEY</code>: Your Supabase service role key
                </li>
              </ul>
            </li>
            <li>Deploy your project</li>
          </ol>

          <h2>Step 3: Set Up Admin Account</h2>
          <ol>
            <li>
              After deployment, navigate to <code>/setup-admin</code> on your deployed site
            </li>
            <li>Create your admin account with a secure password</li>
            <li>
              You can now access the admin dashboard at <code>/admin</code>
            </li>
          </ol>

          <h2>Step 4: Seed Initial Data</h2>
          <ol>
            <li>
              Go to <code>/seed</code> to populate your database with initial data
            </li>
            <li>
              You can customize the seed data in <code>app/actions/seed-data.ts</code>
            </li>
          </ol>

          <h2>Troubleshooting</h2>
          <p>If you encounter any issues during deployment:</p>
          <ul>
            <li>Check your environment variables are correctly set</li>
            <li>Ensure your Supabase project is properly configured</li>
            <li>Check the Vercel deployment logs for any errors</li>
          </ul>

          <div className="mt-6">
            <Link href="/admin-menu" className="text-[#b0468e] hover:underline">
              ← Back to Admin Menu
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
