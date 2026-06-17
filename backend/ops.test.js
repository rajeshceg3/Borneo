const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbooks Documentation', () => {
    const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');

    it('should have runbooks.md file in docs directory', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain required sections in runbooks.md', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');

      expect(content).toMatch(/## Incident response steps/i);
      expect(content).toMatch(/## Recovery procedures/i);
      expect(content).toMatch(/## Offline mode fallback guide/i);
    });
  });

  describe('CI/CD Rollback Pipeline', () => {
    const rollbackPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');

    it('should have rollback.yml file in .github/workflows directory', () => {
      expect(fs.existsSync(rollbackPath)).toBe(true);
    });

    it('should be a valid YAML file and contain necessary deployment rollback configuration', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');

      // Parse YAML to ensure it's valid
      let doc;
      expect(() => {
        doc = yaml.load(content);
      }).not.toThrow();

      // Basic structure checks based on the required fallback functionality
      expect(doc).toHaveProperty('name', 'Rollback');
      expect(doc).toHaveProperty('on.workflow_dispatch.inputs.target_commit');
      expect(doc).toHaveProperty('jobs.rollback');
    });
  });
});