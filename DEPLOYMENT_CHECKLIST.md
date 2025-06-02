# 🚀 Production Deployment Checklist

## Pre-Deployment

### ✅ Environment Configuration
- [ ] All required environment variables set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] `NEXTAUTH_SECRET` is a secure, random string
- [ ] Azure AD credentials are for production tenant
- [ ] Power Automate webhook URLs are production endpoints

### ✅ Security Verification
- [ ] No hardcoded secrets in code
- [ ] All API endpoints have input validation
- [ ] Rate limiting is configured
- [ ] Security headers are enabled
- [ ] File upload restrictions are in place

### ✅ Performance Optimization
- [ ] Bundle analysis completed (`npm run build:analyze`)
- [ ] Images are optimized
- [ ] Unused dependencies removed
- [ ] Code splitting is working
- [ ] Lighthouse score > 90

### ✅ Testing
- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] Ticket submission works
- [ ] Ticket search works
- [ ] Admin portal functions
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed

## Azure AD Setup

### ✅ App Registration
- [ ] Application registered in Azure AD
- [ ] Redirect URIs configured for production
- [ ] API permissions granted
- [ ] Client secret generated and stored securely
- [ ] User assignment configured (if required)

### ✅ Authentication URLs
- [ ] Authority URL: `https://login.microsoftonline.com/{tenant-id}`
- [ ] Redirect URI: `{NEXT_PUBLIC_APP_URL}/api/auth/callback/azure-ad`
- [ ] Post-logout redirect: `{NEXT_PUBLIC_APP_URL}`

## Power Automate Configuration

### ✅ Ticket Submission Flow
- [ ] HTTP trigger configured
- [ ] JSON schema matches API payload
- [ ] SharePoint list connection working
- [ ] Email notifications configured
- [ ] Error handling implemented

### ✅ Ticket Search Flow
- [ ] HTTP trigger configured
- [ ] SharePoint query working
- [ ] Response format matches API expectations
- [ ] Performance optimized for large datasets

### ✅ SharePoint List
- [ ] Required columns created:
  - [ ] TicketReference (Single line of text)
  - [ ] FullName (Single line of text)
  - [ ] Email (Single line of text)
  - [ ] IssueCategory (Choice)
  - [ ] Description (Multiple lines of text)
  - [ ] Status (Choice: Open, In Progress, Resolved, Closed)
  - [ ] SubmissionDate (Date and time)
  - [ ] AssignedTechnician (Person or Group)
  - [ ] LastUpdated (Date and time)
- [ ] Permissions configured correctly
- [ ] Indexing enabled for search columns

## Deployment Steps

### ✅ Vercel Deployment
1. [ ] Connect GitHub repository to Vercel
2. [ ] Configure build settings:
   - [ ] Framework: Next.js
   - [ ] Build command: `npm run build`
   - [ ] Output directory: `.next`
3. [ ] Set environment variables
4. [ ] Configure custom domain (if applicable)
5. [ ] Enable analytics and monitoring

### ✅ Domain Configuration
- [ ] DNS records configured
- [ ] SSL certificate provisioned
- [ ] CNAME/A records pointing to Vercel
- [ ] Domain verification completed

## Post-Deployment

### ✅ Verification
- [ ] Health check endpoint responds: `/api/health`
- [ ] Authentication flow works end-to-end
- [ ] Ticket submission creates SharePoint entries
- [ ] Ticket search returns correct results
- [ ] Admin portal accessible with proper permissions
- [ ] Email notifications are sent
- [ ] Error pages display correctly

### ✅ Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry recommended)
- [ ] Uptime monitoring setup
- [ ] Performance monitoring active
- [ ] Log aggregation configured

### ✅ Security Verification
- [ ] Security headers present (check with securityheaders.com)
- [ ] SSL Labs rating A+ (check with ssllabs.com)
- [ ] No sensitive data in client-side code
- [ ] Rate limiting working
- [ ] File upload security tested

### ✅ Performance Testing
- [ ] Lighthouse audit score > 90
- [ ] Core Web Vitals within thresholds
- [ ] Load testing completed
- [ ] Mobile performance verified

## Maintenance

### ✅ Regular Tasks
- [ ] Monitor error rates
- [ ] Review security logs
- [ ] Update dependencies monthly
- [ ] Backup SharePoint data
- [ ] Review and rotate secrets quarterly

### ✅ Documentation
- [ ] User guides updated
- [ ] Admin documentation current
- [ ] API documentation accurate
- [ ] Troubleshooting guides available

## Emergency Procedures

### ✅ Rollback Plan
- [ ] Previous deployment tagged in Git
- [ ] Rollback procedure documented
- [ ] Database backup available
- [ ] Emergency contacts list updated

### ✅ Incident Response
- [ ] Monitoring alerts configured
- [ ] Escalation procedures defined
- [ ] Communication plan established
- [ ] Recovery procedures tested

---

## Quick Commands

\`\`\`bash
# Build and analyze
npm run build:analyze

# Security audit
npm run security:audit

# Type check
npm run type-check

# Deploy to Vercel
vercel --prod

# Health check
curl https://your-domain.com/api/health
\`\`\`

## Support Contacts

- **Technical Issues**: support@nextphaseit.com
- **Azure AD Issues**: admin@nextphaseit.com
- **Emergency**: [Emergency contact information]

---

**Deployment Date**: ___________
**Deployed By**: ___________
**Version**: ___________
**Sign-off**: ___________
\`\`\`

Create a final production configuration file:
