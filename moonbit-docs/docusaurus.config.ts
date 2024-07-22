import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import fs from 'node:fs/promises'
import rehypeShiki, { RehypeShikiOptions } from '@shikijs/rehype'
import { bundledLanguages } from 'shiki'

const rehypeShikiPlugin = [
  rehypeShiki,
  {
    themes: {
      light: 'github-light',
      dark: 'github-dark'
    },
    langs: [
      ...(Object.keys(bundledLanguages) as Array<
        keyof typeof bundledLanguages
      >),
      async () =>
        JSON.parse(
          await fs.readFile('./languages/moonbit.tmLanguage.json', 'utf-8')
        )
    ],
    onError: (error) => {
      console.log(error)
    }
  } as RehypeShikiOptions
]

const config: Config = {
  title: 'MoonBit Docs',
  tagline: 'MoonBit Docs',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.moonbitlang.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'moonbit', // Usually your GitHub org/user name.
  projectName: 'MoonBit-Docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh']
  },

  presets: [
    [
      'classic',
      {
        debug: true,
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          rehypePlugins: [rehypeShikiPlugin]
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],
  plugins: [],

  themeConfig: {
    // Replace with your project's social cardhy
    navbar: {
      title: 'MoonBit',
      hideOnScroll: true,
      logo: {
        alt: 'MoonBit Logo',
        src: 'img/logo.png',
        href: 'https://www.moonbitlang.com'
      },
      items: [
        {
          to: '/',
          position: 'left',
          label: 'Docs',
          locale: ['en', 'zh']
        },
        {
          to: 'https://moonbitlang.com/blog/',
          label: 'Blog',
          position: 'left',
          locale: ['en']
        },
        {
          to: 'https://moonbitlang.cn/blog/',
          label: 'Blog',
          position: 'left',
          locale: ['zh']
        },
        {
          to: 'https://moonbitlang.com/download/',
          label: 'Download',
          position: 'left',
          locale: ['en']
        },
        {
          to: 'https://moonbitlang.cn/download/',
          label: 'Download',
          position: 'left',
          locale: ['zh']
        },
        {
          to: 'https://moonbitlang.cn/weekly-updates/',
          label: 'Weekly Updates',
          position: 'left',
          locale: ['zh']
        },
        {
          to: 'https://moonbitlang.com/weekly-updates/',
          label: 'Weekly Updates',
          position: 'left',
          locale: ['en']
        },
        {
          to: 'https://moonbitlang.com/gallery/',
          label: 'Gallery',
          position: 'left',
          locale: ['en']
        },
        {
          to: 'https://moonbitlang.cn/gallery/',
          label: 'Gallery',
          position: 'left',
          locale: ['zh']
        },
        {
          to: 'https://moonbitlang.github.io/moonbit-textbook/',
          label: 'Course',
          position: 'left',
          locale: ['en']
        },
        {
          to: 'https://moonbitlang.cn/course/',
          label: 'Course',
          position: 'left',
          locale: ['zh']
        },
        {
          to: 'https://try.moonbitlang.com/',
          label: 'Try',
          position: 'left',
          locale: ['en']
        },
        {
          type: 'dropdown',
          label: 'Community',
          position: 'left',
          items: [
            {
              href: 'https://moonbitlang.com/contributor/',
              label: 'Contributor'
            }
          ],
          locale: ['en']
        },
        {
          to: 'https://try.moonbitlang.cn/',
          label: '试用',
          position: 'left',
          locale: ['zh']
        },
        {
          type: 'dropdown',
          label: '社区',
          position: 'left',
          locale: ['zh'],
          items: [
            {
              href: 'https://moonbitlang.cn/contributor/',
              label: '贡献者'
            },
            {
              href: 'https://moonbitlang.cn/events/',
              label: '活动'
            }
          ]
        },
        {
          type: 'localeDropdown',
          position: 'right',
          locale: ['en', 'zh']
        },
        {
          type: 'custom-DiscordButton',
          position: 'right',
          locale: ['en']
        },
        {
          type: 'custom-GithubButton',
          position: 'right',
          locale: ['en', 'zh']
        }
      ]
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Syntax',
              to: '/',
              locale: ['en']
            },
            {
              label: 'Syntax',
              to: 'https://moonbitlang.cn/docs/syntax/',
              locale: ['zh']
            }
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/moonbitlang/',
              locale: ['en', 'zh']
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/CVFRavvRav',
              locale: ['en']
            },
            {
              label: 'X',
              href: 'https://x.com/moonbitlang',
              locale: ['en']
            },
            {
              label: 'Youtube',
              href: 'http://www.youtube.com/@MoonBit_lang',
              locale: ['en']
            },
            {
              label: 'Reddit',
              href: 'https://www.reddit.com/user/Moonbitlang/',
              locale: ['en']
            },
            {
              label: 'B站',
              href: 'https://space.bilibili.com/1453436642?spm_id_from=333.1007.0.0',
              locale: ['zh']
            },
            {
              label: '知乎',
              href: 'https://www.zhihu.com/people/moonbit',
              locale: ['zh']
            },
            {
              label: '微博',
              href: 'https://weibo.com/u/7852652406',
              locale: ['zh']
            },
            {
              label: '小红书',
              href: 'https://www.xiaohongshu.com/user/profile/636b072f000000001f01c84a',
              locale: ['zh']
            }
          ]
        },
        {
          title: 'Contact Us',
          items: [
            {
              label: 'Email',
              to: 'mailto:support@moonbitlang.com',
              locale: ['zh', 'en']
            }
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'https://moonbitlang.cn/blog/',
              locale: ['zh']
            },
            {
              label: 'Blog',
              to: 'https://moonbitlang.com/blog/',
              locale: ['en']
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MoonBit`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
}

export default config
