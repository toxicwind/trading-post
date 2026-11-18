---
name: cloud-ops
version: '1.0.0'
description: Manage cloud infrastructure — monitor deployments, scale resources, manage databases, and handle domain operations across all supported providers.
author: Wunderland
namespace: wunderland
category: infrastructure
tags: [cloud, devops, infrastructure, monitoring, scaling, database, dns, ops]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U00002601"
    homepage: https://wunderland.sh/docs/skills/cloud-ops
---

# Cloud Operations

Manage and monitor cloud infrastructure across all supported providers. Handle scaling, monitoring, database operations, DNS management, and troubleshooting.

## Capabilities

### Deployment Management
- Check deployment status and health across providers
- Trigger re-deployments and rollbacks
- View build logs and error details
- Manage environment variables

### Scaling
- Scale Heroku dynos up/down
- Scale Fly.io machines (count, size, region)
- Resize Linode instances
- Scale DigitalOcean droplets or App Platform

### Database Operations
- Provision databases (Railway Postgres/Redis/MySQL/MongoDB, Heroku Postgres/Redis, DO Managed DB)
- View connection strings
- Monitor database health

### DNS Management
- Add/update/remove DNS records across all registrars
- Check DNS propagation status
- Configure SSL certificates
- Set up domain redirects (www → root, etc.)

### Monitoring & Troubleshooting
- View deployment logs (Heroku, Railway, Fly.io)
- Check resource utilization
- Diagnose DNS misconfigurations
- Verify SSL certificate status

## Provider-Specific Operations

### Vercel
- `vercelListProjects` — see all projects
- `vercelGetDeployment` — check build/deploy status
- `vercelSetEnvVars` — manage env vars
- `vercelConfigureDomain` — domain operations

### Cloudflare
- `cfListProjects` — see all Pages projects
- `cfConfigureDns` — manage DNS records
- `cfCreateWorker` — deploy Workers

### DigitalOcean
- `doListResources` — see apps and droplets
- `doDeployApp` — trigger redeploy
- `doManageDns` — DNS operations
- `doDeleteResource` — teardown resources

### Heroku
- `herokuGetLogs` — view recent logs
- `herokuScaleDynos` — scale up/down
- `herokuAddAddon` — provision add-ons

### Railway
- `railwayListServices` — see projects/services
- `railwayGetLogs` — view logs
- `railwayAddDatabase` — provision databases

### Fly.io
- `flyListApps` — see apps and machines
- `flyScaleApp` — scale machines
- `flyCreateVolume` — persistent storage

### AWS
- `awsManageRoute53` — DNS operations
- `awsConfigureCloudFront` — CDN configuration
- `awsConfigureLambda` — serverless functions

### Linode
- `linodeListInstances` — see all instances
- `linodeManageDns` — DNS operations
- `linodeDeleteInstance` — teardown
- `linodeCreateNodeBalancer` — load balancing

## Domain Operations

### Common DNS Records
| Type | Use Case | Example |
|------|----------|---------|
| A | Root domain → IP | `@ → 76.76.21.21` |
| AAAA | Root domain → IPv6 | `@ → 2606:4700::1` |
| CNAME | Subdomain → hostname | `www → cname.vercel-dns.com` |
| TXT | Verification, SPF, DKIM | `@ → "v=spf1 include:..."` |
| MX | Email routing | `@ → mail.provider.com` |
| NS | Nameserver delegation | `@ → ns1.provider.com` |

### SSL/TLS
- **Vercel, Netlify, Cloudflare**: Auto-provisioned via Let's Encrypt
- **AWS CloudFront**: Requires ACM certificate (free, auto-renewing)
- **Heroku**: Auto on paid dynos, manual on free
- **Railway, Fly.io**: Auto-provisioned
- **Linode, DigitalOcean droplets**: Use certbot or Caddy for auto-SSL

## Best Practices

1. **Always use HTTPS** — all providers support free SSL
2. **Set environment variables before deploying** — build-time vars need to exist at build
3. **Use preview deployments** for testing before production
4. **Monitor costs** — cloud resources accrue charges
5. **Clean up unused resources** — delete test deployments and databases
6. **Use managed databases** when possible — avoid self-hosting on VPS unless needed
7. **Configure www redirect** — point www CNAME to provider, add redirect rule root↔www
