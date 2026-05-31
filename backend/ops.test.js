const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have runbooks documentation with required sections', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const runbooksContent = fs.readFileSync(runbooksPath, 'utf8');

    // Check for required sections
    expect(runbooksContent).toContain('Incident Response Steps');
    expect(runbooksContent).toContain('Recovery Procedures');
    expect(runbooksContent).toContain('Offline Mode Fallback Guide');
  });

  it('should have a valid rollback CI/CD workflow', () => {
    const workflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);

    const workflowContent = fs.readFileSync(workflowPath, 'utf8');

    // Attempt to parse YAML
    let workflow;
    try {
      workflow = yaml.load(workflowContent);
    } catch (e) {
      fail(`Failed to parse rollback.yml: ${e.message}`);
    }

    // Basic structure validation
    expect(workflow).toBeDefined();
    expect(workflow.name).toBe('Rollback');
    expect(workflow.on).toBeDefined();
    expect(workflow.on.workflow_dispatch).toBeDefined();
    expect(workflow.on.workflow_dispatch.inputs).toBeDefined();
    expect(workflow.on.workflow_dispatch.inputs.target_commit).toBeDefined();

    // Check for specific steps and environment variable usage to prevent injection
    const rollbackJob = workflow.jobs.rollback;
    expect(rollbackJob).toBeDefined();

    const steps = rollbackJob.steps;
    expect(steps).toBeDefined();

    const performRollbackStep = steps.find(step => step.name === 'Perform Rollback');
    expect(performRollbackStep).toBeDefined();

    // Verify environment variable mapping is used instead of direct interpolation
    expect(performRollbackStep.env).toBeDefined();
    expect(performRollbackStep.env.TARGET_COMMIT).toBe('${{ inputs.target_commit }}');

    // Verify the run script uses the environment variable
    expect(performRollbackStep.run).toContain('$TARGET_COMMIT');
    expect(performRollbackStep.run).not.toContain('${{ inputs.target_commit }}');
  });
});
