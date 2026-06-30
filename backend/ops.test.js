const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  const rootPath = path.resolve(__dirname, '..');

  describe('Operational Runbooks (docs/runbooks.md)', () => {
    const runbooksPath = path.join(rootPath, 'docs', 'runbooks.md');

    it('should exist', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain "Incident response steps", "Recovery procedures", and "Offline mode fallback guide"', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Incident response steps/i);
      expect(content).toMatch(/Recovery procedures/i);
      expect(content).toMatch(/Offline mode fallback guide/i);
    });
  });

  describe('Rollback CI/CD Workflow (.github/workflows/rollback.yml)', () => {
    const rollbackPath = path.join(rootPath, '.github', 'workflows', 'rollback.yml');

    it('should exist', () => {
      expect(fs.existsSync(rollbackPath)).toBe(true);
    });

    it('should be valid YAML and have "workflow_dispatch" trigger', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      const doc = yaml.load(content);
      expect(doc).toBeDefined();
      expect(doc.on).toBeDefined();
      expect(doc.on.workflow_dispatch).toBeDefined();
      expect(doc.on.workflow_dispatch.inputs).toBeDefined();
      expect(doc.on.workflow_dispatch.inputs.target_commit).toBeDefined();
    });

    it('should use environment variables instead of string interpolation for target_commit', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      // Should find env: setup
      expect(content).toMatch(/env:\s*TARGET_COMMIT:\s*\$\{\{\s*inputs.target_commit\s*\}\}/);
      // And use it in run
      expect(content).toMatch(/\$TARGET_COMMIT/);
      // Shouldn't use direct interpolation in run block
      const doc = yaml.load(content);
      const rollbackStep = doc.jobs.rollback.steps.find(step => step.name === 'Perform Rollback');
      expect(rollbackStep).toBeDefined();
      expect(rollbackStep.run).not.toMatch(/\$\{\{\s*inputs.target_commit\s*\}\}/);
    });

    it('should configure git user to github-actions[bot]', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      const doc = yaml.load(content);
      const gitConfigStep = doc.jobs.rollback.steps.find(step => step.name === 'Configure Git');
      expect(gitConfigStep).toBeDefined();
      expect(gitConfigStep.run).toMatch(/git config user\.name "github-actions\[bot\]"/);
      expect(gitConfigStep.run).toMatch(/git config user\.email "github-actions\[bot\]@users\.noreply\.github\.com"/);
    });

    it('should use git read-tree', () => {
        const content = fs.readFileSync(rollbackPath, 'utf8');
        expect(content).toMatch(/git read-tree/);
    });
  });
});
