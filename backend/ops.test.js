const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness', () => {
  it('should have an operational runbook with necessary sections', () => {
    const runbookPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbookPath)).toBe(true);

    const content = fs.readFileSync(runbookPath, 'utf8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have a rollback CI/CD workflow configured correctly', () => {
    const rollbackPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const content = fs.readFileSync(rollbackPath, 'utf8');
    const doc = yaml.load(content);

    // Check basic workflow structure
    expect(doc).toHaveProperty('on');
    expect(doc.on).toHaveProperty('workflow_dispatch');
    expect(doc.jobs).toHaveProperty('rollback');

    const rollbackJob = doc.jobs.rollback;
    // Check permissions
    expect(rollbackJob.permissions).toHaveProperty('contents', 'write');

    // Check steps
    const steps = rollbackJob.steps;
    const hasCheckout = steps.some(step => step.uses && step.uses.startsWith('actions/checkout'));
    const hasGitConfig = steps.some(step => step.run && step.run.includes('git config user.name'));
    const hasReadTree = steps.some(step => step.run && step.run.includes('git read-tree'));
    const hasPush = steps.some(step => step.run && step.run.includes('git push origin HEAD'));

    expect(hasCheckout).toBe(true);
    expect(hasGitConfig).toBe(true);
    expect(hasReadTree).toBe(true);
    expect(hasPush).toBe(true);

    // Check that inputs are correctly bound via env
    const readTreeStep = steps.find(step => step.run && step.run.includes('git read-tree'));
    expect(readTreeStep.env).toHaveProperty('TARGET_COMMIT', '${{ inputs.target_commit }}');
  });
});
