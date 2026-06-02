const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  it('should have docs/runbooks.md containing operational runbooks', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('Incident Response Steps');
    expect(content).toContain('Recovery Procedures');
    expect(content).toContain('Offline Mode Fallback Guide');
  });

  it('should have a valid rollback GitHub Action workflow mapping inputs to env vars', () => {
    const workflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);

    const content = fs.readFileSync(workflowPath, 'utf8');
    const parsed = yaml.load(content);

    // Check structure
    expect(parsed.name).toBe('Rollback');
    expect(parsed.on.workflow_dispatch).toBeDefined();
    expect(parsed.jobs.rollback.steps).toBeDefined();

    // Check that we map the input to an env variable instead of directly expanding it
    const runStep = parsed.jobs.rollback.steps.find(step => step.name === 'Perform Rollback');
    expect(runStep).toBeDefined();
    expect(runStep.env).toBeDefined();
    expect(runStep.env.TARGET_COMMIT).toBe('${{ inputs.target_commit }}');

    // Check that it uses the environment variable and reads tree
    expect(runStep.run).toContain('git read-tree -um HEAD $TARGET_COMMIT');
    expect(runStep.run).toContain('git commit -m "Rollback to $TARGET_COMMIT"');

    // Check that it pushes detached HEAD
    expect(runStep.run).toContain('git push origin HEAD:${{ github.ref_name }}');
  });
});
