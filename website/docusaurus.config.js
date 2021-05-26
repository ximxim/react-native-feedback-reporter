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
          position: 'right',
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
          title: 'Documentation',
          items: [
            {
              label: 'Installation',
              to: 'docs/install',
            },
            {
              label: 'API reference',
              to: 'docs/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
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
              label: 'GitHub',
              href: 'https://github.com/ximxim/react-native-feedback-reporter',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ximxim. Built with Docusaurus.`,
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
