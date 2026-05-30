const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Operational Runbooks (docs/runbooks.md)', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    let runbooksContent;

    beforeAll(() => {
      if (fs.existsSync(runbooksPath)) {
        runbooksContent = fs.readFileSync(runbooksPath, 'utf8');
      }
    });

    it('should exist', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain Incident Response Steps', () => {
      expect(runbooksContent).toMatch(/Incident Response/i);
    });

    it('should contain Recovery Procedures', () => {
      expect(runbooksContent).toMatch(/Recovery Procedures/i);
    });

    it('should contain an Offline Mode Fallback Guide', () => {
      expect(runbooksContent).toMatch(/Offline Mode/i);
    });
  });

  describe('CI/CD Rollback Workflow (.github/workflows/rollback.yml)', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    let rollbackConfig;
    let rollbackContent;

    beforeAll(() => {
      if (fs.existsSync(rollbackPath)) {
        rollbackContent = fs.readFileSync(rollbackPath, 'utf8');
        try {
          rollbackConfig = yaml.load(rollbackContent);
        } catch (e) {
          // Keep rollbackConfig undefined if parse fails
        }
      }
    });

    it('should exist', () => {
      expect(fs.existsSync(rollbackPath)).toBe(true);
    });

    it('should be valid YAML', () => {
      expect(rollbackConfig).toBeDefined();
    });

    it('should implement git read-tree for rollback', () => {
      expect(rollbackContent).toMatch(/git read-tree/);
    });

    it('should push detached HEAD correctly to prevent rewriting history', () => {
      expect(rollbackContent).toMatch(/git push origin HEAD:\$\{\{ github\.ref_name \}\}/);
    });

    it('should map inputs to environment variables within run steps (prevent command injection)', () => {
      // It should NOT interpolate inputs directly like ${{ inputs.target_commit }} within the 'run' script
      // It should map them in an 'env' block first.

      const jobs = rollbackConfig?.jobs;
      expect(jobs).toBeDefined();

      let foundRollbackJob = false;

      Object.values(jobs).forEach(job => {
        if (job.steps) {
          job.steps.forEach(step => {
            if (step.run && step.run.includes('git read-tree')) {
              foundRollbackJob = true;

              // Ensure that inputs are mapped to env variables
              expect(step.env).toBeDefined();
              expect(Object.values(step.env).some(val => val.includes('inputs.'))).toBe(true);

              // Ensure that the run script does not directly interpolate inputs
              expect(step.run).not.toMatch(/\$\{\{\s*inputs\.[^}]+\s*\}\}/);
            }
          });
        }
      });

      expect(foundRollbackJob).toBe(true);
    });
  });
});
