const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Operational Readiness Tests', () => {
  describe('Runbooks Documentation', () => {
    const runbooksPath = path.join(__dirname, '..', 'docs', 'runbooks.md');

    it('should have a runbooks.md file in the docs directory', () => {
      expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain an Incident response steps section', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/## Incident response steps/i);
    });

    it('should contain a Recovery procedures section', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/## Recovery procedures/i);
    });

    it('should contain an Offline mode fallback guide section', () => {
      const content = fs.readFileSync(runbooksPath, 'utf8');
      expect(content).toMatch(/## Offline mode fallback guide/i);
    });
  });

  describe('Rollback CI/CD Workflow', () => {
    const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'rollback.yml');

    it('should have a rollback.yml file in the .github/workflows directory', () => {
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it('should be a valid YAML file', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      expect(() => yaml.load(content)).not.toThrow();
    });

    it('should contain the required workflow dispatch input for target commit', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const doc = yaml.load(content);
      expect(doc.on).toBeDefined();
      expect(doc.on.workflow_dispatch).toBeDefined();
      expect(doc.on.workflow_dispatch.inputs).toBeDefined();
      expect(doc.on.workflow_dispatch.inputs.target_commit).toBeDefined();
    });

    it('should grant contents: write permissions to the job', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const doc = yaml.load(content);
      const firstJobKey = Object.keys(doc.jobs)[0];
      const job = doc.jobs[firstJobKey];
      expect(job.permissions).toBeDefined();
      expect(job.permissions.contents).toBe('write');
    });

    it('should map the target commit input to an environment variable in a run step to prevent command injection', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const doc = yaml.load(content);
      const firstJobKey = Object.keys(doc.jobs)[0];
      const job = doc.jobs[firstJobKey];

      let hasEnvMapping = false;
      for (const step of job.steps) {
        if (step.env && step.env.TARGET_COMMIT === '${{ inputs.target_commit }}') {
          hasEnvMapping = true;
          break;
        }
      }
      expect(hasEnvMapping).toBe(true);
    });

    it('should use git read-tree in the rollback step', () => {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const doc = yaml.load(content);
      const firstJobKey = Object.keys(doc.jobs)[0];
      const job = doc.jobs[firstJobKey];

      let hasGitReadTree = false;
      for (const step of job.steps) {
        if (step.run && step.run.includes('git read-tree')) {
          hasGitReadTree = true;
          break;
        }
      }
      expect(hasGitReadTree).toBe(true);
    });
  });
});
