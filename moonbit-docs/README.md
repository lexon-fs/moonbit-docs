# Website

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

## Clone

```
git clone https://github.com/moonbitlang/moonbit-docs.git
```

## Installation

1. please copy the file ` .npmrc.example` to `.npmrc`

1. config the token

   `macos` and `linux`

   generate a gitlab token and export it as `NPM_TOKEN`

   ```
   export NPM_TOKEN=glpat-xxxxxxxxxxxx
   ```

   `windows`

   change the ` .npmrc` file and find the text which is `${NPM_TOKEN}`,change it to your token,e.g:

   before:

   ```
   @cm6-moonbit:registry=http://192.168.86.1/api/v4/projects/94/packages/npm/
   //192.168.86.1/api/v4/projects/94/packages/npm/:_authToken="${NPM_TOKEN}"
   @moonpad-wc:registry=http://192.168.86.1/api/v4/projects/95/packages/npm/
   //192.168.86.1/api/v4/projects/95/packages/npm/:_authToken="${NPM_TOKEN}"
   ```

   after:

   ```
   @cm6-moonbit:registry=http://192.168.86.1/api/v4/projects/94/packages/npm/
   //192.168.86.1/api/v4/projects/94/packages/npm/:_authToken="glpat-xxxxxxxxxxxx"
   @moonpad-wc:registry=http://192.168.86.1/api/v4/projects/95/packages/npm/
   //192.168.86.1/api/v4/projects/95/packages/npm/:_authToken="glpat-xxxxxxxxxxxx"
   ```

1. install

   ```
   pnpm install
   ```

## Local Development

```
$ pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```
$ pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

```
$ pnpm buildzh
```

This command generates chinese static content into the `build` directory and can be served using any static contents hosting service.It will overwrite the `build` code generation.If you run the `build` command before.

Switch to the `build` fold and then you can use:

```shell
pnpm run serve
```

To start the production server after build.

## Swizzle

```shell
pnpm swizzleClassic
```

This command generates the rewrite theme components code,the theme components are in the `@docusaurus/theme-classic`,if you want to custom components of this theme,you can run it.

## How to use

please see the `docs` at project fold before you add the new moonbit docs.
