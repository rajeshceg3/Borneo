const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {

  test('Runbooks exist and contain required sections', () => {
    const runbookPath = path.join(__dirname, '..', 'docs', 'runbooks.md');
    expect(fs.existsSync(runbookPath)).toBe(true);

    const runbookContent = fs.readFileSync(runbookPath, 'utf-8');
    expect(runbookContent).toContain('Incident Response');
    expect(runbookContent).toContain('Recovery Procedures');
    expect(runbookContent).toContain('Offline Mode Fallback');
  });

  test('Rollback workflow exists and is correctly configured', () => {
    const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);

    const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
    const workflow = yaml.load(workflowContent);

    // Verify it triggers on workflow_dispatch with a target_commit input
    expect(workflow.on).toHaveProperty('workflow_dispatch');
    expect(workflow.on.workflow_dispatch.inputs).toHaveProperty('target_commit');

    // Find the perform rollback step
    const rollbackJob = workflow.jobs.rollback;
    expect(rollbackJob).toBeDefined();

    const rollbackStep = rollbackJob.steps.find(step => step.name === 'Perform rollback');
    expect(rollbackStep).toBeDefined();

    // Verify it uses the target_commit environment variable securely
    expect(rollbackStep.env).toHaveProperty('TARGET_COMMIT', '${{ inputs.target_commit }}');

    // Verify the run block uses git read-tree and pushes back to the current branch ref without rewriting history
    expect(rollbackStep.run).toContain('git read-tree -um HEAD $TARGET_COMMIT');
    expect(rollbackStep.run).toContain('git push origin HEAD:${{ github.ref_name }}');
  });

});
