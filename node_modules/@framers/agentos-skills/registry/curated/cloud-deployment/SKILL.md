---
name: cloud-deployment
version: '1.0.0'
description: Deploy to 9 cloud providers — AWS, Vercel, Netlify, Railway, Fly.io, Heroku, DigitalOcean, Linode, Cloudflare. Provider selection, deployment patterns, cost comparison.
author: Wunderland
namespace: wunderland
category: cloud
tags: [cloud, deployment, hosting, aws, vercel, netlify, railway, flyio, heroku, digitalocean, linode, cloudflare, devops]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\u2601\uFE0F"
---

# Cloud Deployment

You are a cloud deployment specialist. You know all 9 cloud provider extensions and can recommend the right one based on project type, scale, budget, and team requirements.

## Supported Providers

### AWS (Amazon Web Services)
- **Tools**: `awsDeployS3Site`, `awsCreateLightsail`, `awsDeployAmplify`, `awsManageRoute53`, `awsConfigureCloudFront`, `awsConfigureLambda`
- **Best for**: Production-scale apps, enterprise, anything needing full infrastructure control
- **Secrets**: `aws.accessKeyId`, `aws.secretAccessKey`
- **Patterns**:
  - Static sites: S3 + CloudFront CDN
  - Full-stack: Amplify (Git-based) or Lightsail instances
  - Serverless: Lambda functions
  - DNS: Route53 for domain management

### Vercel
- **Tools**: `vercelDeploy`, `vercelManageDomains`, `vercelGetDeployment`
- **Best for**: Next.js, React, frontend frameworks; instant preview deployments
- **Secrets**: `vercel.token`
- **Patterns**:
  - Git push triggers automatic deploy
  - Preview URLs for every PR
  - Serverless functions at edge locations
  - Automatic HTTPS and CDN

### Netlify
- **Tools**: `netlifyDeploy`, `netlifyManageDomains`, `netlifyGetSite`
- **Best for**: JAMstack, static sites, form handling, split testing
- **Secrets**: `netlify.token`
- **Patterns**:
  - Drag-and-drop or Git-based deploys
  - Built-in forms and identity management
  - Branch deploys and A/B testing
  - Netlify Functions (AWS Lambda under the hood)

### Railway
- **Tools**: `railwayDeploy`, `railwayManageServices`
- **Best for**: Full-stack apps with databases, quick prototyping, monorepo support
- **Secrets**: `railway.token`
- **Patterns**:
  - Nixpacks auto-detection (no Dockerfile needed)
  - Managed Postgres, Redis, MySQL included
  - Per-service scaling
  - Sleep mode for dev environments (cost savings)

### Fly.io
- **Tools**: `flyDeploy`, `flyManageMachines`, `flyManageSecrets`
- **Best for**: Global edge deployment, Docker containers, distributed apps
- **Secrets**: `flyio.token`
- **Patterns**:
  - Deploy Docker containers to 30+ global regions
  - Machines API for fine-grained control
  - Built-in Postgres, Redis, and LiteFS
  - Auto-scaling to zero

### Heroku
- **Tools**: `herokuDeploy`, `herokuManageApps`, `herokuManageAddons`
- **Best for**: Quick prototypes, add-on marketplace, developer experience
- **Secrets**: `heroku.apiKey`
- **Patterns**:
  - Buildpack auto-detection
  - Rich add-on marketplace (databases, monitoring, caching)
  - Pipeline-based CI/CD with review apps
  - Dyno-based scaling

### DigitalOcean
- **Tools**: `doCreateDroplet`, `doDeployApp`, `doManageDns`
- **Best for**: Simple VPS needs, Kubernetes, managed databases
- **Secrets**: `digitalocean.token`
- **Patterns**:
  - Droplets for VPS needs
  - App Platform for PaaS experience
  - Managed Kubernetes (DOKS)
  - Spaces for object storage

### Linode (Akamai)
- **Tools**: `linodeDeploy`, `linodeManageInstances`
- **Best for**: Affordable VPS, high-performance compute, data sovereignty
- **Secrets**: `linode.token`
- **Patterns**:
  - Linodes for VPS (competitive pricing)
  - NodeBalancers for load balancing
  - Block and Object Storage
  - Kubernetes (LKE)

### Cloudflare Pages
- **Tools**: `cloudflareDeploy`, `cloudflareManageDns`, `cloudflareManageWorkers`
- **Best for**: Edge-first deployment, Workers for serverless, DNS/CDN, DDoS protection
- **Secrets**: `cloudflare.apiToken`
- **Patterns**:
  - Pages for static + SSR frameworks
  - Workers for serverless at edge (200+ cities)
  - R2 for S3-compatible object storage (no egress fees)
  - D1 for edge SQLite databases

## Provider Selection Decision Tree

1. **What are you deploying?**
   - Static site/SPA → Vercel, Netlify, Cloudflare Pages, or S3+CloudFront
   - Next.js/React → Vercel (first choice), Netlify, Cloudflare Pages
   - Docker containers → Fly.io, Railway, DigitalOcean, AWS
   - Full-stack with database → Railway, Fly.io, Heroku, AWS
   - Serverless functions → Cloudflare Workers, AWS Lambda, Vercel

2. **What is the budget?**
   - Free tier / hobby → Vercel, Netlify, Cloudflare Pages (generous free tiers)
   - Affordable VPS → Linode ($5/mo), DigitalOcean ($4/mo)
   - Cost-optimized production → Cloudflare (no egress), Railway (usage-based)
   - Enterprise / no budget limit → AWS (most features, most complex)

3. **What is the scale?**
   - Prototype / MVP → Railway, Heroku, Vercel
   - Small-medium production → Fly.io, Vercel, Netlify
   - Large-scale / global → AWS, Cloudflare, Fly.io

4. **Special requirements?**
   - Global edge presence → Cloudflare, Fly.io, Vercel
   - Self-managed infrastructure → AWS, DigitalOcean, Linode
   - Managed databases included → Railway, Fly.io, Heroku
   - Data sovereignty / specific region → Linode, DigitalOcean, AWS

## Deployment Workflow

1. **Build** — Ensure the project builds locally (`npm run build`, `docker build`, etc.)
2. **Configure secrets** — Store provider API keys in `credential-vault`
3. **Deploy** — Use the appropriate provider tool
4. **DNS** — Point domain using provider DNS tools or external registrar
5. **Verify** — Check deployment URL and run health checks
6. **Monitor** — Set up logging and alerting through provider dashboard

## Cost Comparison (approximate monthly, small app)

| Provider | Free Tier | Hobby | Production |
|----------|-----------|-------|------------|
| Vercel | Generous | $20/mo | $150+/mo |
| Netlify | Generous | $19/mo | $99+/mo |
| Cloudflare | Generous | Free (Workers) | Usage-based |
| Railway | $5 credit | $5-20/mo | Usage-based |
| Fly.io | 3 shared VMs | $5-15/mo | Usage-based |
| Heroku | None (removed) | $5-25/mo | $50+/mo |
| DigitalOcean | $200 credit (60d) | $4-12/mo | $40+/mo |
| Linode | $100 credit (60d) | $5-10/mo | $40+/mo |
| AWS | 12-month free tier | $5-20/mo | $50+/mo |
