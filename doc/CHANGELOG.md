# Changelog

## 2026-03-14

- Initialized repository documentation set for the Transportation Management System MVP.
- Added a complete Next.js 15 App Router MVP with authentication UI, RBAC-aware dashboard pages, forms, tables, tracking feed, and customer portal.
- Added Supabase integration utilities, server actions, health route, SQL migration, seed data, storage policies, and edge functions for core shipment workflows.
- Added architecture, schema, setup, and demo documentation plus verification-safe ESLint/TypeScript/build configuration.
- Added a self-service signup page and signup form using Supabase Auth so new users can register and then log in with the same credentials.
- Added an admin-only user access screen so newly signed-up users can be promoted to `ops` or mapped to a customer account from the UI.
- Completed remote Supabase bootstrap for demo readiness: admin account, ops account, customer account, and customer mapping.
- Expanded seed assets with deterministic cross-module demo records and added `pnpm seed:hosted` to populate hosted Supabase data via service-role API.
- Patched server data/action paths to use service-role access, preventing recursive RLS policy failures from blanking operational pages.
- Added an advanced feature hub page (`/advanced`) powered by a new insight engine that activates 14 differentiators from live shipment/order/tracking data without destabilizing core modules.
- Added a dedicated `tsconfig.typecheck.json` and updated the `typecheck` script for stable CI-style type checks independent of `.next/types` churn.
- Refreshed UI design system: updated color/typography tokens, modernized shared primitives, improved sidebar/dashboard shell visuals, and polished login/signup presentation while preserving existing feature behavior.
- Removed legacy event-specific wording from UI text and documentation; updated README links to relative paths to avoid exposing folder names in rendered copy.
- Removed previous branded naming globally and replaced titles/copy with neutral naming.
- Rebranded to `NextGen Transportation Management System (TMS)` across constants, metadata titles, UI labels, and docs, using `NextGen TMS` for compact sidebar display.
- Removed duplicate sidebar brand line so header shows one `NextGen TMS` title with the existing tagline.
- Enhanced sidebar branding visuals with colored gradient layers and improved typography contrast to make `NextGen TMS` and tagline more prominent.
- Adjusted sidebar brand block colors to a refined amber-cyan treatment for a slightly differentiated, higher-focus look.
