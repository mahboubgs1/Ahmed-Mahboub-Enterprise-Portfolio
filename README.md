# Ahmed Mahboub — Enterprise Transformation Portfolio

An executive portfolio for Enterprise Applications Leader and digital transformation leadership opportunities. It presents ERP transformation, finance systems knowledge, executive analytics, digital transformation, and technology cost optimization through a polished interactive experience.

## Features

- Executive landing page and positioning
- CEO dashboard with consistent filters and multi-level drill-down
- CFO view with P&L, GL, Chart of Accounts, cost-center, and aging concepts
- CIO view with application portfolio and before/after optimization
- Interactive subscription savings and ROI calculator
- Deterministic, rules-based executive insights
- Four concise transformation case studies
- Responsive, keyboard-accessible design with reduced-motion support

All figures are fictional demonstration data. No confidential employer, tenant, financial, or system information is included.

## Local preview

```bash
npm install
npm run dev
```

Open the local address shown in the terminal.

## GitHub Pages

The included workflow exports and publishes automatically:

1. Create a GitHub repository and push this project to `main`.
2. In **Settings → Pages**, select **GitHub Actions** as the source.
3. The public URL format will be:

   `https://<github-username>.github.io/<repository-name>/`

## Customize before publishing

Contact links are set in `app/portfolio-app.tsx`:

- Email → `mahboub80@gmail.com`
- LinkedIn → `eng-ahmed-mahboub-1a79191a`
- GitHub → `mahboubgs1`

Update fictional figures in `app/portfolio-app.tsx`. Add an approved CV file under `public/` and link it from the landing page when ready.

## Structure

- `app/page.tsx` — site entry
- `app/portfolio-app.tsx` — content, demo data, dashboards, and interactions
- `app/globals.css` — executive visual system and responsive styles
- `public/` — static assets and future CV
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment

## Privacy and accuracy

Career statements avoid unsupported quantified claims. Portfolio outcomes are marked illustrative or demo unless they reflect approved experience evidence.
