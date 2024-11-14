---
title: Resources
description: Tools and utilities.
date: 2024-10-20
images: [/images/og/resources.png]
---

## Draw.io drawing template

Select a paper size and click "Generate" to create your Draw.IO template.

<div id="generator">
  <select id="paperSize">
    <option value="A4">A4</option>
    <option value="A3">A3</option>
    <option value="A2">A2</option>
    <option value="A1">A1</option>
  </select>
  <button id="generateBtn">Generate</button>
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
function generateAndDownload(paperSize) {
  const xmlString = generateDrawioTemplate(paperSize);
  downloadFile(xmlString, 'template.drawio');
}
document.getElementById('generateBtn').addEventListener('click', () => {
  const paperSizeSelect = document.getElementById('paperSize');
  const paperSize = PAPER_SIZES[paperSizeSelect.value];
  generateAndDownload(paperSize);
});
</script>
