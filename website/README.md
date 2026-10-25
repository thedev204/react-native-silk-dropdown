# Silk Dropdown docs

Next.js documentation site based on the [AriaDocs](https://vercel.com/templates/next.js/documentation-template) template.

## Local development

From the repo root:

```sh
yarn docs
```

Or from this folder:

```sh
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```sh
yarn docs:build
```

## Deploy (Vercel)

1. Import the GitHub repo in the [Vercel dashboard](https://vercel.com/new).
2. Set **Root Directory** to `website`.
3. Framework preset: Next.js. Install/build commands come from `vercel.json`.
4. Deploy. Update the root `README.md` and `package.json` `homepage` with the production URL.
