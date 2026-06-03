const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have runbook documentation with required sections', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toMatch(/# Operational Runbooks/);
    expect(content).toMatch(/## Incident response steps/);
    expect(content).toMatch(/## Recovery procedures/);
    expect(content).toMatch(/## Offline mode fallback guide/);
  });

  it('should have a CI/CD rollback pipeline', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);

    const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
    const doc = yaml.load(content);

    expect(doc.name).toBe('Rollback');
    expect(doc.on.workflow_dispatch).toBeDefined();
    expect(doc.on.workflow_dispatch.inputs.target_commit).toBeDefined();

    const steps = doc.jobs.rollback.steps;
    const rollbackStep = steps.find(step => step.name === 'Perform Rollback');
    expect(rollbackStep).toBeDefined();

    // Check if git read-tree is used to preserve history without rewriting it
    expect(rollbackStep.run).toMatch(/git read-tree -um HEAD \$TARGET_COMMIT/);
    // Ensure we are doing a detached push with target commit
    expect(rollbackStep.run).toMatch(/git push origin HEAD:\$\{\{ github\.ref_name \}\}/);
  });
});