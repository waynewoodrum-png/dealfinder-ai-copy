# Deal Finder AI - Professional Rebuild Architecture

## System Overview

**Deal Finder Commander** - A supervised multi-agent system for verified product searching and deal ranking.

```
┌─────────────────────────────────────────────────────────────┐
│                    Deal Finder Commander                     │
│              (Agent Orchestration & Routing)                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌─────────────┐   ┌──────────────────┐   ┌────────────────┐
   │   Search    │   │  Verification    │   │    Ranking     │
   │    Agent    │   │     Agent        │   │     Agent      │
   └─────────────┘   └──────────────────┘   └────────────────┘
        │                     │                     │
   ┌─────────────┐   ┌──────────────────┐   ┌────────────────┐
   │  Monitoring │   │    Revenue       │   │   Marketing    │
   │    Agent    │   │     Agent        │   │     Agent      │
   └─────────────┘   └──────────────────┘   └────────────────┘
                              │
                   ┌──────────┴──────────┐
                   │                     │
            ┌────────────────┐   ┌──────────────────┐
            │   Operations   │   │  Fraud & Compliance
            │     Agent      │   │     Agent
            └────────────────┘   └──────────────────┘
```

---

## Core Agents

### 1. **Deal Finder Commander**
- **Responsibility**: Receives search requests, routes to appropriate agents, validates outputs
- **Outputs**: Structured search requests, validated deal results
- **Constraints**: No agent may act without commander approval; all actions logged

### 2. **Search Agent**
- **Responsibility**: Searches approved product and merchant sources
- **Data Sources**:
  - DataForSEO (Google Shopping + merchant data)
  - eBay Browse API (parts, vehicles, categories, GTIN)
  - Best Buy API (electronics, availability)
  - Direct merchant APIs (future expansion)
- **Outputs**: Raw product listings with source URLs, prices, merchant info
- **Constraints**: Never invent data; only return verified, timestamped results

### 3. **Verification Agent**
- **Responsibility**: Confirms price, stock, shipping, expiration, product match
- **Process**:
  - Validate product specifications (tire size, vehicle fitment, etc.)
  - Confirm merchant legitimacy
  - Verify inventory/availability status
  - Calculate delivered price (product + shipping)
  - Check timestamp freshness
  - Flag duplicates and expired listings
- **Outputs**: Verified deal records with confidence scores
- **Constraints**: No verification = no display; price claims require source

### 4. **Ranking Agent**
- **Responsibility**: Scores and ranks results by value, not just lowest price
- **Scoring Factors**:
  - Total delivered cost
  - Merchant reliability (ratings, trust score)
  - Delivery speed and cost
  - Customer reviews
  - Availability certainty
  - User location preference
- **Outputs**: Ranked deal list with value scores
- **Constraints**: Sponsored results clearly labeled, cannot outrank better organic deals

### 5. **Monitoring Agent**
- **Responsibility**: Runs 24/7 background checks on saved products and price targets
- **Process**:
  - Monitor saved searches for new deals
  - Check price-target alerts
  - Refresh stale listings
  - Handle API failures gracefully (retry + notify operations)
- **Outputs**: Price update records, alert notifications
- **Constraints**: Retries must prevent duplicates; failures logged

### 6. **Revenue Agent**
- **Responsibility**: Manages affiliate tracking, subscription tracking, and lead generation
- **Tracks**:
  - Click (immediate) vs. Cart Add vs. Sale (delayed confirmation)
  - Affiliate link generation and validation
  - Commission pending → confirmed → paid
  - Subscription plan management (Free, Pro, Auto Pro, Business)
  - Lead generation attribution
- **Outputs**: Revenue records with clear distinction between estimated and confirmed
- **Constraints**: Clicks ≠ revenue; all tracking via Stripe webhooks and merchant APIs

### 7. **Marketing Agent**
- **Responsibility**: Generates and distributes verified content
- **Output Types**:
  - Programmatic SEO landing pages (e.g., "Best 265/70R17 tire prices today")
  - Email and text alerts
  - Social media posts (verified daily deals only)
  - Browser notifications
- **Constraints**: Content pulls from verified deal DB only, never fabricates promotions

### 8. **Operations Agent**
- **Responsibility**: Monitors system health and errors
- **Monitors**:
  - API failures and rate limits (DataForSEO, eBay, Best Buy)
  - Expired credentials and token refresh
  - Slow or stalled background jobs
  - Database health and backups
- **Outputs**: Alerts, error logs, performance metrics
- **Constraints**: Real-time alerts for critical failures

### 9. **Fraud & Compliance Agent**
- **Responsibility**: Flags suspicious activity and enforces standards
- **Checks**:
  - Merchant legitimacy (blacklists, suspicious claims)
  - Misleading affiliate claims or fake savings stats
  - Unusual account activity (bulk purchases, sign-ups)
  - Competitor price manipulation
- **Outputs**: Flagged records, compliance reports
- **Constraints**: Conservative thresholds; false positives escalated for review

---

## Data Flow Example: User Search "265/70R17 tires near Chattanooga"

1. **Commander** receives search request
2. **Search Agent** queries:
   - DataForSEO: `265/70R17 tires Chattanooga`
   - eBay API: Category + GTIN search
   - Best Buy: If electronics-compatible
3. **Verification Agent** normalizes results:
   - Confirms product specs (size, type, vehicle fitment)
   - Validates merchant URLs
   - Calculates delivered cost
   - Removes duplicates and expired listings
4. **Ranking Agent** scores by:
   - Total delivered price
   - Merchant ratings
   - Delivery time
   - Customer reviews
5. **Commander** approves and returns ranked list
6. **Marketing Agent** may create a landing page: "Best tire prices near Chattanooga"
7. **Revenue Agent** embeds affiliate links with tracking IDs
8. **Monitoring Agent** checks prices hourly for alerts

---

## Non-Negotiable Standards

- ✅ Every result has: merchant, price, availability, retrieval timestamp
- ✅ No demo products in production
- ✅ No unsupported customer statistics
- ✅ Affiliate IDs server-side only (customers cannot edit)
- ✅ All AI actions logged (audit trail)
- ✅ Marketing content links to currently verified deals
- ✅ Background tasks have retries and duplicate protection
- ✅ API keys/secrets server-side only
- ✅ Stripe subscription flows work end-to-end
- ✅ Price alerts survive deployments

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19
- **Backend**: Next.js API routes + OpenAI Agent API
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Search**: Algolia (product/deal indexing)
- **APIs**: DataForSEO, eBay Browse, Best Buy, Stripe, OpenAI
- **Deployment**: Vercel
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS + shadcn/ui

---

## Phase 1 Launch Criteria (MVP)

1. Search Agent + Verification Agent fully functional
2. DataForSEO integration complete and tested
3. Deal records stored and queryable
4. Commander orchestration working
5. Basic ranking (by price + delivery)
6. Affiliate link generation (no live tracking yet)
7. Admin dashboard showing verified deals only
8. All outputs include source/timestamp
9. No AI hallucinations (everything verified)
10. Stripe basic setup for future monetization

---

## Future Phases

**Phase 2**: Revenue Agent + Stripe integration + subscription plans
**Phase 3**: Monitoring Agent + price alerts + background jobs
**Phase 4**: Marketing Agent + SEO landing pages + email campaigns
**Phase 5**: Fraud & Compliance + risk scoring + merchant trust
**Phase 6**: Direct merchant APIs (Best Buy, eBay enhancements)
