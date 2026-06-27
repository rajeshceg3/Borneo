const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  const rootDir = path.resolve(__dirname, '..');

  describe('Runbooks Documentation', () => {
    const runbooksPath = path.join(rootDir, 'docs', 'runbooks.md');

    test('docs/runbooks.md exists', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    test('runbooks.md contains required sections', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toContain('Incident Response Steps');
      expect(content).toContain('Recovery Procedures');
      expect(content).toContain('Offline Mode Fallback Guide');
    });
  });

  describe('CI/CD Rollback Pipeline', () => {
    const rollbackPath = path.join(rootDir, '.github', 'workflows', 'rollback.yml');

    test('rollback.yml exists', () => {
      expect(fs.existsSync(rollbackPath)).toBe(true);
    });

    test('rollback.yml contains valid YAML and required properties', () => {
      const content = fs.readFileSync(rollbackPath, 'utf8');
      const doc = yaml.load(content);

      expect(doc).toBeDefined();
      expect(doc.name).toBe('Rollback');
      expect(doc.on).toHaveProperty('workflow_dispatch');
      expect(doc.on.workflow_dispatch).toHaveProperty('inputs');
      expect(doc.on.workflow_dispatch.inputs).toHaveProperty('target_commit');

      expect(doc.jobs).toHaveProperty('rollback');
      const rollbackJob = doc.jobs.rollback;

      // Ensure the job has write permissions
      expect(rollbackJob.permissions).toHaveProperty('contents', 'write');

      // Ensure the rollback logic contains git read-tree
      const steps = rollbackJob.steps;
      const performRollbackStep = steps.find(step => step.name === 'Perform Rollback');
      expect(performRollbackStep).toBeDefined();
      expect(performRollbackStep.run).toContain('git read-tree');
      expect(performRollbackStep.run).toContain('git push origin HEAD:');
    });
  });
});
