# SDG Industries SEO & Search Engine Optimization Guide

Welcome to the comprehensive SEO configuration guide for **SDG Industries** (`https://sdgindustries.store`). Below is the roadmap of improvements completed, structured data configuration, and checklist of items needing data from the owner.

---

## 1. Summary of Changes Completed

### A. Core SEO & Social Metadata (`index.html`)
- **Branded `<title>`**: Updated to match search intent exactly: `"SDG Industries | Apparel & Streetwear Production Indonesia"`.
- **Meta Description**: Configured with keywords naturally integrated: `"SDG Industries is an Indonesian apparel and streetwear production company creating quality clothing, custom apparel, and fashion products for brands."`.
- **Canonical Setup**: Ensured each query maps to `https://sdgindustries.store/` to avoid crawling duplication or HTTP/HTTPS mismatches.
- **Open Graph / X Cards**: Integrated rich tags for visual previews (`og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`).
- **Hreflang Configuration**: Pre-configured multilingual tags for Indonesian (`id`), English (`en`), and the default router.

### B. High-Fidelity Structured JSON-LD Data
- Embedded a fully compliant `@graph` containing:
  1. `Organization`: Defining `"SDG Industries"`, logo, and social references.
  2. `WebSite`: Standard site properties.
  3. `FAQPage`: Dynamic accepted answers mapped to user-facing queries.

### C. Content & Structural SEO Outline
Reordered homepage heading tags to match Google crawler requirements perfectly:
- **`H1`**: `"Apparel & Streetwear Production in Indonesia"` (In Hero Section)
- **`H2`**: `"About SDG Industries"` (In Hero Section)
- **`H2`**: `"Our Apparel Production"` (In Services Section)
- **`H2`**: `"Custom Clothing & Streetwear"` (In Showroom Products Showcase)
- **`H2`**: `"Why Work With SDG Industries"` (In Feature Specs Streetwear Banner)
- **`H2`**: `"Our Portfolio"` (In Portfolio Showcase Section)
- **`H2`**: `"Contact SDG Industries"` (In Contact / WhatsApp Form Section)

### D. User-Facing FAQs
- Created `/src/components/FaqSection.tsx` and mounted it dynamically. It renders a clean, animated accordion displaying the 5 essential questions matching the search engine schema.

### E. Static Crawlability Configs
- **`/public/robots.txt`**: Added standard permissions for search engine crawlers, disallowed admin routes, and linked the sitemap directly.
- **`/public/sitemap.xml`**: Created a highly clean, valid, search-engine-readable multilingual URL map.

---

## 2. Technical Checkups & Auditing Details
- No multiple `H1` tags on a single page.
- Semantic tags utilized throughout.
- Built-in right-click security mechanisms preserved as requested, while keeping form interactions, keyboard events, and accessibility fully transparent to Googlebot/Bingbot.

---

## 3. Data Required From the Owner for Production Launch

Please review the following list of elements to customize further once live on the official domain:

1. **Brand Logo Asset (og:image)**:
   - Provide a professional brand image (ideal size: `1200 x 630 px`) to save as `/public/og-image.jpg`. This represents the preview thumbnail when sharing links on WhatsApp, Discord, Instagram, and LinkedIn.
2. **Official Instagram / Social Handle Link**:
   - Verify the sameAs link in JSON-LD (currently points to `https://instagram.com/sdgindustries`).
3. **Google Search Console**:
   - Verify your site on [Google Search Console](https://search.google.com/search-console) using either a DNS record or HTML tag verification.
4. **Bing Webmaster Tools**:
   - Submit `https://sdgindustries.store/sitemap.xml` for index acceleration in Bing/Yahoo/DuckDuckGo.
