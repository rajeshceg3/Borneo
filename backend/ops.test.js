const fs = require('fs');
const path = require('path');

describe('Operational Readiness', () => {
  it('should have a runbooks documentation file', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    const exists = fs.existsSync(runbooksPath);
    expect(exists).toBe(true);

    if (exists) {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toContain('Incident Response');
      expect(content).toContain('Recovery Procedures');
      expect(content).toContain('Offline Mode Fallback');
    }
  });

  it('should have a CI/CD rollback pipeline', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    const exists = fs.existsSync(rollbackPath);
    expect(exists).toBe(true);

    if (exists) {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      expect(content).toContain('git read-tree');
      expect(content).toContain('target_commit');
    }
  });
});
