const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  const rootDir = path.resolve(__dirname, '..');

  describe('Operational Runbooks (docs/runbooks.md)', () => {
    const runbooksPath = path.join(rootDir, 'docs', 'runbooks.md');

    it('should exist', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain Incident response steps', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Incident response steps/i);
    });

    it('should contain Recovery procedures', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Recovery procedures/i);
    });

    it('should contain Offline mode fallback guide', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Offline mode fallback guide/i);
    });
  });

  describe('CI/CD Rollback Workflow (.github/workflows/rollback.yml)', () => {
    const rollbackWorkflowPath = path.join(rootDir, '.github', 'workflows', 'rollback.yml');

    it('should exist', () => {
      expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);
    });

    it('should be valid YAML', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('should have workflow_dispatch trigger with target_commit input', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      const workflow = yaml.load(content);

      expect(workflow).toBeDefined();
      expect(workflow.on).toBeDefined();
      expect(workflow.on.workflow_dispatch).toBeDefined();
      expect(workflow.on.workflow_dispatch.inputs).toBeDefined();
      expect(workflow.on.workflow_dispatch.inputs.target_commit).toBeDefined();
    });

    it('should map inputs to environment variables and use git read-tree', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      const workflow = yaml.load(content);

      const rollbackJob = workflow.jobs.rollback;
      expect(rollbackJob).toBeDefined();

      const performRollbackStep = rollbackJob.steps.find(step => step.name === 'Perform Rollback');
      expect(performRollbackStep).toBeDefined();

      // Check for env mapping to prevent command injection
      expect(performRollbackStep.env).toBeDefined();
      expect(performRollbackStep.env.TARGET_COMMIT).toBe('${{ inputs.target_commit }}');

      // Check for git read-tree command
      expect(performRollbackStep.run).toMatch(/git read-tree -um HEAD "\$TARGET_COMMIT"/);

      // Check for detached HEAD push
      expect(performRollbackStep.run).toMatch(/git push origin HEAD:\$\{\{ github\.ref_name \}\}/);
    });
  });
});
