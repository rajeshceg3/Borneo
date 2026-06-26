const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Operational Runbooks', () => {
    it('should exist and contain required sections', () => {
      const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
      expect(fs.existsSync(runbooksPath)).toBe(true);

      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toContain('Incident Response Steps');
      expect(content).toContain('Recovery Procedures');
      expect(content).toContain('Offline Mode Fallback Guide');
    });
  });

  describe('Rollback Strategy Pipeline', () => {
    it('should exist and be configured correctly', () => {
      const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
      expect(fs.existsSync(rollbackPath)).toBe(true);

      const content = fs.readFileSync(rollbackPath, 'utf8');
      const parsedYaml = yaml.load(content);

      expect(parsedYaml.name).toBe('Rollback');
      expect(parsedYaml.on.workflow_dispatch).toBeDefined();
      expect(parsedYaml.jobs.rollback.permissions.contents).toBe('write');

      const steps = parsedYaml.jobs.rollback.steps;
      const configureGitStep = steps.find(step => step.name === 'Configure Git');
      expect(configureGitStep).toBeDefined();
      expect(configureGitStep.run).toContain('git config user.name "github-actions[bot]"');
      expect(configureGitStep.run).toContain('git config user.email "github-actions[bot]@users.noreply.github.com"');

      const performRollbackStep = steps.find(step => step.name === 'Perform Rollback');
      expect(performRollbackStep).toBeDefined();
      expect(performRollbackStep.run).toContain('git read-tree -um @ $TARGET_COMMIT');
      expect(performRollbackStep.run).toContain('git push origin HEAD:${{ github.ref_name }}');
    });
  });

  describe('Vercel Configuration', () => {
    it('should exist and be configured correctly', () => {
      const vercelPath = path.join(__dirname, '../vercel.json');
      expect(fs.existsSync(vercelPath)).toBe(true);

      const content = fs.readFileSync(vercelPath, 'utf8');
      const config = JSON.parse(content);

      expect(config.installCommand).toBe('npm install && npm install --prefix frontend');
      expect(config.buildCommand).toBe('npm run build --prefix frontend');
      expect(config.outputDirectory).toBe('frontend/dist');
      expect(config.rewrites).toBeDefined();
      expect(config.headers).toBeDefined();
    });
  });
});
