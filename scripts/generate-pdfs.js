#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Extract content from markdown files
function parseResearchFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  // Parse frontmatter fields
  const meta = {};
  frontmatter.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*["']?(.+?)["']?$/);
    if (match) {
      meta[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  });

  // Extract problem framing section
  const problemMatch = body.match(/### Problem Framing\n\n([\s\S]+?)(?=\n##|\n---|\n###|$)/);
  const problemFraming = problemMatch ? problemMatch[1].trim().split('\n\n')[0] : '';

  // Extract key quantitative findings from the content
  const quantitativeFindings = [];

  // Look for specific patterns that indicate key findings
  const sections = body.split(/\n## /);

  sections.forEach(section => {
    // Extract bullet points with quantitative info
    const bullets = section.match(/^- .+/gm) || [];
    bullets.forEach(bullet => {
      if (bullet.match(/\d+%|\d+x|\d+\.?\d*\s*(m\/s|mph|CFM|kW|°C|BTU|"|inches|ft|meters)/i)) {
        quantitativeFindings.push(bullet.replace(/^- /, '').replace(/\*\*/g, ''));
      }
    });

    // Extract key statements from paragraphs that contain important numbers
    const paragraphs = section.split(/\n\n+/);
    paragraphs.forEach(para => {
      // Look for sentences with "scales as", "increases by", "reduces by", etc.
      if (para.match(/(scales? (as|with)|increases? by|reduces? by|requires?|range from|at \d+)/i) &&
          para.match(/\d+%|\d+x|\d+\.?\d*\s*(m\/s|mph|CFM|kW|°C|BTU|"|inches)/i)) {
        const sentences = para.split(/\. /);
        sentences.forEach(sentence => {
          if (sentence.match(/\d+%|\d+x|\d+\.?\d*\s*(m\/s|mph|CFM|kW|°C|BTU)/) &&
              sentence.length < 200) {
            quantitativeFindings.push(sentence.replace(/\*\*/g, '').trim());
          }
        });
      }
    });
  });

  // Look for table data - extract key rows
  const tables = body.match(/\|.+\|[\s\S]+?\n\n/g) || [];
  tables.forEach(table => {
    const rows = table.split('\n').filter(row => row.startsWith('|') && !row.match(/^\|[-\s:]+\|$/));
    // Skip header row, take a few key data rows
    rows.slice(1, Math.min(4, rows.length)).forEach(row => {
      const cells = row.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 2 && cells.join(' ').match(/\d+/)) {
        quantitativeFindings.push(cells.join(' — ').replace(/\*\*/g, ''));
      }
    });
  });

  return {
    id: meta.research_id || '',
    title: meta.title || '',
    priority: meta.priority || '',
    version: meta.version || '1.0',
    date: meta.date || '',
    description: meta.description || '',
    summary: meta.summary || '',
    problemFraming: problemFraming.substring(0, 800), // Limit length
    keyFindings: quantitativeFindings.slice(0, 10) // Top 10 findings for 2-page format
  };
}

async function generatePDF(brief) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Generate QR code
  const siteUrl = `https://outdoorventilationstandard.com/research/${brief.id.toLowerCase()}/`;
  const qrDataUrl = await QRCode.toDataURL(siteUrl, { width: 200, margin: 1 });

  // Create HTML content with enhanced layout
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: letter portrait;
      margin: 0.4in;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #1a1a1a;
    }

    .page {
      page-break-after: always;
      min-height: 100vh;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Page 1: Enhanced Cover */
    .cover {
      display: flex;
      flex-direction: column;
      padding: 28px 24px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border: 3px solid #2c5aa0;
      border-radius: 6px;
      min-height: calc(100vh - 0.8in);
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .research-id {
      font-size: 16pt;
      font-weight: 700;
      color: #2c5aa0;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
    }

    .version-meta {
      font-size: 8.5pt;
      color: #6c757d;
      margin-bottom: 16px;
    }

    .title {
      font-size: 18pt;
      font-weight: 700;
      line-height: 1.3;
      color: #1a1a1a;
      margin-bottom: 12px;
    }

    .priority-badge {
      font-size: 9pt;
      color: #fff;
      font-weight: 600;
      background: #2c5aa0;
      padding: 6px 14px;
      border-radius: 20px;
      display: inline-block;
    }

    .summary-section {
      background: #fff;
      padding: 18px;
      border-left: 4px solid #2c5aa0;
      border-radius: 4px;
      margin: 18px 0;
      flex-grow: 1;
    }

    .summary-label {
      font-size: 9pt;
      font-weight: 700;
      color: #2c5aa0;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
    }

    .summary-text {
      font-size: 10pt;
      line-height: 1.65;
      color: #212529;
      margin-bottom: 14px;
    }

    .problem-box {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      padding: 12px;
      margin-top: 12px;
    }

    .problem-label {
      font-size: 8.5pt;
      font-weight: 700;
      color: #856404;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .problem-text {
      font-size: 9pt;
      line-height: 1.55;
      color: #856404;
    }

    .footer {
      text-align: center;
      padding-top: 16px;
      border-top: 2px solid #dee2e6;
      margin-top: auto;
    }

    .qr-code {
      margin: 0 auto 10px;
      display: block;
    }

    .url {
      font-size: 8.5pt;
      color: #6c757d;
      margin-bottom: 6px;
    }

    .site-name {
      font-size: 10pt;
      font-weight: 700;
      color: #2c5aa0;
    }

    /* Page 2: Detailed Findings */
    .content {
      padding: 24px 20px;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #2c5aa0;
      margin-bottom: 14px;
      padding-bottom: 6px;
      border-bottom: 2px solid #2c5aa0;
    }

    .findings-grid {
      display: grid;
      gap: 10px;
    }

    .finding-card {
      background: #f8f9fa;
      border-left: 3px solid #2c5aa0;
      padding: 10px 12px;
      border-radius: 3px;
    }

    .finding-text {
      font-size: 9.5pt;
      line-height: 1.6;
      color: #212529;
    }

    .value-prop {
      background: linear-gradient(135deg, #2c5aa0 0%, #1a4278 100%);
      color: #fff;
      padding: 18px;
      border-radius: 6px;
      margin-top: 18px;
    }

    .value-prop-title {
      font-size: 12pt;
      font-weight: 700;
      margin-bottom: 8px;
      text-align: center;
    }

    .value-prop-text {
      font-size: 9pt;
      line-height: 1.65;
      opacity: 0.95;
      text-align: center;
    }

    .full-paper-cta {
      background: #fff;
      border: 2px solid #2c5aa0;
      padding: 14px;
      border-radius: 6px;
      text-align: center;
      margin-top: 16px;
    }

    .cta-title {
      font-size: 11pt;
      font-weight: 700;
      color: #2c5aa0;
      margin-bottom: 6px;
    }

    .cta-list {
      font-size: 8.5pt;
      color: #495057;
      line-height: 1.7;
    }

    .watermark {
      text-align: center;
      font-size: 7.5pt;
      color: #adb5bd;
      margin-top: 18px;
      padding-top: 10px;
      border-top: 1px solid #e9ecef;
    }

    strong {
      font-weight: 700;
      color: #1a1a1a;
    }
  </style>
</head>
<body>
  <!-- Page 1: Enhanced Cover with Problem Context -->
  <div class="page cover">
    <div class="header">
      <div class="research-id">${brief.id}</div>
      <div class="version-meta">${brief.priority} • Version ${brief.version} • ${brief.date}</div>
      <h1 class="title">${brief.title}</h1>
      <div class="priority-badge">${brief.priority}</div>
    </div>

    <div class="summary-section">
      <div class="summary-label">Executive Summary</div>
      <div class="summary-text">${brief.summary}</div>

      ${brief.problemFraming ? `
      <div class="problem-box">
        <div class="problem-label">The Challenge</div>
        <div class="problem-text">${brief.problemFraming}</div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <img src="${qrDataUrl}" alt="QR Code" class="qr-code" width="130" height="130">
      <div class="site-name">Outdoor Ventilation Standard</div>
      <div class="url">Scan for full research paper</div>
    </div>
  </div>

  <!-- Page 2: Key Findings & Value Proposition -->
  <div class="page content">
    <div class="section">
      <h2 class="section-title">Key Quantitative Findings</h2>
      <div class="findings-grid">
        ${brief.keyFindings.map(finding => `
          <div class="finding-card">
            <div class="finding-text">${finding}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="value-prop">
      <div class="value-prop-title">Why This Research Matters</div>
      <div class="value-prop-text">
        This research provides the first physics-based, quantitative methodology for outdoor cooking
        ventilation design. These findings enable proper hood sizing, CFM specification, and mounting
        height selection — preventing the common failures that occur when indoor assumptions are applied outdoors.
      </div>
    </div>

    <div class="full-paper-cta">
      <div class="cta-title">📄 The Full Research Paper Includes:</div>
      <div class="cta-list">
        ✓ Complete derivations and governing equations<br>
        ✓ Quantitative design tables and correction factors<br>
        ✓ Engineering methodology with worked examples<br>
        ✓ Interactive calculation tools and diagrams<br>
        ✓ Full reference bibliography and validation data
      </div>
    </div>

    <div class="watermark">
      ${brief.id} Quick Summary • Outdoor Ventilation Standard<br>
      outdoorventilationstandard.com/research/ • Page 2 of 2
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputPath = path.join(__dirname, '..', 'static', 'downloads', 'summaries', `${brief.id}-Summary.pdf`);

  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();

  const stats = fs.statSync(outputPath);
  const fileSizeKB = (stats.size / 1024).toFixed(1);

  console.log(`✓ Generated ${brief.id}-Summary.pdf (${fileSizeKB} KB)`);

  return { id: brief.id, size: fileSizeKB };
}

async function generateAllPDFs() {
  console.log('Starting enhanced PDF generation for all research papers...\n');

  const contentDir = path.join(__dirname, '..', 'content', 'research');
  const files = fs.readdirSync(contentDir).filter(f => f.startsWith('rb-') && f.endsWith('.md'));

  const results = [];

  for (const file of files) {
    try {
      const filePath = path.join(contentDir, file);
      const brief = parseResearchFile(filePath);

      if (!brief) {
        console.error(`✗ Failed to parse ${file}`);
        continue;
      }

      const result = await generatePDF(brief);
      results.push(result);
    } catch (error) {
      console.error(`✗ Failed to generate ${file}: ${error.message}`);
    }
  }

  console.log('\n========================================');
  console.log('Enhanced PDF Generation Complete');
  console.log('========================================');
  console.log(`Total generated: ${results.length} of ${files.length}`);
  console.log(`Average size: ${(results.reduce((sum, r) => sum + parseFloat(r.size), 0) / results.length).toFixed(1)} KB`);
  console.log(`Total size: ${results.reduce((sum, r) => sum + parseFloat(r.size), 0).toFixed(1)} KB`);
  console.log('\nOutput directory: static/downloads/summaries/');
}

generateAllPDFs().catch(console.error);
