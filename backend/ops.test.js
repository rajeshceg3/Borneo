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

  it('should have a rollback CI/CD pipeline workflow', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const content = fs.readFileSync(rollbackPath, 'utf-8');
    const parsedYaml = yaml.load(content);

    expect(parsedYaml.jobs).toBeDefined();
    expect(parsedYaml.jobs.rollback).toBeDefined();
    expect(parsedYaml.jobs.rollback.permissions).toEqual({ contents: 'write' });
    expect(content).toContain('git config user.name');
    expect(content).toContain('git config user.email');
    expect(content).toContain('git read-tree');
    expect(content).toContain('git push origin HEAD');
  });
});
