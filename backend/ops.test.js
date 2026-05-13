const fs = require('fs');
const path = require('path');

describe('Operational Readiness', () => {
  it('should have Operational Runbooks documented', () => {
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

  it('should have a Rollback Pipeline CI/CD Workflow', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    const exists = fs.existsSync(rollbackWorkflowPath);
    expect(exists).toBe(true);

    if (exists) {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf-8');
      expect(content).toContain('name: Rollback Deployment');
      expect(content).toContain('git read-tree -um HEAD $COMMIT_SHA');
      expect(content).toContain('git push origin HEAD:${{ github.ref_name }}');
    }
  });
});
