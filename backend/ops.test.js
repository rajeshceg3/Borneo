const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbooks Documentation', () => {
    const runbooksPath = path.resolve(__dirname, '../docs/runbooks.md');

    it('should exist', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain Incident Response Steps', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Incident Response Steps/i);
    });

    it('should contain Recovery Procedures', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Recovery Procedures/i);
    });

    it('should contain Offline Mode Fallback Guide', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Offline Mode Fallback Guide/i);
    });
  });

  describe('Rollback Workflow configuration', () => {
    const rollbackWorkflowPath = path.resolve(__dirname, '../.github/workflows/rollback.yml');

    it('should exist', () => {
      expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);
    });

    it('should have valid YAML syntax', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('should be configured to run on workflow_dispatch with target_commit input', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      const parsedYaml = yaml.load(content);

      expect(parsedYaml.on).toBeDefined();
      expect(parsedYaml.on.workflow_dispatch).toBeDefined();
      expect(parsedYaml.on.workflow_dispatch.inputs).toBeDefined();
      expect(parsedYaml.on.workflow_dispatch.inputs.target_commit).toBeDefined();
      expect(parsedYaml.on.workflow_dispatch.inputs.target_commit.required).toBe(true);
    });

    it('should have correct permissions to push commits', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      const parsedYaml = yaml.load(content);

      expect(parsedYaml.permissions).toBeDefined();
      expect(parsedYaml.permissions.contents).toBe('write');
    });

    it('should contain the rollback command logic (git read-tree)', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      expect(content).toMatch(/git read-tree -u --reset/);
      expect(content).toMatch(/git push origin HEAD:/);
      expect(content).toMatch(/git config user\.name/);
      expect(content).toMatch(/git config user\.email/);
    });
  });
});
