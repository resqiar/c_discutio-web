# What's This?

This is an example of a simple CRUD web application build with NextJS which consume [Golang API](https://github.com/resqiar/go-http-api/)s.

**This is neither a production-ready nor following best practices project, which solely has a role for college assignments.**

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## REQUIREMENTS

Requirements before installing, make sure you have all these stuff:

1. [NodeJS](https://nodejs.org/en/download/)
2. [PostgreSQL](https://www.postgresql.org/download/)
3. [Golang API](https://github.com/resqiar/go-http-api) (Backend), refer to its [documentation](https://github.com/resqiar/go-http-api#whats-this)

## INSTALLATION

First, run the install packages:

```bash
npm install
# or
yarn install
```

Second, build the project

```bash
npm run build
# or
yarn build
```

Finally, start the project

```bash
npm run start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
