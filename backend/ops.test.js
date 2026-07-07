const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbooks Documentation', () => {
    const runbooksPath = path.resolve(__dirname, '../docs/runbooks.md');

    it('should exist', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain incident response steps', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Incident Response Steps/i);
    });

    it('should contain recovery procedures', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Recovery Procedures/i);
    });

    it('should contain an offline mode fallback guide', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Offline Mode Fallback Guide/i);
    });
  });

  describe('CI/CD Rollback Pipeline', () => {
    const rollbackYmlPath = path.resolve(__dirname, '../.github/workflows/rollback.yml');

    it('should exist', () => {
      expect(fs.existsSync(rollbackYmlPath)).toBe(true);
    });

    it('should have a valid YAML structure', () => {
      const content = fs.readFileSync(rollbackYmlPath, 'utf8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('should be configured for manual dispatch with target_commit input', () => {
      const content = fs.readFileSync(rollbackYmlPath, 'utf8');
      const doc = yaml.load(content);

      expect(doc.on).toHaveProperty('workflow_dispatch');
      expect(doc.on.workflow_dispatch).toHaveProperty('inputs');
      expect(doc.on.workflow_dispatch.inputs).toHaveProperty('target_commit');
    });

    it('should use environment variables for inputs to prevent injection', () => {
      const content = fs.readFileSync(rollbackYmlPath, 'utf8');
      const doc = yaml.load(content);

      const steps = doc.jobs.rollback.steps;
      const rollbackStep = steps.find(step => step.name === 'Perform Rollback');

      expect(rollbackStep).toBeDefined();
      expect(rollbackStep.env).toHaveProperty('TARGET_COMMIT');
      // Verify it doesn't directly interpolate inputs in the run command
      expect(rollbackStep.run).not.toMatch(/\$\{\{\s*inputs\.target_commit\s*\}\}/);
      expect(rollbackStep.run).toMatch(/\$TARGET_COMMIT/);
    });

    it('should have write permissions for contents', () => {
      const content = fs.readFileSync(rollbackYmlPath, 'utf8');
      const doc = yaml.load(content);

      expect(doc.jobs.rollback.permissions).toBeDefined();
      expect(doc.jobs.rollback.permissions.contents).toBe('write');
    });
  });
});
