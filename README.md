# temp_vite-flocss-sass

Vite + SCSS (FLOCSS) frontend template. Replace project-specific logos and meta information to reuse this template for a new project.

## Required initial steps

- Update `package.json` metadata (name, description, author, repository)
- Add or verify `LICENSE`
- Replace logos and OGP images in `src/assets/images/`
- Edit `src/styles/foundation/_variables.scss` to match the project design
- Prepare environment variables using `.env.example` as a reference

## Quick start (bash)

```bash
# Install Node (example using nvm)
nvm install 18
nvm use 18

# Install dependencies
npm install

# Start development server
npm run dev

# Build
npm run build

# Preview build output
npm run preview

# Lint / Format (auto-fix is a separate command)
npm run lint
npm run format

# Optional: image conversion (requires scripts/convert-images.js)
npm run webp
```

## Template variables

`src/index.html` contains placeholders that should be replaced per project. Main placeholders:

- %SITE_TITLE%
- %SITE_DESCRIPTION%
- %OG_TITLE%
- %OG_DESCRIPTION%
- %OG_IMAGE%
- %SITE_URL%
- %OG_SITE_NAME%
- %FAVICON_URL%
- %SHOP_URL%
- %INQUIRY_URL%
- %PROJECT_NAME%
- %PROJECT_BRAND%
- %BRAND_NAME%
- %COMPANY_URL%
- %COMPANY_NAME%

Replace them manually or use an `.env`-based replacement script.

```

```
