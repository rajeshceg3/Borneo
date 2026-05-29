const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbooks Documentation', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');

    it('should exist', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain Incident Response Steps', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/## Incident Response Steps/i);
    });

    it('should contain Recovery Procedures', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/## Recovery Procedures/i);
    });

    it('should contain an Offline Mode Fallback Guide', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/## Offline Mode Fallback Guide/i);
    });
  });

  describe('CI/CD Rollback Workflow', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');

    it('should exist', () => {
      expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);
    });

    it('should be valid YAML', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('should implement the rollback strategy using git read-tree', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      const doc = yaml.load(content);

      // Verify the workflow can be dispatched with a target_commit input
      expect(doc.on).toBeDefined();
      expect(doc.on.workflow_dispatch).toBeDefined();
      expect(doc.on.workflow_dispatch.inputs).toBeDefined();
      expect(doc.on.workflow_dispatch.inputs.target_commit).toBeDefined();

      // Verify the rollback job uses git read-tree
      const rollbackJob = doc.jobs.rollback;
      expect(rollbackJob).toBeDefined();

      const hasReadTreeStep = rollbackJob.steps.some(step => {
        return step.run && step.run.includes('git read-tree');
      });
      expect(hasReadTreeStep).toBe(true);

      // Verify the rollback job maps inputs safely via env
      const envMappedStep = rollbackJob.steps.some(step => {
         return step.env && step.env.TARGET_COMMIT === '${{ inputs.target_commit }}';
      });
      expect(envMappedStep).toBe(true);
    });
  });
});
