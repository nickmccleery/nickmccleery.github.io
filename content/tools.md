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

## 2: Drawing/PDF diff tool

Generates a visual comparison between the first pages of any two PDF documents. This tool generates the diff by:

1. Extracting the first page from each document and converting it to a raster image.
2. Desaturating each image to yield a grayscale version.
3. Using screen blending modes to apply a blue screen (`#0000FF`) to the original image and an orange screen (`#F28522`)
   to the revision image.
4. Overlaying the revised image with the original image at partial opacity.

---

<div>
  <div class="form-row">
      <label for="custom-file-source" class="form-label">Original:</label>
      <input type="file" accept=".pdf" id="custom-file-source" />
  </div>
  <img id="image-source" class="shadow" />
  <div class="form-row col">
      <label for="custom-file-target" class="form-label">Revision:</label>
      <input type="file" accept=".pdf" id="custom-file-target" />
  </div>
  <img id="image-target" class="shadow" />
  <button id="generate">Generate Diff</button>
  <canvas id="pdf" class="hidden"></canvas>
  <canvas id="working-canvas" class="hidden"></canvas>
  <h3 id="difftitle" class="hidden">Diff output</h3>
  <div class="legend shadow" style="width: 25%;" id="legend">
    <span class="source">⯀</span> Original
    <br />
    <span class="target">⯀</span> Revision
  </div>
  <div class="col">
  <a id="diff-display-wrapper" href="" target="_blank">
      <img id="diff-display" />
  </a>
  </div>
</div>

<script type="module">
import { readFileTo, loadAndRender, generateDiff } from '/js/drawing-diff/main.js';

// Set up source document preview
const inputElementSource = document.getElementById("custom-file-source");
const renderElementSource = document.getElementById("image-source");
inputElementSource.onchange = function(event) {
    readFileTo(event, renderElementSource);
};

// Set up target document preview
const inputElementTarget = document.getElementById("custom-file-target");
const renderElementTarget = document.getElementById("image-target");
inputElementTarget.onchange = function(event) {
    readFileTo(event, renderElementTarget);
};

// Attach diff generator function to button
const generateElement = document.getElementById("generate");
generateElement.onclick = function(event) {
    const sourceImage = document.getElementById("image-source");
    const targetImage = document.getElementById("image-target");
    const workingCanvas = document.getElementById("working-canvas");
    const renderElements = [document.getElementById("diff-display")];
    const wrapper = document.getElementById("diff-display-wrapper");
    
    generateDiff(
        sourceImage,
        targetImage,
        workingCanvas,
        renderElements
    ).then(() => {
        const imageUrl = renderElements[0].src;
        wrapper.href = imageUrl;
        wrapper.onclick = function(e) {
            e.preventDefault();

            // Create a new blob from the data URL for Chrome.
            fetch(imageUrl)
                .then(res => res.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
                    // Clean up the blob URL after opening.
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                });
        };
        document.getElementById("legend").style.display = "block";
        document.getElementById("difftitle").style.display = "block";
    });
};
</script>

<!-- All CSS -->
<style>
button {
  padding: 2px;
}

/* Forms */
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

/*  Drawing diff */
.hidden {
    display: none;
}
.source {
    color: #0000FF;
}
.target {
    color: #F28522;
}
.legend {
    margin-bottom: 5px;
    padding: 5px;
    border: 1px solid #dddddd;
    display: none;
    border-radius: 5px;
}
</style>
