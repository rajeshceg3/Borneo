const fs = require('fs');
const path = require('path');

describe('Operational Readiness', () => {
  it('should have a runbooks documentation file with required sections', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    const exists = fs.existsSync(runbooksPath);
    expect(exists).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have a rollback CI/CD workflow file', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    const exists = fs.existsSync(rollbackPath);
    expect(exists).toBe(true);

    const content = fs.readFileSync(rollbackPath, 'utf8');
    expect(content).toContain('git read-tree -um HEAD');
    expect(content).toContain('TARGET_COMMIT');
  });
});
