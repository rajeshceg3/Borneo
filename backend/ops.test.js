const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have runbook documentation with required sections', () => {
    const runbookPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbookPath)).toBe(true);

    const content = fs.readFileSync(runbookPath, 'utf8');
    expect(content).toMatch(/Incident Response Steps/i);
    expect(content).toMatch(/Recovery Procedures/i);
    expect(content).toMatch(/Offline Mode Fallback Guide/i);
  });

  it('should have a rollback GitHub Actions workflow with secure inputs', () => {
    const workflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);

    const content = fs.readFileSync(workflowPath, 'utf8');
    const parsed = yaml.load(content);

    // Verify trigger and inputs
    expect(parsed.on).toBeDefined();
    expect(parsed.on.workflow_dispatch).toBeDefined();
    expect(parsed.on.workflow_dispatch.inputs).toBeDefined();
    expect(parsed.on.workflow_dispatch.inputs.target_commit).toBeDefined();

    // Verify permissions for github-actions[bot]
    expect(parsed.jobs.rollback.permissions).toBeDefined();
    expect(parsed.jobs.rollback.permissions.contents).toBe('write');

    // Verify safe injection in run step
    expect(content).toMatch(/env:\s*TARGET_COMMIT:\s*\$\{\{\s*inputs\.target_commit\s*\}\}/);
    expect(content).toMatch(/git read-tree -um HEAD \$TARGET_COMMIT/);
    expect(content).toMatch(/git push origin HEAD:\$\{\{\s*github\.ref_name\s*\}\}/);
  });
});
