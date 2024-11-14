---
title: Tools
description: Tools and utilities.
date: 2024-11-14
images: [/images/og/tools.png]
---

## 1: Draw.io diagram/drawing template generator

Generates a [Draw.io](https://app.diagrams.net/) template that broadly follows the
[BS EN ISO 5457:1999](https://knowledge.bsigroup.com/products/technical-product-documentation-sizes-and-layout-of-drawing-sheets?version=standard)
standard for technical product documentation.

To generate a template, fill in the form below and click the "Generate Template" button. Note that the template is
generated in the Draw.io XML format, with all non-text elements locked.

<div id="generator" class="form-container">
  <div class="form-row">
    <label for="companyName" class="form-label">Company:</label>
    <div class="form-input">
      <input type="text" id="companyName" value="ACME INC" >
    </div>
  </div>
  <div class="form-row">
    <label for="drawingTitle" class="form-label">Drawing Title:</label>
    <div class="form-input">
      <input type="text" id="drawingTitle" value="WIDGET GENERAL ARRANGEMENT" >
    </div>
  </div>
  <div class="form-row">
    <label for="authorName" class="form-label">Author:</label>
    <div class="form-input">
      <input type="text" id="authorName" value="JOHN DOE" >
    </div>
  </div>
  <div class="form-row">
    <label for="reviewedBy" class="form-label">Reviewer:</label>
    <div class="form-input">
      <input type="text" id="reviewedBy" value="JANE SMITH" >
    </div>
  </div>
  <div class="form-row">
    <label for="paperSize" class="form-label">Sheet Size:</label>
    <div class="form-input">
      <select id="paperSize">
        <option value="A4">A4</option>
        <option value="A3">A3</option>
        <option value="A2" selected>A2</option>
        <option value="A1">A1</option>
      </select>
    </div>
  </div>
  <div class="form-row">
    <div class="form-input-offset">
      <button id="generateBtn">Generate Template</button>
    </div>
  </div>
</div>
<style>
.form-container {
  max-width: 600px;
}
.form-row {
  display: flex;
  align-items: center;
}
.form-label {
  width: 120px;
  padding-right: 15px;
  font-size: 0.9em;
  flex-shrink: 0;
}
.form-input {
  flex-grow: 1;
}
.form-input input, .form-input select {
  width: 100%;
}
button {
  padding: 2px;
}

</style>
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
