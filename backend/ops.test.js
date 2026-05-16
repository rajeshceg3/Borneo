const fs = require('fs');
const path = require('path');

describe('Operational Readiness Tests', () => {
  it('should have a runbooks.md file with required sections', () => {
    const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have a CI/CD rollback pipeline', () => {
    const rollbackPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const content = fs.readFileSync(rollbackPath, 'utf8');
    expect(content).toContain('git read-tree');
    expect(content).toContain('TARGET_COMMIT');
  });
});
