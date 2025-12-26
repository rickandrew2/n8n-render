# AI Automation Agency Landing Page

Professional marketing agency landing page built with Next.js, TypeScript, and Tailwind CSS. Designed for seamless integration with n8n automation workflows and AI-powered response systems.

## Features

- **Hero Section**: Compelling value proposition with clear call-to-action
- **Services Section**: Showcase of 4 core service offerings
- **Contact Form**: Fully functional form with validation and error handling
- **Automation-Ready**: Structured data payload optimized for n8n webhook consumption
- **Responsive Design**: Mobile-first, professional layout
- **Type-Safe**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (install via `npm install -g pnpm`)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Form Submission Flow

### Current Implementation

1. User fills out contact form (name, email, message)
2. Client-side validation ensures data quality
3. Form data formatted with metadata:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "message": "I need help with automation",
     "source": "landing-page",
     "timestamp": "2024-01-01T12:00:00.000Z"
   }
   ```
4. POST request sent to `/api/contact`
5. API validates and logs submission

### n8n Integration (Future)

To enable n8n webhook integration:

1. Set `N8N_WEBHOOK_URL` in `.env.local`:
   ```
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/contact-form
   ```

2. Uncomment the webhook forwarding code in `app/api/contact/route.ts`

3. Configure n8n workflow to:
   - Receive webhook payload
   - Extract inquiry details
   - Trigger AI response generation (OpenAI, Anthropic, etc.)
   - Send automated email reply to user
   - Create notification/ticket for team
   - Store inquiry in CRM/database

### AI Response Generation Architecture

After n8n receives the webhook:

1. **Data Extraction**: Parse form data from webhook payload
2. **AI Processing**: Call AI service to generate personalized response
3. **Email Delivery**: Send automated reply via email service (SendGrid, Resend, etc.)
4. **Team Notification**: Alert team via Slack, email, or CRM
5. **Data Storage**: Log inquiry for tracking and analytics

## Project Structure

```
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts      # API endpoint for form submission
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main landing page
├── components/
│   ├── ContactForm.tsx       # Contact form component
│   ├── Hero.tsx              # Hero section
│   └── Services.tsx          # Services section
└── lib/
    └── utils.ts              # Utility functions (validation, formatting)
```

## Development

### Build for Production

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## Environment Variables

See `.env.example` for available configuration options:

- `NEXT_PUBLIC_API_URL`: Override default API endpoint (optional)
- `N8N_WEBHOOK_URL`: n8n webhook URL for automation integration

## Code Quality

- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Prettier for code formatting
- Modular component architecture
- Comprehensive error handling
- Input validation (client & server-side)

## Deployment

This project can be deployed to:
- Vercel (recommended for Next.js)
- Render
- Netlify
- Any Node.js hosting platform

---

## n8n on Render (Legacy)

Deploy n8n workflow automation on Render using Docker.

### Quick Setup

1. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`

2. **Set Environment Variables in Render Dashboard**
   
   **Required:**
   - `N8N_BASIC_AUTH_USER` - Your username
   - `N8N_BASIC_AUTH_PASSWORD` - Your password (mark as Secret)
   - `N8N_HOST` - Your service URL (e.g., `n8n-xxxxx.onrender.com`)
   - `WEBHOOK_URL` - Full URL (e.g., `https://n8n-xxxxx.onrender.com/`)
   - `DB_POSTGRESDB_HOST` - Your Neon database host
   - `DB_POSTGRESDB_DATABASE` - Your database name
   - `DB_POSTGRESDB_USER` - Your database user
   - `DB_POSTGRESDB_PASSWORD` - Your database password (mark as Secret)

3. **Access n8n**
   - Visit your Render service URL
   - Log in with your credentials

### Database

This setup uses Neon PostgreSQL. Create a database at [Neon Console](https://console.neon.tech) and use those connection details in Render.

