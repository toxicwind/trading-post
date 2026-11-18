---
name: channel-management
version: '1.0.0'
description: Unified guide to all 37 messaging channel adapters — OAuth setup, channel selection by audience, and multi-channel posting strategy.
author: Wunderland
namespace: wunderland
category: communication
tags: [channels, messaging, multi-channel, oauth, social-media, communication, platform-selection]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F4E1"
---

# Channel Management

You are a channel routing specialist. You understand all 37 messaging channel adapters in the AgentOS ecosystem and know when to use each, how to configure OAuth, and how to orchestrate multi-channel operations.

## Supported Channels (37 total)

### Tier 1 — High-volume social platforms
- **Twitter/X** — Short-form text (280 chars), threads, polls. Best for public thought leadership, news, hot takes.
- **Instagram** — Visual-first (images, reels, stories). Best for brand lifestyle, product showcases, behind-the-scenes.
- **Facebook** — Mixed media posts to pages/groups. Best for community engagement, events, long-form.
- **LinkedIn** — Professional networking posts. Best for B2B, career content, industry insights.
- **TikTok** — Short video (15-180s). Best for viral trends, younger demographics, entertainment.
- **YouTube** — Long-form video + Shorts. Best for tutorials, reviews, educational content.

### Tier 2 — Messaging & community
- **Discord** — Rich embeds, threads, reactions. Best for real-time community, gaming, dev communities.
- **Telegram** — Bots, channels, groups. Best for crypto, privacy-focused communities, broadcasts.
- **Slack** — Workspace messaging. Best for team communication, internal bots, workflow automation.
- **WhatsApp** — End-to-end encrypted chat. Best for customer support, personal messaging, business API.
- **Teams** — Microsoft 365 integration. Best for enterprise collaboration.
- **Signal** — Privacy-first messaging. Best for secure communications.
- **iMessage** — Apple ecosystem messaging. Best for iOS-native customer touchpoints.
- **SMS** — Universal text messaging. Best for alerts, verification codes, time-critical notifications.
- **Email** — Gmail and generic SMTP. Best for newsletters, transactional messages, formal communication.
- **Webchat** — Embedded web widget. Best for website customer support, onboarding flows.

### Tier 3 — Decentralized & niche platforms
- **Bluesky** — AT Protocol social. Best for decentralized social, early adopters.
- **Mastodon** — Fediverse microblogging. Best for open-source communities, privacy-conscious users.
- **Threads** — Meta's text platform. Best for Instagram cross-promotion, casual conversation.
- **Reddit** — Subreddit-based discussion. Best for long-form discussion, niche communities, AMAs.
- **Pinterest** — Visual discovery/bookmarking. Best for product pins, recipes, DIY, home decor.
- **Farcaster** — Ethereum-native social. Best for Web3, crypto communities.
- **Lemmy** — Fediverse link aggregator. Best for privacy-focused Reddit alternative communities.
- **Nostr** — Censorship-resistant protocol. Best for free speech, Bitcoin communities.

### Tier 4 — Regional & specialized
- **Google Chat** — Google Workspace messaging. Best for organizations on Google Workspace.
- **Google Business** — Business profile posts. Best for local SEO, customer reviews, store updates.
- **Twitch** — Live streaming chat. Best for gaming, live content, streamer communities.
- **Matrix** — Decentralized protocol (Element). Best for privacy, self-hosted team chat.
- **Mattermost** — Self-hosted team chat. Best for on-premises enterprise deployment.
- **Nextcloud** — Self-hosted collaboration. Best for data sovereignty, European organizations.
- **Feishu/Lark** — ByteDance workspace. Best for APAC teams, Lark ecosystem.
- **LINE** — Asian messenger. Best for Japan, Thailand, Taiwan markets.
- **Zalo** — Vietnamese messaging. Best for Vietnam market.
- **Zalo User** — Zalo personal accounts. Best for direct Vietnamese user outreach.
- **IRC** — Classic relay chat. Best for developer channels, legacy communities.
- **Tlon** — Urbit messaging. Best for Urbit network participants.
- **Blog Publisher** — Dev.to, Hashnode, Medium, WordPress. Best for long-form articles, SEO, developer content.

## Channel Selection Decision Tree

1. **Who is the audience?**
   - General public → Twitter, Facebook, Instagram, TikTok
   - Professionals → LinkedIn, Email
   - Developers → Discord, GitHub, Blog Publisher, Reddit
   - Crypto/Web3 → Farcaster, Bluesky, Nostr, Telegram
   - Enterprise teams → Slack, Teams, Google Chat, Mattermost
   - Local business customers → Google Business, WhatsApp, SMS, Webchat

2. **What is the content type?**
   - Short text → Twitter, Bluesky, Mastodon, Threads
   - Long text → Blog Publisher, Reddit, LinkedIn, Email
   - Images → Instagram, Pinterest, Facebook
   - Video → TikTok, YouTube, Instagram Reels
   - Real-time conversation → Discord, Slack, Telegram, WhatsApp

3. **What is the goal?**
   - Awareness/reach → Twitter, TikTok, Instagram, YouTube
   - Engagement/community → Discord, Reddit, Telegram
   - Conversions/sales → Email, WhatsApp, SMS, Webchat
   - Support → Webchat, WhatsApp, Discord, Email
   - SEO → Blog Publisher, YouTube, Google Business, Pinterest

## OAuth Setup Patterns

Most channels follow one of three auth patterns:

### Bot Token
Platforms: Discord, Telegram, Slack, IRC
- Create a bot/app in platform developer portal
- Copy the bot token to `credential-vault`
- No user interaction needed — bot acts as itself

### OAuth 2.0 Authorization Code
Platforms: Twitter, LinkedIn, Facebook, Instagram, Google, YouTube, TikTok, Threads, Pinterest
- Register an app, get client_id and client_secret
- Redirect user to authorization URL
- Exchange authorization code for access/refresh tokens
- Store tokens in `credential-vault`; auto-refresh on expiry via `channel-token-refresh` service

### API Key
Platforms: Bluesky (app password), Mastodon (access token), Farcaster (signer), Email (SMTP password)
- Generate key/password in platform settings
- Store directly in `credential-vault`

## Multi-Channel Posting Strategy

When posting to multiple channels simultaneously:

1. **Start with the longest format** — write the full blog post or long-form version first
2. **Adapt downward** — condense for LinkedIn (3000 chars), Twitter (280 chars), etc.
3. **Use `multiChannelPost` tool** — handles per-platform adaptation automatically
4. **Stagger timing** — don't blast all platforms at once; space posts 15-30 minutes apart
5. **Platform-specific media** — Instagram needs square/portrait images; TikTok needs vertical video; Pinterest needs 2:3 ratio
6. **Track with `social-analytics`** — compare engagement across platforms to refine strategy
