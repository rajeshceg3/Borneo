const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have runbook documentation with required sections', () => {
    const runbookPath = path.join(__dirname, '../docs/runbooks.md');
    const runbookContent = fs.readFileSync(runbookPath, 'utf-8');

    expect(runbookContent).toContain('## Incident Response Steps');
    expect(runbookContent).toContain('## Recovery Procedures');
    expect(runbookContent).toContain('## Offline Mode Fallback Guide');
  });

  it('should have a valid CI/CD rollback pipeline configuration', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    const rollbackContent = fs.readFileSync(rollbackPath, 'utf-8');

    // Parse YAML to ensure it's valid
    const parsedYaml = yaml.load(rollbackContent);

    // Verify key components of the rollback pipeline
    expect(parsedYaml).toHaveProperty('on.workflow_dispatch');
    expect(parsedYaml.jobs.rollback).toBeDefined();

    // Check permissions
    expect(parsedYaml.jobs.rollback.permissions.contents).toBe('write');

    // Check inputs mapping to env vars instead of string interpolation
    const performRollbackStep = parsedYaml.jobs.rollback.steps.find(step => step.name === 'Perform Rollback');
    expect(performRollbackStep).toBeDefined();
    expect(performRollbackStep.env).toBeDefined();
    expect(performRollbackStep.env.TARGET_COMMIT).toBe('${{ inputs.target_commit }}');
    expect(performRollbackStep.run).toContain('$TARGET_COMMIT');
    expect(performRollbackStep.run).not.toContain('${{ inputs.target_commit }}');
  });
});
