---
title: Resources
description: Tools and utilities.
date: 2024-10-20
images: [/images/og/resources.png]
---

## Draw.io drawing template

Select a paper size and click "Generate" to create your Draw.IO template.

<div id="generator" class="form-container">
  <div class="form-row">
    <label for="companyName">Company Name:</label>
    <input type="text" id="companyName" value="ACME INC">
  </div>
  <div class="form-row">
    <label for="drawingTitle">Drawing Title:</label>
    <input type="text" id="drawingTitle" value="WIDGET GENERAL ARRANGEMENT">
  </div>
  <div class="form-row">
    <label for="authorName">Author:</label>
    <input type="text" id="authorName" value="JOHN DOE">
  </div>
  <div class="form-row">
    <label for="reviewedBy">Reviewer:</label>
    <input type="text" id="reviewedBy" value="JANE SMITH">
  </div>
  <div class="form-row">
    <label for="paperSize">Sheet Size:</label>
    <select id="paperSize">
      <option value="A4">A4</option>
      <option value="A3">A3</option>
      <option value="A2" selected>A2</option>
      <option value="A1">A1</option>
    </select>
  </div>
  <div class="form-row">
    <button id="generateBtn">Generate Template</button>
  </div>
</div>
<script src="/js/drawio-generator/constants.js" type="module"></script>
<script src="/js/drawio-generator/utils.js" type="module"></script>
<script src="/js/drawio-generator/grid.js" type="module"></script>
<script src="/js/drawio-generator/draw.js" type="module"></script>
<script src="/js/drawio-generator/main.js" type="module"></script>
<script type="module">
import { PAPER_SIZES } from '/js/drawio-generator/constants.js';
import { generateDrawioTemplate } from '/js/drawio-generator/main.js';
function downloadFile(content, filename, type = 'application/xml') {
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function generateAndDownload(
  paperSize,
  companyName,
  drawingTitle,
  authorName,
  reviewedBy
  ) {
  const xmlString = generateDrawioTemplate(
    paperSize,
    companyName,
    drawingTitle,
    authorName,
    reviewedBy
  );
  downloadFile(xmlString, 'template.drawio');
}
document.getElementById('generateBtn').addEventListener('click', () => {
  const paperSizeSelect = document.getElementById('paperSize');
  const paperSize = PAPER_SIZES[paperSizeSelect.value];
  const config = {
    paperSize: paperSize,
    companyName: document.getElementById('companyName').value,
    drawingTitle: document.getElementById('drawingTitle').value,
    authorName: document.getElementById('authorName').value,
    reviewedBy: document.getElementById('reviewedBy').value
  };
  generateAndDownload(
    config.paperSize,
    config.companyName,
    config.drawingTitle,
    config.authorName,
    config.reviewedBy
  );
});
</script>
