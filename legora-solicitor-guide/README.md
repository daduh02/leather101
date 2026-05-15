# A Family Law Solicitor's Practical Guide to Legora

A clean, professional, Vercel-ready Next.js guide for UK family law solicitors using Legora as a practical legal work assistant for divorce, financial remedy, children, disclosure and client-care work.

## 1. One-command local setup

Run this command to create the app locally:

```bash
npx create-next-app@latest legora-solicitor-guide --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" && cd legora-solicitor-guide && npm install lucide-react && npm run dev
```

## 2. Files to replace

After the app is created, replace these generated files with the versions in this project:

```text
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
README.md
```

`package.json` only needs `lucide-react` installed, which the one-command setup already does. If you are manually editing dependencies, make sure `lucide-react` is included under `dependencies`.

## 3. How to run locally

From inside the project directory:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

To check the production build:

```bash
npm run build
```

## 4. How to deploy to Vercel

Install and sign in to the Vercel CLI if needed, then run:

```bash
vercel
```

For a production deployment, use:

```bash
vercel --prod
```

## 5. Notes about customising the content

- Keep product wording careful: "depending on your firm's setup", "Legora can assist with", and "always verify output before relying on it".
- Do not imply Legora replaces legal judgement.
- Do not add real client data, confidential information, or privileged material.
- Do not add a Legora logo unless one is supplied and approved for use.
- Adapt prompts to your firm's policies, family law practice areas, risk appetite and approved AI workflow.
- Verify all legal authorities, citations, court rules, paragraph references, dates, parties, children details and financial figures before relying on any AI output.
- Treat safeguarding, without prejudice material, privilege, vulnerability and client confidentiality with particular care.
