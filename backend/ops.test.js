const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness', () => {
  describe('Runbooks', () => {
    const runbooksPath = path.resolve(__dirname, '../docs/runbooks.md');

    it('should exist', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain required sections', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Incident Response Steps/i);
      expect(content).toMatch(/Recovery Procedures/i);
      expect(content).toMatch(/Offline Mode Fallback Guide/i);
    });
  });

  describe('Rollback CI/CD', () => {
    const rollbackPath = path.resolve(__dirname, '../.github/workflows/rollback.yml');

    it('should exist', () => {
      expect(fs.existsSync(rollbackPath)).toBe(true);
    });

    it('should be valid YAML and have necessary steps', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      const doc = yaml.load(content);

      expect(doc).toHaveProperty('name', 'Rollback');
      expect(doc).toHaveProperty('on.workflow_dispatch.inputs.target_commit');

      // Check for git read-tree command and input mapping
      let foundPerformRollback = false;
      const steps = doc.jobs.rollback.steps;
      for (const step of steps) {
         if (step.name === 'Perform Rollback') {
            foundPerformRollback = true;
            expect(step.env).toHaveProperty('TARGET_COMMIT', '${{ inputs.target_commit }}');
            expect(step.run).toMatch(/git read-tree -um @ \$TARGET_COMMIT/);
            expect(step.run).toMatch(/git commit/);
            expect(step.run).toMatch(/git push origin HEAD:\$\{\{ github\.ref_name \}\}/);
         }
      }
      expect(foundPerformRollback).toBe(true);
    });

    it('should have required permissions', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      const doc = yaml.load(content);

      expect(doc.permissions.contents).toBe('write');
    });

    it('should configure git author for automated commits', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      const doc = yaml.load(content);

      let foundGitConfig = false;
      const steps = doc.jobs.rollback.steps;
      for (const step of steps) {
         if (step.name === 'Configure Git') {
            foundGitConfig = true;
            expect(step.run).toMatch(/git config user\.name/);
            expect(step.run).toMatch(/git config user\.email/);
         }
      }
      expect(foundGitConfig).toBe(true);
    });
  });
});
