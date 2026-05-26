const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have runbook documentation available', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    const exists = fs.existsSync(runbooksPath);
    expect(exists).toBe(true);

    if (exists) {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/Incident Response Steps/i);
      expect(content).toMatch(/Recovery Procedures/i);
      expect(content).toMatch(/Offline Mode Fallback Guide/i);
    }
  });

  it('should have a CI/CD rollback pipeline configured safely', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    const exists = fs.existsSync(rollbackWorkflowPath);
    expect(exists).toBe(true);

    if (exists) {
      const content = fs.readFileSync(rollbackWorkflowPath, 'utf8');
      const parsedYaml = yaml.load(content);

      expect(parsedYaml.on).toHaveProperty('workflow_dispatch');
      expect(parsedYaml.jobs).toHaveProperty('rollback');

      const steps = parsedYaml.jobs.rollback.steps;
      const rollbackStep = steps.find(step => step.name === 'Perform Rollback');

      expect(rollbackStep).toBeDefined();
      expect(rollbackStep.env).toHaveProperty('TARGET_COMMIT', '${{ inputs.target_commit }}');
      expect(rollbackStep.run).toContain('git read-tree -u --reset $TARGET_COMMIT');
      expect(rollbackStep.run).toContain('git push origin HEAD:${{ github.ref_name }}');
    }
  });
});
