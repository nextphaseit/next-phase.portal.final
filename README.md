# NextPhase IT Help Desk System

A modern, responsive help desk ticketing system built with Next.js 15, featuring both client-facing and admin portals.

## 🚀 Features

- **Client Portal**: Submit tickets, track status, access knowledge base
- **Admin Portal**: Manage tickets, users, knowledge base, and system settings
- **Azure AD Integration**: Single Sign-On (SSO) authentication
- **Power Automate Integration**: Automated workflows with SharePoint
- **Responsive Design**: Mobile-first, accessible interface
- **Security**: Production-ready with security headers and input validation

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Azure AD tenant
- Power Automate flows configured
- SharePoint list for ticket storage

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd nextphase-it-helpdesk
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   - Azure AD credentials
   - Power Automate webhook URLs
   - NextAuth secret
   - Application URLs

4. **Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Deploy**
   \`\`\`bash
   npm run build
   vercel --prod
   \`\`\`

3. **Environment Variables**
   Set all required environment variables in Vercel dashboard

### Manual Deployment

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start production server**
   \`\`\`bash
   npm start
   \`\`\`

### Docker Deployment

\`\`\`dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🔧 Configuration

### Required Environment Variables

\`\`\`env
# Application
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secure-secret

# Azure AD
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# Power Automate
POWER_AUTOMATE_WEBHOOK_URL=your-webhook-url
POWER_AUTOMATE_SEARCH_WEBHOOK_URL=your-search-webhook-url
\`\`\`

### Power Automate Setup

1. Create flows for:
   - Ticket submission (saves to SharePoint)
   - Ticket search (queries SharePoint)
   - Email notifications

2. Configure HTTP triggers with JSON schema
3. Set up SharePoint list with required columns
4. Test webhook endpoints

### Azure AD Setup

1. Register application in Azure AD
2. Configure redirect URIs
3. Set up API permissions
4. Generate client secret
5. Configure user assignment

## 🔒 Security Features

- **Input Validation**: Zod schemas for all API inputs
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: CSP, HSTS, XSS protection
- **File Upload Security**: Type and size validation
- **Environment Protection**: Sensitive data in environment variables

## 📊 Monitoring

### Health Check
\`\`\`
GET /api/health
\`\`\`

### Performance Monitoring
- Use Vercel Analytics or similar
- Monitor Core Web Vitals
- Set up error tracking (Sentry recommended)

## 🧪 Testing

\`\`\`bash
# Type checking
npm run type-check

# Linting
npm run lint

# Security audit
npm run security:audit

# Bundle analysis
npm run build:analyze
\`\`\`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

Private - NextPhase IT

## 🆘 Support

For technical support, contact: support@nextphaseit.com
\`\`\`

Create a robots.txt file:

\`\`\`plaintext file="public/robots.txt"
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /auth/

Sitemap: https://your-domain.com/sitemap.xml
