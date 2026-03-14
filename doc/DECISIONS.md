# Decisions

## 2026-03-14

### Decision
Build the project as a Supabase-first Next.js App Router application with server actions handling core mutations.

### Rationale
This keeps the MVP small while still supporting SSR auth, RLS-backed security, and a clear separation between UI and business operations.

### Decision
Keep route optimization intentionally heuristic-based and lane-driven instead of integrating external mapping APIs.

### Rationale
The product brief requested only core features and explicitly excluded advanced AI. A deterministic lane-to-mile estimate is enough to demonstrate shipment planning without adding external dependencies.

### Decision
Use local/system fonts rather than remote `next/font/google` assets.

### Rationale
This keeps builds deterministic in restricted or offline environments and avoids unnecessary network dependencies during verification.

### Decision
Implement advanced differentiators as deterministic server-side feature engines over existing operational data instead of adding high-risk external integrations.

### Rationale
This approach delivers broad advanced capability coverage quickly while minimizing regression risk to the already-stable core shipment workflow.

### Decision
Use neutral product branding across UI and docs, avoiding event-specific wording.

### Rationale
This keeps the platform presentation reusable for demos, client reviews, and production-style handoff without rebranding friction.

### Decision
Standardize product-facing copy to `NextGen Transportation Management System (TMS)` with `NextGen TMS` for compact UI labels.

### Rationale
This keeps naming consistent across all routes and avoids repeated rebranding work during presentation changes.

### Decision
Adopt `NextGen Transportation Management System (TMS)` as the canonical product name and use `NextGen TMS` only where UI space is constrained.

### Rationale
This aligns the implementation with the official project definition while keeping compact surfaces readable.
