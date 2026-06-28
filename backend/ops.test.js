const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbooks', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');

    it('should exist at docs/runbooks.md', () => {
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

  describe('CI/CD Rollback Pipeline', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');

    it('should exist at .github/workflows/rollback.yml', () => {
      expect(fs.existsSync(rollbackPath)).toBe(true);
    });

    it('should be valid YAML and have necessary rollback steps', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      const doc = yaml.load(content);

      expect(doc).toBeDefined();
      expect(doc.jobs).toBeDefined();
      expect(doc.jobs.rollback).toBeDefined();

      const steps = doc.jobs.rollback.steps;
      expect(steps).toBeDefined();

      const hasReadTree = steps.some(step => step.run && step.run.includes('git read-tree'));
      expect(hasReadTree).toBe(true);

      const hasCommitPermissions = doc.permissions && doc.permissions.contents === 'write';
      expect(hasCommitPermissions).toBe(true);
    });
  });
});
