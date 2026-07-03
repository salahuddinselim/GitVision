export default function RobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: https://gitvision.dev/sitemap.xml

# Block sensitive paths
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/`;
}

RobotsTxt.ctype = "text/plain";