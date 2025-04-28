/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mctool.pro',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: '' },
    ],
  },
  sitemapSize: 5000,
}