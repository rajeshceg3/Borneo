const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have runbooks documentation with required sections', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('Incident response steps');
    expect(content).toContain('Recovery procedures');
    expect(content).toContain('Offline mode fallback guide');
  });

  it('should have a rollback CI/CD workflow configured correctly', () => {
    const workflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);

    const content = fs.readFileSync(workflowPath, 'utf8');
    const doc = yaml.load(content);

    expect(doc).toBeDefined();
    expect(doc.name).toBeDefined();
    expect(doc.on).toBeDefined();
    expect(doc.on.workflow_dispatch).toBeDefined();
    expect(doc.on.workflow_dispatch.inputs).toBeDefined();
    expect(doc.on.workflow_dispatch.inputs.commit_hash).toBeDefined();

    expect(doc.jobs).toBeDefined();
    expect(doc.jobs.rollback).toBeDefined();
    expect(doc.jobs.rollback.steps).toBeDefined();

    const rollbackStep = doc.jobs.rollback.steps.find(s => s.name === 'Perform rollback');
    expect(rollbackStep).toBeDefined();
    expect(rollbackStep.env).toBeDefined();
    expect(rollbackStep.env.COMMIT_HASH).toBe('${{ inputs.commit_hash }}');
    expect(rollbackStep.run).toContain('git read-tree -um HEAD $COMMIT_HASH');
    expect(rollbackStep.run).toContain('git push origin HEAD:${{ github.ref_name }}');
  });
});
