const fs = require('fs');
const path = require('path');

describe('Operational Readiness', () => {
  it('should have operational runbooks documentation', () => {
    const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have a rollback CI/CD pipeline', () => {
    const rollbackPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const content = fs.readFileSync(rollbackPath, 'utf8');
    expect(content).toContain('name: Instant Rollback');
    expect(content).toContain('git read-tree -um HEAD $TARGET_COMMIT');
    expect(content).toContain('git push origin HEAD:${{ github.ref_name }}');
  });
});
