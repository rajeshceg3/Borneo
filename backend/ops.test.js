const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have a runbooks.md file with required sections', () => {
    const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('## Incident Response Steps');
    expect(content).toContain('## Recovery Procedures');
    expect(content).toContain('## Offline Mode Fallback Guide');
  });

  it('should have a valid rollback.yml CI/CD workflow', () => {
    const rollbackPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const fileContents = fs.readFileSync(rollbackPath, 'utf8');
    const doc = yaml.load(fileContents);

    expect(doc).toBeDefined();
    expect(doc.name).toBe('Rollback');
    expect(doc.on).toBeDefined();
    expect(doc.on.workflow_dispatch).toBeDefined();
    expect(doc.on.workflow_dispatch.inputs).toBeDefined();
    expect(doc.on.workflow_dispatch.inputs.target_commit).toBeDefined();

    expect(doc.permissions).toBeDefined();
    expect(doc.permissions.contents).toBe('write');

    expect(doc.jobs).toBeDefined();
    expect(doc.jobs.rollback).toBeDefined();
    expect(doc.jobs.rollback.steps).toBeDefined();

    const steps = doc.jobs.rollback.steps;

    const readTreeStep = steps.find(s => s.run && s.run.includes('git read-tree'));
    expect(readTreeStep).toBeDefined();
    expect(readTreeStep.env).toBeDefined();
    expect(readTreeStep.env.TARGET_COMMIT).toBeDefined();

    const pushStep = steps.find(s => s.run && s.run.includes('git push'));
    expect(pushStep).toBeDefined();
    expect(pushStep.run).toContain('${{ github.ref_name }}');
  });
});