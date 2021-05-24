/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'React Native Feedback Reporter',
  tagline: 'Fill the communication gap between devs and testers',
  url: 'https://ximxim.github.io',
  baseUrl: '/react-native-feedback-reporter/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ximxim',
  projectName: 'react-native-feedback-reporter',
  themeConfig: {
    navbar: {
      title: 'RNFR',
      logo: {
        alt: 'React Native Feedback Reporter Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/install',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'docs/contributing',
          activeBasePath: 'contributing',
          label: 'Contributing',
          position: 'left',
        },
        {
          href: 'https://github.com/ximxim/react-native-feedback-reporter',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Guides',
              to: '/docs/snapshot-testing',
            },
            {
              label: 'API Reference',
              to: '/docs/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: 'made with ❤️ by ximxim',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/ximxim/react-native-feedback-reporter/tree/master/website',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
