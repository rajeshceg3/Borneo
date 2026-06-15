const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Operational Runbooks', () => {
    it('should exist and contain required sections', () => {
      const runbooksPath = path.resolve(__dirname, '../docs/runbooks.md');
      expect(fs.existsSync(runbooksPath)).toBe(true);

      const runbooksContent = fs.readFileSync(runbooksPath, 'utf8');
      expect(runbooksContent).toContain('Incident Response Steps');
      expect(runbooksContent).toContain('Recovery Procedures');
      expect(runbooksContent).toContain('Offline Mode Fallback Guide');
    });
  });

  describe('Rollback Strategy via CI/CD', () => {
    it('should exist and contain a valid rollback workflow', () => {
      const workflowPath = path.resolve(__dirname, '../.github/workflows/rollback.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);

      const workflowContent = fs.readFileSync(workflowPath, 'utf8');

      // Parse YAML to ensure it's valid
      const parsedWorkflow = yaml.load(workflowContent);

      expect(parsedWorkflow).toBeDefined();
      expect(parsedWorkflow.on.workflow_dispatch.inputs.target_commit).toBeDefined();
      expect(parsedWorkflow.permissions.contents).toBe('write');

      // Check the rollback job
      const rollbackJob = parsedWorkflow.jobs.rollback;
      expect(rollbackJob).toBeDefined();

      // Check that checkout fetch-depth is 0
      const checkoutStep = rollbackJob.steps.find(step => step.uses && step.uses.startsWith('actions/checkout'));
      expect(checkoutStep).toBeDefined();
      expect(checkoutStep.with['fetch-depth']).toBe(0);

      // Verify that the command doesn't interpolate directly but uses an env variable (security best practice from memory)
      const rollbackStep = rollbackJob.steps.find(step => step.name === 'Perform Rollback');
      expect(rollbackStep).toBeDefined();
      expect(rollbackStep.env.TARGET_COMMIT).toBeDefined();
      expect(rollbackStep.run).toContain('git read-tree -um HEAD "$TARGET_COMMIT"');
    });
  });
});
