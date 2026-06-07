const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbooks Documentation', () => {
    const runbooksPath = path.resolve(__dirname, '../docs/runbooks.md');

    it('should have a runbooks.md file in the docs directory', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain an Incident Response Steps section', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/## Incident Response Steps/i);
    });

    it('should contain a Recovery Procedures section', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/## Recovery Procedures/i);
    });

    it('should contain an Offline Mode Fallback Guide section', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/## Offline Mode Fallback Guide/i);
    });
  });

  describe('Rollback CI/CD Pipeline', () => {
    const rollbackPath = path.resolve(__dirname, '../.github/workflows/rollback.yml');

    it('should have a rollback.yml file in .github/workflows', () => {
      expect(fs.existsSync(rollbackPath)).toBe(true);
    });

    it('should securely map inputs to environment variables and implement git read-tree rollback', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      const doc = yaml.load(content);

      // Ensure it's a workflow dispatch trigger with a target_commit input
      expect(doc.on).toBeDefined();
      expect(doc.on.workflow_dispatch).toBeDefined();
      expect(doc.on.workflow_dispatch.inputs).toBeDefined();
      expect(doc.on.workflow_dispatch.inputs.target_commit).toBeDefined();

      const jobs = doc.jobs;
      expect(jobs).toBeDefined();

      let rollbackJob = null;
      for (const [key, job] of Object.entries(jobs)) {
        if (job.steps) {
          rollbackJob = job;
          break;
        }
      }
      expect(rollbackJob).toBeDefined();

      // Check for necessary permissions
      expect(rollbackJob.permissions).toBeDefined();
      expect(rollbackJob.permissions.contents).toBe('write');

      const steps = rollbackJob.steps;
      expect(steps).toBeDefined();

      // Find the rollback step
      const rollbackStep = steps.find(step => step.run && step.run.includes('git read-tree'));
      expect(rollbackStep).toBeDefined();

      // Ensure target_commit is passed via env, not direct interpolation
      expect(rollbackStep.env).toBeDefined();
      const hasEnvMapping = Object.values(rollbackStep.env).some(val => val === '${{ inputs.target_commit }}');
      expect(hasEnvMapping).toBe(true);

      // Ensure git commit and git push are also present
      expect(rollbackStep.run).toMatch(/git commit/);
      expect(rollbackStep.run).toMatch(/git push origin HEAD:\$\{\{ github.ref_name \}\}/);

      // Ensure inputs are not directly interpolated in the run command
      expect(rollbackStep.run).not.toMatch(/\$\{\{.*inputs\.target_commit.*\}\}/);
    });
  });
});
