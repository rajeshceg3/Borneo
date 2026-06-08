const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness', () => {
  it('should have runbook documentation with required sections', () => {
    const runbooksPath = path.resolve(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('Incident response steps');
    expect(content).toContain('Recovery procedures');
    expect(content).toContain('Offline mode fallback guide');
  });

  it('should have a rollback pipeline workflow', () => {
    const workflowPath = path.resolve(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);

    const fileContents = fs.readFileSync(workflowPath, 'utf8');
    const workflow = yaml.load(fileContents);

    expect(workflow.name).toBe('Rollback Pipeline');
    expect(workflow.on.workflow_dispatch).toBeDefined();
    expect(workflow.permissions.contents).toBe('write');

    const steps = workflow.jobs.rollback.steps;
    const hasGitReadTree = steps.some(step => step.run && step.run.includes('git read-tree'));
    expect(hasGitReadTree).toBe(true);
  });
});
