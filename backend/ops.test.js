const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  const runbooksPath = path.resolve(__dirname, '../docs/runbooks.md');
  const rollbackWorkflowPath = path.resolve(__dirname, '../.github/workflows/rollback.yml');

  describe('Runbooks Documentation', () => {
    it('should exist at docs/runbooks.md', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain Incident Response Steps', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Incident Response/i);
    });

    it('should contain Recovery Procedures', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Recovery Procedures/i);
    });

    it('should contain an Offline Mode Fallback Guide', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Offline Mode Fallback/i);
    });
  });

  describe('CI/CD Rollback Workflow', () => {
    let workflow;

    beforeAll(() => {
      if (fs.existsSync(rollbackWorkflowPath)) {
        const fileContents = fs.readFileSync(rollbackWorkflowPath, 'utf8');
        workflow = yaml.load(fileContents);
      }
    });

    it('should exist at .github/workflows/rollback.yml', () => {
      expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);
    });

    it('should configure write permissions', () => {
      expect(workflow.permissions).toBeDefined();
      expect(workflow.permissions.contents).toBe('write');
    });

    it('should define a rollback job', () => {
      expect(workflow.jobs).toBeDefined();
      expect(workflow.jobs.rollback).toBeDefined();
    });

    it('should include the correct Git commands for rollback', () => {
      const steps = workflow.jobs.rollback.steps;
      let hasReadTree = false;
      let hasPush = false;
      let hasConfig = false;

      steps.forEach(step => {
        if (step.run) {
          if (step.run.includes('git read-tree')) hasReadTree = true;
          if (step.run.includes('git push origin HEAD:${{ github.ref_name }}')) hasPush = true;
          if (step.run.includes('git config user.name') && step.run.includes('github-actions[bot]')) hasConfig = true;
        }
      });

      expect(hasReadTree).toBe(true);
      expect(hasPush).toBe(true);
      expect(hasConfig).toBe(true);
    });

    it('should map inputs to environment variables to prevent command injection', () => {
      const steps = workflow.jobs.rollback.steps;
      let mapsInputs = false;
      steps.forEach(step => {
        if (step.env && step.env.TARGET_COMMIT === '${{ inputs.target_commit }}') {
          mapsInputs = true;
        }
      });
      expect(mapsInputs).toBe(true);
    });
  });
});
