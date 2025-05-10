# Yenda - Event Discovery App

Yenda is a modern, PWA mobile-first event discovery and management app for Ghana's Western North region.

## Features

- Event discovery and management
- Blog posts and stories
- User profiles and event saving
- Admin dashboard for content management
- PWA support for mobile installation
- Responsive design for all devices

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Database and Authentication)
- Tailwind CSS
- shadcn/ui Components
- TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Vercel account (for deployment)

### Local Development

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/yenda-app.git
cd yenda-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file with the following variables:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set the environment variables in Vercel
4. Deploy

### Setting Up Admin Account

1. After deployment, visit `/setup-admin` to create your admin account
2. Use the created credentials to log in at `/admin/login`

### Seeding the Database

1. Visit `/seed` to populate the database with sample data
2. This will create categories, towns, events, blog posts, and stories

## Admin Credentials

To access the admin dashboard, you need to create an admin account:

1. Visit `/setup-admin` in your deployed app
2. Create an account with your email and password
3. Use these credentials to log in at `/admin/login`

## PWA Installation

The app is configured as a Progressive Web App (PWA) and can be installed on mobile devices:

1. Visit the app in a mobile browser
2. An install prompt will appear automatically
3. Click "Install Now" to add the app to your home screen

## Customization

### Brand Colors

The app uses the Yenda brand colors:
- Primary: #b83280 (Pink/Magenta)
- Accent: #9c4be2 (Purple)

These colors can be adjusted in:
- `app/globals.css` (CSS variables)
- `tailwind.config.ts` (Tailwind theme)

### Content

All content can be managed through the admin dashboard:
- Events
- Blog posts
- Stories
- Categories
- Towns

## Support

For support, contact:
- Phone/WhatsApp: 0554688406
- Email: info@yenda.com

## License

This project is licensed under the MIT License.
