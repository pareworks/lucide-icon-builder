# Lucide Icon Builder

A small web app that builds themed icon-in-container designs using Edrolo's color palette and Lucide icons. Configure size, radius, stroke, and theme — then copy or download as SVG or PNG.

## Local development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Create a new GitHub repo named `lucide-icon-builder` and push this folder to `main`.
2. In the repo settings → **Pages**, set the source to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`.

The site will be available at `https://<your-username>.github.io/lucide-icon-builder/`.

## Sharing

Click **Share** in the top-right of the artboard to copy a URL that encodes the current configuration. Anyone opening the link will see the same icon.
