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

## Logos

Open **Browse icons & logos**, then choose **Logos** to browse 26 SVG logos from the [Figma community file](https://www.figma.com/design/vLLJskmSRUdnoxnv4U4TPU/Social-Media-Icons---Logos--Community-?node-id=0-1). Search also finds these in **All**. Logos support themes, custom colours, sizing, transparent containers, sharing, and SVG/PNG export. They use filled shapes, so stroke settings apply only to Lucide icons. Original SVGs and source node references are in `src/assets/social/`.

## Controls

Drag the sidebar divider to resize it, or focus it and use the arrow keys. Double-click resets its width. Sliders support dragging, arrow keys, and typing an exact value. S/M/L restore the standard size, radius, icon scale, and stroke width; editing any slider clears the selected preset.
