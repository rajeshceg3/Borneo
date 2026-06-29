const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {

  test('docs/runbooks.md exists and contains required sections', () => {
    const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const runbooksContent = fs.readFileSync(runbooksPath, 'utf-8');

    // Check for required sections
    expect(runbooksContent).toMatch(/Incident response steps/i);
    expect(runbooksContent).toMatch(/Recovery procedures/i);
    expect(runbooksContent).toMatch(/Offline mode fallback guide/i);
  });

  test('.github/workflows/rollback.yml is valid and contains correct configuration', () => {
    const rollbackPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const rollbackContent = fs.readFileSync(rollbackPath, 'utf-8');

    // Parse YAML to check structure
    const doc = yaml.load(rollbackContent);

    // Check job exists and permissions are correct
    expect(doc.jobs.rollback).toBeDefined();
    expect(doc.jobs.rollback.permissions.contents).toBe('write');

    // String matching for essential commands
    expect(rollbackContent).toMatch(/git read-tree/);
    expect(rollbackContent).toMatch(/git config user.name/);
    expect(rollbackContent).toMatch(/git config user.email/);
  });

});