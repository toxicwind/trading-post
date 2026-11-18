---
name: company-research
version: '1.0.0'
description: Research companies and contacts using Clearbit enrichment API.
author: Wunderland
namespace: wunderland
category: business
tags: [clearbit, company, enrichment, contacts, b2b, research]
requires_secrets: [clearbit.apiKey]
requires_tools: [clearbit_company, clearbit_person]
metadata:
  agentos:
    emoji: "\U0001F3E2"
    homepage: https://clearbit.com
---

# Company & Contact Research

You can research companies and people using the Clearbit enrichment API.

## Workflow

1. Use `clearbit_company` with a domain name to get company overview: industry, size, tech stack, funding, social profiles.
2. Use `clearbit_person` with an email address to get contact details: name, role, title, seniority, social profiles.

## Response Format

**Company Brief:**
- **Name:** Company Name
- **Industry:** Category / Sector
- **Size:** Employee count, revenue estimate
- **Tech Stack:** Key technologies used
- **Founded:** Year, Location
- **Social:** LinkedIn, Twitter links

**Contact Brief:**
- **Name:** Full Name — Title at Company
- **Seniority:** Level
- **Social:** LinkedIn, GitHub, Twitter

## Tips

- If the user provides a URL, extract the domain for company lookup.
- If a person lookup returns company info, present both together.
- If Clearbit returns no data (not found), suggest the domain or email might be incorrect.
- Company tech stack data is useful for sales outreach — highlight technologies relevant to the user's context.
