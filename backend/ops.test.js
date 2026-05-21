const fs = require('fs');
const path = require('path');

describe('Operational Readiness', () => {
  it('should have a runbooks documentation file with required sections', () => {
    const runbooksPath = path.resolve(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have an instant rollback CI/CD pipeline workflow', () => {
    const rollbackWorkflowPath = path.resolve(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);

    const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
    expect(content).toContain('git read-tree');
    expect(content).toContain('git push origin HEAD:${{ github.ref_name }}');
  });
});
