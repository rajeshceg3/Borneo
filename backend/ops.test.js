const fs = require('fs');
const path = require('path');

describe('Operational Readiness Tests', () => {
  it('should verify the existence of Operational Runbooks documentation', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    const runbooksExists = fs.existsSync(runbooksPath);
    expect(runbooksExists).toBe(true);
  });

  it('should verify Operational Runbooks content has required sections', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    const content = fs.readFileSync(runbooksPath, 'utf8');

    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should verify the existence of the CI/CD Rollback Workflow file', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    const workflowExists = fs.existsSync(rollbackWorkflowPath);
    expect(workflowExists).toBe(true);
  });

  it('should verify the structure and safety of the CI/CD Rollback Workflow', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');

    expect(content).toContain('TARGET_COMMIT: ${{ inputs.target_commit }}');
    expect(content).toContain('git read-tree -u --reset $TARGET_COMMIT');
    expect(content).toContain('git push origin HEAD:${{ github.ref_name }}');
  });
});
