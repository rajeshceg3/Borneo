const fs = require('fs');
const path = require('path');

describe('Infrastructure Configuration', () => {
  it('vercel.json should exist and have Cache-Control headers', () => {
    const vercelPath = path.join(__dirname, '../vercel.json');
    expect(fs.existsSync(vercelPath)).toBe(true);

    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    expect(vercelConfig.headers).toBeDefined();

    const assetHeaderConfig = vercelConfig.headers.find(h => h.source === '/assets/(.*)');
    expect(assetHeaderConfig).toBeDefined();

    const cacheControlHeader = assetHeaderConfig.headers.find(h => h.key === 'Cache-Control');
    expect(cacheControlHeader).toBeDefined();
    expect(cacheControlHeader.value).toContain('public');
    expect(cacheControlHeader.value).toContain('immutable');
  });

  it('render.yaml should exist in the root directory', () => {
    const renderPath = path.join(__dirname, '../render.yaml');
    expect(fs.existsSync(renderPath)).toBe(true);

    const renderConfig = fs.readFileSync(renderPath, 'utf8');
    expect(renderConfig).toContain('name: borneo-backend');
    expect(renderConfig).toContain('buildCommand: npm install && npm install --prefix backend');
  });

  it('docs/runbooks.md should exist and contain required sections', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const runbooksContent = fs.readFileSync(runbooksPath, 'utf8');
    expect(runbooksContent).toContain('Incident Response');
    expect(runbooksContent).toContain('Recovery Procedures');
    expect(runbooksContent).toContain('Offline Mode Fallback Guide');
  });
});
