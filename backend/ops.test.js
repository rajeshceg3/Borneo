const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  const rootDir = path.resolve(__dirname, '..');

  test('Runbooks documentation should exist and contain required sections', () => {
    const runbooksPath = path.join(rootDir, 'docs', 'runbooks.md');
    expect(fs.existsSync(runbooksPath)).toBe(true);

    const content = fs.readFileSync(runbooksPath, 'utf-8');
    expect(content).toMatch(/Incident Response Steps/i);
    expect(content).toMatch(/Recovery Procedures/i);
    expect(content).toMatch(/Offline Mode Fallback Guide/i);
  });

  test('Vercel configuration should exist and contain proper settings', () => {
    const vercelPath = path.join(rootDir, 'vercel.json');
    expect(fs.existsSync(vercelPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
    expect(config.installCommand).toBe('npm install && npm install --prefix frontend');
    expect(config.buildCommand).toBe('npm run build --prefix frontend');
    expect(config.outputDirectory).toBe('frontend/dist');
    expect(config.rewrites).toBeDefined();
    expect(config.headers).toBeDefined();
  });

  test('CI/CD rollback workflow should exist and be valid YAML with required steps', () => {
    const workflowPath = path.join(rootDir, '.github', 'workflows', 'rollback.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);

    const doc = yaml.load(fs.readFileSync(workflowPath, 'utf-8'));
    expect(doc.name).toBe('Rollback');
    expect(doc.on.workflow_dispatch).toBeDefined();

    // Check permissions
    expect(doc.permissions).toBeDefined();
    expect(doc.permissions.contents).toBe('write');

    // Check steps inside the rollback job
    const rollbackJob = doc.jobs.rollback;
    expect(rollbackJob).toBeDefined();

    const steps = rollbackJob.steps;
    expect(steps).toBeDefined();

    // We expect a configure git step and a perform rollback step
    const gitConfigStep = steps.find(s => s.name === 'Configure Git');
    expect(gitConfigStep).toBeDefined();
    expect(gitConfigStep.run).toMatch(/github-actions\[bot\]/);

    const performRollbackStep = steps.find(s => s.name === 'Perform Rollback');
    expect(performRollbackStep).toBeDefined();
    expect(performRollbackStep.run).toMatch(/git read-tree/);
    expect(performRollbackStep.env).toBeDefined();
    expect(performRollbackStep.env.TARGET_COMMIT).toBe('${{ inputs.target_commit }}');
  });
});
