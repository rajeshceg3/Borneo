const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {

  describe('Runbooks Documentation', () => {
    it('should have a runbooks.md file in the docs directory', () => {
      const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('runbooks.md should contain "Incident response steps", "Recovery procedures", and "Offline mode fallback guide"', () => {
      const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Incident response steps/i);
      expect(content).toMatch(/Recovery procedures/i);
      expect(content).toMatch(/Offline mode fallback guide/i);
    });
  });

  describe('CI/CD Rollback Pipeline', () => {
    it('should have a rollback.yml file in .github/workflows', () => {
      const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
      expect(fs.existsSync(rollbackPath)).toBe(true);
    });

    it('rollback.yml should be a valid YAML file', () => {
      const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
      const content = fs.readFileSync(rollbackPath, 'utf8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('rollback.yml should use git read-tree to perform rollback', () => {
      const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
      const content = fs.readFileSync(rollbackPath, 'utf8');
      const parsedYaml = yaml.load(content);

      const rollbackJobSteps = parsedYaml.jobs.rollback.steps;
      let hasReadTree = false;
      for (const step of rollbackJobSteps) {
        if (step.run && step.run.includes('git read-tree')) {
          hasReadTree = true;
          break;
        }
      }
      expect(hasReadTree).toBe(true);
    });
  });
});
