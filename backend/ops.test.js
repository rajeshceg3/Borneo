const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have a runbooks documentation file', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf-8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have a valid rollback workflow', () => {
    const workflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);

    const content = fs.readFileSync(workflowPath, 'utf-8');

    // Check key required elements
    expect(content).toContain('git read-tree');
    expect(content).toContain('github-actions[bot]');
    expect(content).toContain('permissions:');
    expect(content).toContain('contents: write');

    // Ensure it parses as valid YAML
    let parsedYaml;
    try {
      parsedYaml = yaml.load(content);
    } catch (e) {
      // Intentionally fail if it throws
      expect(e).toBeUndefined();
    }

    // Check specific structure points
    expect(parsedYaml.jobs.rollback.permissions.contents).toBe('write');
  });
});
