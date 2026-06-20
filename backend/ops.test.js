const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbooks Documentation', () => {
    const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');

    it('should exist', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain Incident Response Steps', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toContain('Incident Response Steps');
    });

    it('should contain Recovery Procedures', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toContain('Recovery Procedures');
    });

    it('should contain Offline Mode Fallback Guide', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toContain('Offline Mode Fallback Guide');
    });
  });

  describe('CI/CD Rollback Pipeline', () => {
    const rollbackWorkflowPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');

    it('should exist', () => {
      expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);
    });

    it('should be valid YAML and have necessary steps', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      const doc = yaml.load(content);

      expect(doc).toBeDefined();
      expect(doc.name).toBe('Rollback');
      expect(doc.on).toHaveProperty('workflow_dispatch');
      expect(doc.jobs).toHaveProperty('rollback');

      const steps = doc.jobs.rollback.steps;
      const stepNames = steps.map(step => step.name);

      expect(stepNames).toContain('Checkout Repository');
      expect(stepNames).toContain('Perform Rollback');

      const performRollbackStep = steps.find(s => s.name === 'Perform Rollback');
      expect(performRollbackStep.run).toContain('git read-tree');
    });
  });
});
