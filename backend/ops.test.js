const fs = require('fs');
const path = require('path');

describe('Operational Readiness Tests', () => {
  it('should verify the existence of runbook documentation', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should verify the existence of the CI/CD rollback pipeline', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);

    const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
    expect(content).toContain('name: Rollback Pipeline');
    expect(content).toContain('git read-tree -um HEAD $TARGET_COMMIT');
    expect(content).toContain('git push origin HEAD:${{ github.ref_name }}');
  });
});
