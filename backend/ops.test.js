const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  const runbooksPath = path.resolve(__dirname, '../docs/runbooks.md');
  const rollbackWorkflowPath = path.resolve(__dirname, '../.github/workflows/rollback.yml');

  describe('Runbooks Verification', () => {
    it('should exist', () => {
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

  describe('Rollback Pipeline Verification', () => {
    it('should exist', () => {
      expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);
    });

    it('should be valid YAML', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('should have correct permissions and git config', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      const parsed = yaml.load(content);

      const rollbackJob = parsed.jobs.rollback;
      expect(rollbackJob).toBeDefined();
      expect(rollbackJob.permissions.contents).toBe('write');

      const setIdentityStep = rollbackJob.steps.find(s => s.name === 'Set Git Identity');
      expect(setIdentityStep).toBeDefined();
      expect(setIdentityStep.run).toMatch(/git config user.name "github-actions\[bot\]"/);
      expect(setIdentityStep.run).toMatch(/git config user.email "github-actions\[bot\]@users.noreply.github.com"/);
    });

    it('should correctly implement git read-tree and push', () => {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      const parsed = yaml.load(content);

      const performRollbackStep = parsed.jobs.rollback.steps.find(s => s.name === 'Perform Rollback');
      expect(performRollbackStep).toBeDefined();
      expect(performRollbackStep.env.TARGET_COMMIT).toBe('${{ inputs.target_commit }}');
      expect(performRollbackStep.run).toMatch(/git read-tree -um HEAD "\$TARGET_COMMIT"/);
      expect(performRollbackStep.run).toMatch(/git commit -m "Rollback to \$TARGET_COMMIT"/);
      expect(performRollbackStep.run).toMatch(/git push origin HEAD:\$\{\{ github.ref_name \}\}/);
    });
  });
});
