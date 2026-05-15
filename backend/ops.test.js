const fs = require('fs');
const path = require('path');

describe('Operational Readiness Tests', () => {
  it('should have a runbooks.md file containing Incident Response and Recovery Procedures', () => {
    const runbookPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbookPath)).toBe(true);

    const content = fs.readFileSync(runbookPath, 'utf-8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have a rollback.yml CI/CD pipeline using git read-tree', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const content = fs.readFileSync(rollbackPath, 'utf-8');
    expect(content).toContain('git read-tree');
    expect(content).toContain('TARGET_COMMIT');
    expect(content).toContain('BRANCH_NAME');
  });
});
