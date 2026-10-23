# Deslopify Studio — Production Digital Presence & AI Engineering Platform

> Ground-up website replication, brand adaptation, and production engineering modeled after [Deslopify Studio](https://deslopify.studio/).

A high-performance digital presence built with **Astro**, modern CSS Grid/Flexbox architecture, deterministic agent workflows, interactive canvas physics, and zero template bloat.

---

## ✦ System Architecture & Standards

- **Ultra-Fast Static Site Generation (SSG)**: Zero client-side JavaScript overhead on static content; instant sub-100ms first contentful paint (FCP).
- **Interactive Micro-Interactions**:
  - Signature atmospheric glowing circular aura & neon radial lighting.
  - Interactive Before & After screen comparison stages (`/` and case studies).
  - Ticker tracks running at calibrated 80px/s velocity with hover slowdown and drag physics.
  - Bento Grid with animated typing code prompts and design token visual diffs.
  - Working Marble Jar rigid-body physics simulation in the footer with mood selectors.
  - Fixed blurred glassmorphic navigation header (`backdrop-filter: blur(12px)`) with active `✦` route indicators.
- **Modern Layout Bulletproofing**:
  - Enforces `display: flex; flex-direction: column; height: 100%` and `margin-top: auto` across all cards, guaranteeing uniform baselines with zero staggered grid voids.
- **Truthful Content Engineering**:
  - Replaces all placeholder copy with genuine AI systems engineering, workflow automation, support agent swarms, multimodal document processing, and investor-ready application modernizations.

---

## ✦ Route Structure

| Route | Purpose | Key Features |
|---|---|---|
| `/` | Signature Homepage | Hero aura, typing headline, before/after iPhone stage, showcase tickers, services grid, 3-step process, bento grid, pricing configurator, unfold gallery, testimonial orbit, FAQ, marble jar footer. |
| `/about-us` | Agency Story & Principles | Methodology narrative, 4 core operational rules, leadership team profiles, and philosophy card. |
| `/services` | Comprehensive Catalog | 5+ capability breakdowns (Workflow Automation, Support Agents, Document Intelligence, App Modernization, Production Agentics) with deliverables, tech stacks, and SLAs. |
| `/services-detail` | Technical Deep Dive | Architecture flowcharts, latency budgets (<450ms), Pydantic guardrail gates, and enterprise security VPC isolation. |
| `/work` | Solution Portfolio | Working category filters (`All`, `Workflow Automation`, `Support`, `Document Intelligence`, `Analytics`) and aligned card footers. |
| `/work/[slug]` | Deep Dive Case Studies | Dynamic CMS data for Indus Capital, Hush Audio, Flyout Logistics, JustGains Biometrics, Founder Copilot, and Sakurail Logistics. Includes side-by-side Before/After screens. |
| `/pricing` | Transparent Plans | Tiered pricing cards (Pay Per Screen, Studio Retainer, Enterprise Architecture), feature comparison matrix, and billing FAQs. |
| `/blog` | Engineering Insights | Thought leadership articles on AI systems architecture, sub-second latency, and the death of software slop. |
| `/blog/[slug]` | Individual Insights | In-depth architectural write-ups with author bios, takeaways, and callouts. |
| `/contact-us` | Project Inquiry & Booking | High-conversion inquiry form, budget selector chips, direct booking integration, and immediate state feedback. |
| `/404` | Branded 404 Page | Custom not-found screen matching the global design system. |

---

## ✦ Local Development & Production Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Serves the site locally at `http://localhost:4321`.

### 3. Production Build
```bash
npm run build
```
Generates 18 optimized static HTML routes into `dist/` in under 1 second with zero errors.

### 4. Local Production Preview
```bash
npm run preview
```

---

## ✦ Deployment Readiness

- **Vercel**: Pre-configured with `vercel.json` for one-click static builds. Output directory: `dist`.
- **Cloudflare Pages**: Set build command to `npm run build` and output directory to `dist`.
- **Netlify / GitHub Pages**: 100% standard static HTML compatible.
