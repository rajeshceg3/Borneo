const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have runbooks documentation', () => {
    const runbookPath = path.join(__dirname, '..', 'docs', 'runbooks.md');
    expect(fs.existsSync(runbookPath)).toBe(true);

    const runbookContent = fs.readFileSync(runbookPath, 'utf8');
    expect(runbookContent).toContain('Incident Response Steps');
    expect(runbookContent).toContain('Recovery Procedures');
    expect(runbookContent).toContain('Offline Mode Fallback Guide');
  });

  it('should have a valid CI/CD rollback pipeline', () => {
    const rollbackPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const rollbackContent = fs.readFileSync(rollbackPath, 'utf8');
    let parsedYaml;
    expect(() => {
      parsedYaml = yaml.load(rollbackContent);
    }).not.toThrow();

    expect(parsedYaml).toBeDefined();
    expect(parsedYaml.name).toBe('Rollback');
    expect(parsedYaml.on.workflow_dispatch.inputs.target_commit).toBeDefined();
    expect(parsedYaml.jobs.rollback).toBeDefined();

    // Test that the git read-tree command exists
    expect(rollbackContent).toContain('git read-tree');
    expect(rollbackContent).toContain('git push origin HEAD:${{ github.ref_name }}');
  });
});
