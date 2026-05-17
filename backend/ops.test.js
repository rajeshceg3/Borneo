const fs = require('fs');
const path = require('path');

describe('Operational Readiness', () => {
  test('docs/runbooks.md exists and contains required sections', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  test('.github/workflows/rollback.yml exists and implements read-tree', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const content = fs.readFileSync(rollbackPath, 'utf8');
    expect(content).toContain('git read-tree');
    expect(content).toContain('TARGET_COMMIT');
  });
});
