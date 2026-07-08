const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have runbook documentation', () => {
    const runbookPath = path.join(__dirname, '..', 'docs', 'runbooks.md');
    expect(fs.existsSync(runbookPath)).toBe(true);

    const content = fs.readFileSync(runbookPath, 'utf8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have a rollback CI/CD pipeline', () => {
    const rollbackPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');
    expect(fs.existsSync(rollbackPath)).toBe(true);

    const content = fs.readFileSync(rollbackPath, 'utf8');
    const parsed = yaml.load(content);

    // Verify it's a workflow_dispatch event
    expect(parsed.on).toHaveProperty('workflow_dispatch');

    // Check if it has target_commit input
    expect(parsed.on.workflow_dispatch.inputs).toHaveProperty('target_commit');

    // Verify it has the expected steps including git read-tree
    let hasGitReadTree = false;
    for (const job in parsed.jobs) {
      if (parsed.jobs[job].steps) {
        for (const step of parsed.jobs[job].steps) {
          if (step.run && step.run.includes('git read-tree')) {
            hasGitReadTree = true;
          }
        }
      }
    }

    expect(hasGitReadTree).toBe(true);
  });
});