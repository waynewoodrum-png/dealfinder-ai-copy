# dealfinder-ai-copy

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_BDlb3AQJdEp4GCuRVnTArCLpb8Xf)

## Monetization and AI helper setup

Retail storefront links are scaffolded for affiliate or sponsored placements. Add approved network values in Vercel Environment Variables before treating them as revenue-generating ads:

- `AFFILIATE_LINK_WRAPPER_BASE` — optional network deep-link wrapper prefix
- `AMAZON_ASSOCIATES_TAG` — optional Amazon Associates tag
- `AFFILIATE_COMMISSION_RATE` — optional estimated commission rate for projections
- `NEXT_PUBLIC_RESTAURANT_LINK_WRAPPER_BASE` — optional reservation, coupon, or restaurant affiliate link-wrapper prefix
- `NEXT_PUBLIC_DATE_NIGHT_LINK_WRAPPER_BASE` — optional date-night bundle, event, or local coupon link-wrapper prefix
- `NEXT_PUBLIC_DELIVERY_LINK_WRAPPER_BASE` — optional delivery-service, ordering, or local delivery campaign link-wrapper prefix
- `NEXT_PUBLIC_COUPON_LINK_WRAPPER_BASE` — optional coupon redemption or click-tracking link-wrapper prefix
- `AI_GATEWAY_API_KEY` — required for live AI helper responses
- `AI_HELPER_MODEL` — optional model override, defaults to `openai/gpt-5-mini`

Restaurant revenue and growth options built into the UI:

- Sponsored restaurant slots for local businesses
- Reservation, ordering, or delivery click links
- DoorDash, Uber Eats, and local delivery search actions
- Coupon cards with codes, expiration dates, copy-code actions, and redemption links
- Coupon redemption tracking hooks
- Best-match deal scoring after coupon savings, without handling food orders
- Zip-targeted “eat under $50” budget deals
- Premium date-night bundles with restaurant, venue, and dessert placements
- Growth campaigns with UTM links, share prompts, and merchant outreach templates
- Merchant package pricing for featured zip placements, coupons, and local sponsorships
- Merchant dashboard route for campaign drafts and paid-placement pilots
- Public `/merchants` lead-capture page for restaurants and local businesses
- SEO pages: `/deals/[zip]`, `/restaurants-under-50/[zip]`, `/date-night-deals/[zip]`
- Recipe discovery with budget, diet, cuisine, prep-time, and grocery source positioning
- Future grocery search integrations for retailer pricing, loyalty deals, recipe search, and multi-store grocery discovery
- Deal watchlist for target prices, rollback-style drops, and upcoming sale-day reminders

The current implementation uses sample restaurant inventory, coupon inventory, and search links that include the user's zip code. Users finish orders with the restaurant or delivery provider; connect official delivery, reservation, coupon, menu, grocery, recipe, loyalty-deal, retailer price, and notification APIs when approved partner access is available. Growth links use UTM parameters so future analytics can attribute referrals, social campaigns, and merchant outreach. Merchant package payments can be added later with Stripe or handled manually for early pilots.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
