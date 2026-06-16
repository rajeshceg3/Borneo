const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  const rootDir = path.resolve(__dirname, '..');

  describe('Operational Runbooks', () => {
    it('should have an operational runbooks file', () => {
      const runbooksPath = path.join(rootDir, 'docs', 'runbooks.md');
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain required sections in runbooks', () => {
      const runbooksPath = path.join(rootDir, 'docs', 'runbooks.md');
      const content = fs.readFileSync(runbooksPath, 'utf8');

      expect(content).toMatch(/Incident response steps/i);
      expect(content).toMatch(/Recovery procedures/i);
      expect(content).toMatch(/Offline mode fallback guide/i);
    });
  });

  describe('CI/CD Rollback Workflow', () => {
    const workflowPath = path.join(rootDir, '.github', 'workflows', 'rollback.yml');

    it('should have a rollback workflow file', () => {
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it('should be a valid YAML file', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('should be manually triggerable (workflow_dispatch)', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const doc = yaml.load(content);
      expect(doc.on).toHaveProperty('workflow_dispatch');
      expect(doc.on.workflow_dispatch).toHaveProperty('inputs');
      expect(doc.on.workflow_dispatch.inputs).toHaveProperty('target_commit');
    });

    it('should have write permissions for contents', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const doc = yaml.load(content);
      expect(doc.permissions).toBeDefined();
      expect(doc.permissions.contents).toBe('write');
    });

    it('should configure git with bot credentials', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const doc = yaml.load(content);
      const steps = doc.jobs.rollback.steps;

      const gitConfigStep = steps.find(step =>
        step.run && step.run.includes('git config user.name') && step.run.includes('github-actions[bot]')
      );
      expect(gitConfigStep).toBeDefined();
    });

    it('should use git read-tree for rollback', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const doc = yaml.load(content);
      const steps = doc.jobs.rollback.steps;

      const rollbackStep = steps.find(step =>
        step.run && step.run.includes('git read-tree')
      );
      expect(rollbackStep).toBeDefined();
      expect(rollbackStep.run).toMatch(/git read-tree -um HEAD/);
    });
  });
});
