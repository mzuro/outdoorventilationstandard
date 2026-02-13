#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Read all research markdown files
const contentDir = path.join(__dirname, '..', 'content', 'research');
const files = fs.readdirSync(contentDir).filter(f => f.startsWith('rb-') && f.endsWith('.md'));

async function generateFullPaper(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract frontmatter and body
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
  if (!frontmatterMatch) {
    console.error(`No frontmatter found in ${filePath}`);
    return;
  }

  const frontmatter = frontmatterMatch[1];
  const markdown = frontmatterMatch[2];

  // Parse frontmatter
  const meta = {};
  frontmatter.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*["']?(.+?)["']?$/);
    if (match) {
      meta[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  });

  const researchId = meta.research_id || path.basename(filePath, '.md').toUpperCase();

  // Convert markdown to HTML
  const htmlContent = marked(markdown);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: letter portrait;
      margin: 0.75in 0.75in 1in 0.75in;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Georgia, 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
    }

    /* Cover page */
    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 100vh;
      padding: 60px 40px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border: 4px solid #2c5aa0;
    }

    .research-id-cover {
      font-size: 24pt;
      font-weight: 700;
      color: #2c5aa0;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 16px;
    }

    .title-cover {
      font-size: 28pt;
      font-weight: 700;
      line-height: 1.3;
      color: #1a1a1a;
      margin-bottom: 24px;
      max-width: 600px;
    }

    .meta-cover {
      font-size: 12pt;
      color: #495057;
      margin-bottom: 40px;
    }

    .program-name {
      font-size: 14pt;
      font-weight: 600;
      color: #2c5aa0;
      margin-top: 40px;
    }

    .url-cover {
      font-size: 10pt;
      color: #6c757d;
      margin-top: 12px;
      word-break: break-all;
    }

    /* Content styling */
    .content {
      counter-reset: h2counter;
    }

    h1 {
      font-size: 20pt;
      font-weight: 700;
      color: #2c5aa0;
      margin: 32px 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 3px solid #2c5aa0;
      page-break-after: avoid;
    }

    h2 {
      font-size: 14pt;
      font-weight: 700;
      color: #1a1a1a;
      margin: 28px 0 12px 0;
      page-break-after: avoid;
    }

    h2:before {
      counter-increment: h2counter;
      content: counter(h2counter) ". ";
    }

    h3 {
      font-size: 12pt;
      font-weight: 700;
      color: #495057;
      margin: 20px 0 10px 0;
      page-break-after: avoid;
    }

    h4 {
      font-size: 11pt;
      font-weight: 700;
      font-style: italic;
      color: #495057;
      margin: 16px 0 8px 0;
      page-break-after: avoid;
    }

    p {
      margin-bottom: 12px;
      text-align: justify;
    }

    strong {
      font-weight: 700;
      color: #1a1a1a;
    }

    em {
      font-style: italic;
    }

    blockquote {
      margin: 16px 0;
      padding: 12px 20px;
      background: #f8f9fa;
      border-left: 4px solid #2c5aa0;
      font-family: 'Courier New', monospace;
      font-size: 10pt;
    }

    ul, ol {
      margin: 12px 0 12px 24px;
    }

    li {
      margin-bottom: 6px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }

    th {
      background: #2c5aa0;
      color: #fff;
      font-weight: 700;
      padding: 8px 6px;
      text-align: left;
      border: 1px solid #1a4278;
    }

    td {
      padding: 6px;
      border: 1px solid #dee2e6;
    }

    tr:nth-child(even) {
      background: #f8f9fa;
    }

    code {
      font-family: 'Courier New', monospace;
      background: #f8f9fa;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 10pt;
    }

    hr {
      margin: 24px 0;
      border: none;
      border-top: 2px solid #dee2e6;
    }

    /* Page numbers and footer */
    @page {
      @bottom-right {
        content: counter(page);
        font-size: 9pt;
        color: #6c757d;
      }
      @bottom-center {
        content: "${meta.research_id || ''} • Outdoor Ventilation Standard";
        font-size: 8pt;
        color: #adb5bd;
      }
    }

    /* Avoid breaking inside paragraphs and lists */
    p, li {
      orphans: 3;
      widows: 3;
    }

    /* Keep headings with following content */
    h1, h2, h3, h4 {
      page-break-after: avoid;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover-page">
    <div class="research-id-cover">${meta.research_id || ''}</div>
    <h1 class="title-cover">${meta.title || 'Research Paper'}</h1>
    <div class="meta-cover">
      ${meta.priority || ''} • Version ${meta.version || '1.0'}<br>
      ${meta.date || ''} • Status: ${meta.status || 'Complete'}
    </div>
    <div class="program-name">Outdoor Ventilation Standard</div>
    <div class="url-cover">outdoorventilationstandard.com</div>
  </div>

  <!-- Content -->
  <div class="content">
    ${htmlContent}
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputPath = path.join(__dirname, '..', 'static', 'downloads', 'papers', `${researchId}-Full.pdf`);

  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size: 9pt; color: #6c757d; width: 100%; text-align: right; padding-right: 0.75in;">
        <span class="pageNumber"></span>
      </div>
    `,
    margin: {
      top: '0.75in',
      bottom: '1in',
      left: '0.75in',
      right: '0.75in'
    }
  });

  await browser.close();

  const stats = fs.statSync(outputPath);
  const fileSizeKB = (stats.size / 1024).toFixed(1);

  console.log(`✓ Generated ${researchId}-Full.pdf (${fileSizeKB} KB)`);

  return { id: researchId, size: fileSizeKB };
}

async function generateAll() {
  console.log('Starting full paper PDF generation...\n');

  const results = [];

  for (const file of files) {
    try {
      const filePath = path.join(contentDir, file);
      const result = await generateFullPaper(filePath);
      if (result) results.push(result);
    } catch (error) {
      console.error(`✗ Failed to generate ${file}: ${error.message}`);
    }
  }

  console.log('\n========================================');
  console.log('Full Paper PDF Generation Complete');
  console.log('========================================');
  console.log(`Total generated: ${results.length} papers`);
  console.log(`Total size: ${results.reduce((sum, r) => sum + parseFloat(r.size), 0).toFixed(1)} KB`);
  console.log('\nOutput directory: static/downloads/papers/');
}

generateAll().catch(console.error);
