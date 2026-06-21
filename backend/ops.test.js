const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have a runbooks documentation file', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const runbooksContent = fs.readFileSync(runbooksPath, 'utf8');
    expect(runbooksContent).toContain('Incident Response Steps');
    expect(runbooksContent).toContain('Recovery Procedures');
    expect(runbooksContent).toContain('Offline Mode Fallback Guide');
  });

  it('should have a rollback CI/CD workflow configured correctly', () => {
    const rollbackWorkflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackWorkflowPath)).toBe(true);

    const rollbackContent = fs.readFileSync(rollbackWorkflowPath, 'utf8');
    const doc = yaml.load(rollbackContent);

    // Simple check ensuring the workflow exists and has a job that mentions git read-tree
    expect(doc.jobs.rollback).toBeDefined();
    expect(rollbackContent).toContain('git read-tree');
    expect(rollbackContent).toContain('git push origin HEAD:${{ github.ref_name }}');
    expect(doc.permissions.contents).toBe('write');
  });
});
