# Search visibility: SEO, local search and AI answers

## Audit and implementation — 24 October 2026

The live Ignition 11 site had two indexable URLs, a generic workshop title, a basic sitemap and AutomotiveBusiness markup without an address. Both public hosts served the same content with a non-www canonical. Important product information mostly lived inside the long homepage.

The update adds:

- Six distinct, statically rendered service pages, plus a service index and workshop/contact page. All ten public pages have unique metadata, canonicals, social previews and actual HTML content available without JavaScript.
- Descriptive local titles and text for Hyderabad and Secunderabad, with useful answers about fitment, materials, scope and enquiries. No repetitive city doorway pages or invented price/stock claims.
- Connected AutoPartsStore/AutomotiveBusiness, WebSite, WebPage, Service, ContactPage and BreadcrumbList JSON-LD. Ratings, reviews, opening hours and precise coordinates are omitted because they have not been verified.
- Visible business name, address, phone and email, with call/WhatsApp/directions actions and links from the homepage, navigation and footer.
- Complete canonical sitemap and crawlable public pages/assets, including access for AI search bots under the wildcard rule. Administrative/backend routes are excluded from crawling; robots.txt is not access control.
- A container-local `www` → non-www permanent redirect, preserving the request path/query. No system Nginx, SSL or backend changes.
- An optional `/llms.txt` generated from the same source facts. It is a discovery convenience, not a recognised Google ranking requirement or a guarantee of AI citations.
- A build-time audit of exported HTML: metadata, canonicals, social URLs, heading count, JSON-LD relationships, service content, sitemap coverage and working internal links/anchors. `npm run build` includes it.

## Business facts and maintenance

`src/lib/site.ts` is the source of truth for contact information. The address and email were recovered from CARTUNEZ's first-party homepage as indexed on 24 October 2026: Shop No. 12 & 13, Veer Hanuman Temple, S.P. Road, Secunderabad, Hyderabad, Telangana 500003; adnan@cartunez.in. Phone +91 99496 95030 was supplied by the owner. Ensure this exactly matches the current Google Business Profile. The Maps link is a business/address search, not a verified place-ID pin.

Use `src/lib/services.ts` to update actual services and product guidance. Keep visible text and schema in agreement. The footer identifies visual previews; they are not represented as customer evidence. Get permission for real customer photographs and publish real vehicle, product and installation details before adding case-study pages. Do not add fictional testimonials, ratings, brand authorisation or performance results.

## After the VPS update

1. In Google Search Console, verify the domain property `cartunez.in` using the DNS token supplied by Google. Keep existing verification records. Submit `https://cartunez.in/sitemap.xml`; inspect the homepage, service index, one service and workshop page and request indexing after deployment. Check indexing/exclusions and Core Web Vitals. Verification requires the owner's Google/DNS access; this repository does not claim to have completed it.
2. In the existing Google Business Profile, verify ownership and keep the exact name, address, phone, primary category, services and actual hours consistent. Add the website URL and current workshop/product/installation photos. Request honest reviews from customers without incentives or review gating. Use the actual profile link on the site once available.
3. Add/import the site in Bing Webmaster Tools, submit the sitemap and inspect crawling. If a verification file or meta token is required, add the real provider-issued value; do not fabricate one. No search-engine account is connected to this repository.
4. Record a baseline of Search Console impressions, clicks, non-brand service queries and enquiry conversions. Review after enough new crawl data arrives. Track leads for interiors, Pioneer/audio, mats, lighting and body kits separately. Mobile field performance matters more than a local lab score.

No tool can promise the highest position. Local visibility also depends on relevance, distance, real reviews, links and competition. AI systems choose their own sources. Publishing the changes makes them available for recrawling; it does not mean they are already indexed.

## Next content worth publishing

- Real before/after installations, with make/model/year, exact product, what changed, scope and customer-approved photos.
- Exact Pioneer model pages with verified specifications, actual availability and vehicle integration notes. The representative receiver demo is not product firmware.
- A practical materials comparison based on samples you actually stock, and service-specific questions drawn from customer enquiries.

Avoid mass-producing pages for every Hyderabad neighbourhood, unverified stock/prices and keyword stuffing. Use accurate editorial update dates only when the content changes.

## Research references

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) — normal SEO fundamentals apply; no special AI schema or machine-readable file is required.
- [Google: local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business) — accurate business details, validation and crawlability.
- [Google: local ranking factors](https://support.google.com/business/answer/7091?hl=en-en) — relevance, distance and prominence; complete business information and real reviews.
- [Google: helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — useful, substantive information for people rather than mass-produced search pages.
- [Google: FAQ rich-result eligibility](https://developers.google.com/search/blog/2023/08/howto-faq-changes) — FAQ rich results are generally restricted to authoritative health/government sites; this update does not promise them.
- [Next.js: metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) and the installed Next 16.4.2 guides were consulted for static metadata/JSON-LD/export behaviour.
