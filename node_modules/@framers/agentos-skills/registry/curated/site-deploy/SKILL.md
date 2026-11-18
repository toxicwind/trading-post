---
name: site-deploy
version: '1.0.0'
description: Deploy websites and applications to cloud providers with automatic domain registration and DNS configuration.
author: Wunderland
namespace: wunderland
category: infrastructure
tags: [deploy, cloud, hosting, domain, dns, devops, vercel, cloudflare, aws, digitalocean, netlify, heroku, railway, flyio]
requires_secrets: []
requires_tools: [siteDeployOrchestrate]
metadata:
  agentos:
    emoji: "\U0001F680"
    homepage: https://wunderland.sh/docs/skills/site-deploy
---

# Site Deploy

Deploy websites and applications end-to-end: build, deploy to cloud, register domain, configure DNS — all in one workflow.

## Cloud Providers

Choose based on project type:

| Provider | Best For | Deploy Tool |
|----------|----------|-------------|
| **Vercel** | Next.js, React, static sites, serverless | `vercelDeploy` |
| **Cloudflare Pages** | Static/JAMstack, edge functions, free tier | `cfDeployPages` |
| **Netlify** | Static sites, serverless, form handling | `netlifyDeploySite` |
| **DigitalOcean** | App Platform (PaaS), Droplets (VPS) | `doCreateApp` / `doCreateDroplet` |
| **Heroku** | Backend services, quick prototypes, add-ons | `herokuCreateApp` |
| **Railway** | Full-stack apps, databases, backend services | `railwayDeployService` |
| **Fly.io** | Edge compute, Docker containers, global | `flyDeployApp` |
| **AWS** | Enterprise, S3 static hosting, Amplify, Lambda | `awsDeployS3Site` / `awsDeployAmplify` |
| **Linode** | VPS, custom deployments, Kubernetes | `linodeCreateInstance` |

## Provider Selection Heuristics

When the user doesn't specify a provider:

1. **Static site** (HTML/CSS/JS only) → Cloudflare Pages (free, fastest CDN)
2. **Next.js / React / Vue / Svelte** → Vercel (best DX, auto-detection)
3. **Backend API** (Node.js, Python, Go) → Railway or Heroku (managed PaaS)
4. **Full-stack with database** → Railway (built-in Postgres/Redis) or DigitalOcean App Platform
5. **Docker container** → Fly.io (global edge) or Railway
6. **Custom VPS** (needs SSH, full control) → Linode or DigitalOcean Droplet
7. **Enterprise / complex infra** → AWS (Amplify for frontend, Lambda for API, S3+CloudFront for static)

## Domain Registrars

| Registrar | Search Tool | Register Tool | DNS Tool |
|-----------|-------------|---------------|----------|
| **Porkbun** | `porkbunSearchDomain` | `porkbunRegisterDomain` | `porkbunConfigureDns` |
| **Namecheap** | `namecheapSearchDomain` | `namecheapRegisterDomain` | `namecheapConfigureDns` |
| **GoDaddy** | `godaddySearchDomain` | `godaddyRegisterDomain` | `godaddyConfigureDns` |
| **Cloudflare** | N/A (transfer only) | `cfRegTransferDomain` | `cfRegConfigureDns` |

## Deployment Workflow

### Standard flow:
1. **Detect framework** — scan for `next.config`, `vite.config`, `package.json` scripts, `Dockerfile`, etc.
2. **Select provider** — use heuristic or user preference
3. **Deploy** — call the provider's deploy tool with git URL and build settings
4. **Wait for build** — poll deployment status until READY or ERROR
5. **Configure domain** (if requested):
   a. Search domain availability via registrar tool
   b. **Ask user to confirm purchase** (always confirm — this costs money!)
   c. Register domain
   d. Configure DNS records:
      - Vercel: CNAME → `cname.vercel-dns.com`
      - Cloudflare Pages: CNAME → `{project}.pages.dev`
      - Netlify: CNAME → `{site}.netlify.app`
      - DigitalOcean: A record → app IP
      - AWS S3: CNAME → `{bucket}.s3-website-{region}.amazonaws.com`
      - Railway: CNAME → `{app}.up.railway.app`
      - Fly.io: CNAME → `{app}.fly.dev`
      - Heroku: CNAME → `{app}.herokuapp.com`
      - Linode: A record → instance IP
   e. Add domain to cloud provider project
6. **Report** — deployment URL, domain status, SSL status, any manual steps needed

### DNS propagation:
- After setting DNS records, propagation takes 1-60 minutes (usually <5 min)
- SSL certificates auto-provision on most platforms once DNS resolves
- Tell the user: "DNS is configured. It may take a few minutes to propagate. SSL will auto-provision."

## Important Notes

- **Always confirm domain purchases** — these cost real money
- **Vercel/Netlify/Cloudflare** provide free SSL via Let's Encrypt
- **AWS requires ACM certificate** for CloudFront HTTPS
- **Root domains** (e.g. `example.com`) need A records; subdomains (e.g. `www.example.com`) use CNAME
- For root + www, configure both: root A → provider IP, www CNAME → provider hostname
- **Environment variables** should be set before deployment for build-time access

## Examples

**Deploy Next.js to Vercel with custom domain:**
```
1. vercelDeploy({ gitUrl: "https://github.com/user/my-app" })
2. porkbunSearchDomain({ domain: "myapp.com" }) → available, $9.73/yr
3. [Confirm with user]
4. porkbunRegisterDomain({ domain: "myapp.com", years: 1 })
5. porkbunConfigureDns({ domain: "myapp.com", action: "add", type: "CNAME", name: "www", content: "cname.vercel-dns.com" })
6. porkbunConfigureDns({ domain: "myapp.com", action: "add", type: "A", name: "", content: "76.76.21.21" })
7. vercelConfigureDomain({ projectId: "...", domain: "myapp.com" })
```

**Deploy static site to Cloudflare (free):**
```
1. cfDeployPages({ gitUrl: "https://github.com/user/landing", projectName: "my-landing" })
2. cfConfigureDns({ domain: "mysite.com", action: "add", type: "CNAME", name: "www", content: "my-landing.pages.dev" })
```

**Deploy backend to Railway with database:**
```
1. railwayDeployService({ gitUrl: "https://github.com/user/api", envVars: { NODE_ENV: "production" } })
2. railwayAddDatabase({ projectId: "...", plugin: "postgresql" })
```
