<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap Index</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          h1 {
            color: #1a73e8;
            font-weight: normal;
            margin-top: 0;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            border-radius: 5px;
            overflow: hidden;
          }
          th, td {
            padding: 12px 15px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            color: #555;
            font-weight: 500;
          }
          tr:hover {
            background-color: #f9f9f9;
          }
          a {
            color: #1a73e8;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .back-link {
            display: inline-block;
            margin: 10px 0;
            color: #1a73e8;
            font-weight: 500;
          }
          .back-link:hover {
            color: #174ea6;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          .summary {
            margin-bottom: 20px;
            font-size: 14px;
            color: #555;
          }
          @media (max-width: 768px) {
            th, td {
              padding: 8px 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>XML Sitemap Index</h1>
          <div class="summary">
            <p>This is a sitemap index for the site. It lists all the sitemaps available.</p>
          </div>
          
          <xsl:choose>
            <xsl:when test="//sitemap:sitemapindex">
              <p>This sitemap index contains <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps.</p>
              <table>
                <tr>
                  <th>URL</th>
                  <th>Last Modified</th>
                </tr>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </table>
            </xsl:when>
            <xsl:otherwise>
              <p>This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.</p>
              <p><a href="/sitemap.xml" class="back-link">&#8592; Back to index</a></p>
              <table>
                <tr>
                  <th>URL</th>
                  <th>Priority</th>
                  <th>Change Frequency</th>
                  <th>Last Modified</th>
                </tr>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:priority"/>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:changefreq"/>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </table>
              <p><a href="/sitemap.xml" class="back-link">&#8592; Back to index</a></p>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
