const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbook Documentation', () => {
    const runbookPath = path.join(__dirname, '../docs/runbooks.md');

    it('should have a runbooks.md file in the docs directory', () => {
      expect(fs.existsSync(runbookPath)).toBe(true);
    });

    it('should contain Incident response steps', () => {
      const content = fs.readFileSync(runbookPath, 'utf8');
      expect(content).toMatch(/Incident Response Steps/i);
    });

    it('should contain Recovery procedures', () => {
      const content = fs.readFileSync(runbookPath, 'utf8');
      expect(content).toMatch(/Recovery Procedures/i);
    });

    it('should contain Offline mode fallback guide', () => {
      const content = fs.readFileSync(runbookPath, 'utf8');
      expect(content).toMatch(/Offline Mode Fallback Guide/i);
    });
  });

  describe('CI/CD Rollback Pipeline', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');

    it('should have a rollback.yml file in .github/workflows', () => {
      expect(fs.existsSync(rollbackPath)).toBe(true);
    });

    it('should be a valid YAML file', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('should have permissions: contents: write to allow committing', () => {
        const content = fs.readFileSync(rollbackPath, 'utf8');
        const parsedYaml = yaml.load(content);

        // Find if rollback job has permissions
        expect(parsedYaml.jobs).toBeDefined();
        expect(parsedYaml.jobs.rollback).toBeDefined();
        expect(parsedYaml.jobs.rollback.permissions).toBeDefined();
        expect(parsedYaml.jobs.rollback.permissions.contents).toBe('write');
    });
  });
});
