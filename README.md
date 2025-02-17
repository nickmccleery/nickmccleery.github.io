# Personal Website

This repo contains the source for a personal website, built with Hugo and hosted via GitHub Pages and Cloudflare.

## Development Setup

To run the website locally, the git submodule dependencies used for theming must be installed, alongside some other
dependencies. The following commands should allow for initial environment setup:

```bash
git submodule update --init --recursive
brew install pkg-config cairo pango libpng jpeg giflib librsvg vips
npm install
```

After that, the site can be run via `hugo server` or `npm run dev`.

### Note on OG Image Generation

OG image generation is handled via another npm script, `npm run generate-og`. Note that this must be run locally and the
output images committed to the repo in order for them to be deployed successfully.
