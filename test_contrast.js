const chroma = require('chroma-js');

const check = (name, hex1, hex2) => {
  const contrast = chroma.contrast(hex1, hex2);
  console.log(`${name}: ${contrast.toFixed(2)} (${contrast >= 4.5 ? 'PASS' : 'FAIL'})`);
}

// Check control-btn hover text
check('White on Accent (Normal)', '#ffffff', '#4fcf8c');
check('White on Accent (Night)', '#ffffff', '#3cba73');
check('Dark text on Accent (Normal)', '#0f3d2e', '#4fcf8c');
check('Dark text on Accent (Night)', '#081b14', '#3cba73');
