export const template = () => `<!DOCTYPE html>
<meta charset="utf-8">
<title>trainer</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="icon" href="/favicon.png" />
<link href="https://fonts.googleapis.com/css2?family=Material+Icons"
      rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" 
      rel="stylesheet">
      
<link rel="stylesheet" href="./bundle.css">
<div id="info-container">personal trainer</div>
<svg viewBox="0 0 600 240" class=digits id=digits-minutes>
  <defs>
    <path id=h d="M 0 0 L 10 10 76 10 86 0 76 -10 10 -10 Z" />
  </defs>
  <g id="digits-minutes">
    <g class="d-1" transform="translate(145, 30) skewX(-3)">
      <use class=digit-line href=#h transform="translate(1.5, 0) rotate(0)" />
      <use class=digit-line href=#h transform="translate(89, 1.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(89, 90.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(1.5, 178) rotate(0)" />
      <use class=digit-line href=#h transform="translate(0, 90.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(0, 1.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(1.5, 89) rotate(0)" />
    </g>
    <g class="d-10"  transform="translate(25, 30) skewX(-3)">
      <use class=digit-line href=#h transform="translate(1.5, 0) rotate(0)" />
      <use class=digit-line href=#h transform="translate(89, 1.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(89, 90.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(1.5, 178) rotate(0)" />
      <use class=digit-line href=#h transform="translate(0, 90.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(0, 1.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(1.5, 89) rotate(0)" />
    </g>
  </g>
  <g transform="translate(300, 30) skewX(-3)">
    <circle cx="0" r="10" cy="44" />
    <circle cx="0" r="10" cy="132" />
  </g>
  <g id="digits-seconds" transform="translate(340)">
    <g class="d-1" transform="translate(145, 30) skewX(-3)">
      <use class=digit-line href=#h transform="translate(1.5, 0) rotate(0)" />
      <use class=digit-line href=#h transform="translate(89, 1.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(89, 90.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(1.5, 178) rotate(0)" />
      <use class=digit-line href=#h transform="translate(0, 90.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(0, 1.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(1.5, 89) rotate(0)" />
    </g>
    <g class="d-10"  transform="translate(25, 30) skewX(-3)">
      <use class=digit-line href=#h transform="translate(1.5, 0) rotate(0)" />
      <use class=digit-line href=#h transform="translate(89, 1.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(89, 90.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(1.5, 178) rotate(0)" />
      <use class=digit-line href=#h transform="translate(0, 90.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(0, 1.5) rotate(90)" />
      <use class=digit-line href=#h transform="translate(1.5, 89) rotate(0)" />
    </g>
  </g>
</svg>
<div id="controls-container"></div>
<script src="./script.js" module="true"></script>
`;
