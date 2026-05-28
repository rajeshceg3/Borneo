const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbooks', () => {
    it('should exist at docs/runbooks.md', () => {
      const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain required sections', () => {
      const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');
      const content = fs.readFileSync(runbooksPath, 'utf8');

      expect(content).toMatch(/Incident Response Steps/i);
      expect(content).toMatch(/Recovery Procedures/i);
      expect(content).toMatch(/Offline Mode Fallback Guide/i);
    });
  });

  describe('Rollback CI/CD Workflow', () => {
    it('should exist at .github/workflows/rollback.yml', () => {
      const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it('should implement rollback correctly', () => {
      const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');
      const content = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(content);

      expect(workflow).toBeDefined();
      expect(workflow.jobs.rollback).toBeDefined();
      expect(workflow.jobs.rollback.steps).toBeDefined();

      const steps = workflow.jobs.rollback.steps;
      const performRollbackStep = steps.find(step => step.name === 'Perform Rollback');

      expect(performRollbackStep).toBeDefined();

      // Check for environment variable mapping for target_commit to avoid command injection
      expect(performRollbackStep.env).toBeDefined();
      expect(performRollbackStep.env.TARGET_COMMIT).toBe('${{ inputs.target_commit }}');

      // Check for git read-tree
      expect(performRollbackStep.run).toMatch(/git read-tree -um HEAD "\$TARGET_COMMIT"/);

      // Check for detached HEAD push (avoid rewriting history)
      expect(performRollbackStep.run).toMatch(/git push origin HEAD:\$\{\{ github\.ref_name \}\}/);
    });
  });
});
