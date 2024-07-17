# Writing documents

## create a new documents

create a new markdown file and move it into the `moonbit-docs\docs`.
The website will create the new post,The default folder is the English website folder.

If you want to create a new chinese documents, you should move the chinese markdown file to
the `moonbit-docs\i18n\zh\docusaurus-plugin-content-docs\current`.The file path is the same path as the english
path.e.g.

English path:

```
moonbit-docs\docs\your\english\path\yourenglishdocs.md
```

Chinese path:

```
moonbit-docs\i18n\zh\docusaurus-plugin-content-docs\current\your\english\path\yourchinesedocs.md
```

If you create only English documents, the Chinese site will display the English documents you create.

## Add the document link to the sidebar

Once you have completed your document, you can add a link in `sidebar.ts` to make your document appear on the document
sidebar.

How to add it and more detail,please see the [sidebar config](https://docusaurus.io/docs/sidebar/items).

the configure file is in the:`moonbit-docs\sidebar.ts`

## How to see the results of your document displayed on the page

Default(English):

```shell
cd moonbit-docs
pnpm start
```

Chinese:

```shell
cd moonbit-docs
pnpm zhstart
```