const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have an operational runbooks document', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf-8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have a CI/CD rollback workflow', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);

    const fileContent = fs.readFileSync(rollbackWorkflowPath, 'utf8');
    const workflow = yaml.load(fileContent);

    // Verify it triggers via workflow_dispatch
    expect(workflow.on).toHaveProperty('workflow_dispatch');
    expect(workflow.on.workflow_dispatch).toHaveProperty('inputs');
    expect(workflow.on.workflow_dispatch.inputs).toHaveProperty('target_commit');

    // Verify correct permissions
    expect(workflow.permissions).toHaveProperty('contents', 'write');

    // Verify git configuration step exists and uses correct emails
    const steps = workflow.jobs.rollback.steps;
    const hasGitConfig = steps.some(
      (step) =>
        step.name === 'Configure Git' &&
        step.run.includes('git config user.name "github-actions[bot]"') &&
        step.run.includes('git config user.email "github-actions[bot]@users.noreply.github.com"')
    );
    expect(hasGitConfig).toBe(true);

    // Verify the rollback script correctly references TARGET_COMMIT via env
    const hasRollbackLogic = steps.some(
      (step) =>
        step.name === 'Rollback to Target Commit' &&
        step.env &&
        step.env.TARGET_COMMIT === '${{ inputs.target_commit }}' &&
        step.run.includes('git read-tree -um HEAD "$TARGET_COMMIT"') &&
        step.run.includes('git push origin HEAD:${{ github.ref_name }}')
    );
    expect(hasRollbackLogic).toBe(true);
  });
});
