const fs = require('fs');
const path = require('path');

describe('Infrastructure and Operational Runbooks Verification', () => {
  test('docs/runbooks.md should exist and contain required sections', () => {
    const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');

    // Check if file exists
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const runbooksContent = fs.readFileSync(runbooksPath, 'utf-8');

    // Check for required sections based on progress.md requirements
    expect(runbooksContent).toMatch(/Incident Response Steps/i);
    expect(runbooksContent).toMatch(/Recovery Procedures/i);
    expect(runbooksContent).toMatch(/Offline Mode Fallback Guide/i);
  });

  test('.github/workflows/rollback.yml should exist and contain correct rollback logic', () => {
    const rollbackPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');

    // Check if file exists
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const rollbackContent = fs.readFileSync(rollbackPath, 'utf-8');

    // Check for key elements of the rollback strategy
    expect(rollbackContent).toMatch(/name:\s*Rollback Deployment/i);
    expect(rollbackContent).toMatch(/workflow_dispatch:/i);
    expect(rollbackContent).toMatch(/git read-tree/i);
    expect(rollbackContent).toMatch(/git push origin HEAD:\$\{\{ github\.ref_name \}\}/i);
  });
});