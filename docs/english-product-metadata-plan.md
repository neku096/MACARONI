# English Product Metadata Plan

## Current State

- `data/products.json` does not have dedicated English metadata fields.
- English product display is currently handled by runtime translation and static English pages.
- This is acceptable for the Cloudflare migration merge as long as existing English pages keep rendering correctly.

## Decision For This Merge

- Do not make a large `data/products.json` schema change before merging `cloudflare-migration` into `main`.
- Keep the current runtime translation approach for now.
- Treat English product metadata as a separate product/SEO task, not a Cloudflare migration requirement.

## Candidate Fields

If English product metadata is added later, use explicit fields instead of overloading Japanese text:

- `enTitle`: full English product title for detail pages and metadata.
- `enShortTitle`: compact card/list title.
- `enDescription`: SEO/meta and summary copy.
- `enDetailArticles`: English structured detail sections, if the Japanese detail body is not runtime translated.
- `enTags`: user-facing English tags.
- `enCategoryLabel`: user-facing English category/type label.

## Rollout Options

### Option A: Priority Products First

Add English metadata only for high-traffic or SEO-sensitive products first.

- Lower risk and easier review.
- Good when only a few product pages need polished English titles/snippets.
- Requires fallback logic for products without English fields.

### Option B: All Products At Once

Add English metadata to every product in one schema migration.

- More consistent data model.
- Larger diff and higher review cost.
- Should wait until validators, admin UI, and rendering fallbacks are ready.

## Recommendation

Use Option A first.

Start with priority products that already have strong English demand or search visibility. After the field shape is stable, extend to all products in a later pass.

Before implementation, update:

- product types and validators,
- admin editing workflow,
- detail page metadata rendering,
- card/list fallbacks,
- English page QA checklist.

## Not In Scope

- No `data/products.json` mass edit in the Cloudflare migration merge.
- No admin UI changes for English fields in this task.
- No product title or product URL changes in this task.
