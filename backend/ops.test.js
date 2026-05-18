const fs = require('fs');
const path = require('path');

describe('Operational Readiness', () => {
  it('should have Operational Runbooks documentation', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    const exists = fs.existsSync(runbooksPath);
    expect(exists).toBe(true);

    if (exists) {
      const content = fs.readFileSync(runbooksPath, 'utf-8');
      expect(content).toContain('Incident Response Steps');
      expect(content).toContain('Recovery Procedures');
      expect(content).toContain('Offline Mode Fallback Guide');
    }
  });

  it('should have a CI/CD rollback pipeline configuration', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    const exists = fs.existsSync(rollbackPath);
    expect(exists).toBe(true);

    if (exists) {
      const content = fs.readFileSync(rollbackPath, 'utf-8');
      expect(content).toContain('name: Rollback');
      expect(content).toContain('git read-tree');
    }
  });
});
