const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have runbook documentation', () => {
    const runbookPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbookPath)).toBe(true);

    const runbookContent = fs.readFileSync(runbookPath, 'utf8');
    expect(runbookContent).toContain('Incident Response Steps');
    expect(runbookContent).toContain('Recovery Procedures');
    expect(runbookContent).toContain('Offline Mode Fallback Guide');
  });

  it('should have a CI/CD rollback pipeline', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);

    const rollbackContent = fs.readFileSync(rollbackWorkflowPath, 'utf8');
    const parsedYaml = yaml.load(rollbackContent);

    expect(parsedYaml.name).toBe('Rollback');
    expect(parsedYaml.on.workflow_dispatch.inputs).toHaveProperty('target_commit');
    expect(parsedYaml.permissions.contents).toBe('write');

    // Check if step exists with correct command structure
    const steps = parsedYaml.jobs.rollback.steps;
    const rollbackStep = steps.find(s => s.name === 'Perform Rollback');
    expect(rollbackStep).toBeDefined();
    expect(rollbackStep.run).toContain('git read-tree -um HEAD "$TARGET_COMMIT"');
    expect(rollbackStep.run).toContain('git commit -m "Rollback to commit $TARGET_COMMIT"');
    expect(rollbackStep.run).toContain('git push origin HEAD:${{ github.ref_name }}');
    expect(rollbackStep.env.TARGET_COMMIT).toBe('${{ inputs.target_commit }}');
  });
});
